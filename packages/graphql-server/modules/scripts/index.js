const { gql, PubSub } = require('apollo-server')
const pubsub = new PubSub()
const { spawn } = require('child_process')
const kill = require('tree-kill')
const uuid = require('uuid/v4');
const { getElementScripts, runScript } = require('@wcfactory/common/config.js')

/**
 * Init the in memory database
 */
operations = []
operationsOutput = []

const OPERATIONS_UPDATE = 'OPERATIONS_UPDATE';
const OPERATIONS_OUTPUT = 'OPERATIONS_OUTPUT';

const updateOperation = (operation) => {
  // filter out the current operation if there is one
  const newOperations = operations.filter(i => (i.script === operation.script && i.location === operation.location) ? false : true)
  // add operation
  newOperations.push(operation)
  // save to operations
  operations = newOperations
  // notify the subscription
  pubsub.publish(OPERATIONS_UPDATE, { operationsUpdate: JSON.stringify(operation) });
}

const deleteOperation = (operation) => {
  return new Promise((response, reject) => {
    // get the operation pid to delete
    const pid = getOperationID(operation)
    if (pid) {
      kill(pid, 'SIGKILL', err => {
        if (err) {
          reject(err)
        }
        // filter out the current operation if there is one
        operations = operations.filter(i => {
          const deleted = (i.script === operation.script && i.location === operation.location)
          return !deleted
        })
        // filter out the operationsOutput array
        operationsOutput = operationsOutput.filter(i => i.operation !== pid)
        response(true)
      });
    }
    else {
      reject(new Error('No pid found.'))
    }
  })
}

const saveOperationOutput = (output) => {
  operationsOutput.push(output)
  // notify the subscription
  pubsub.publish(OPERATIONS_OUTPUT, { operationsOutput: JSON.stringify(output) });
}

// return the active operation pid based on script name and location
const getOperationID = (operation) => operations.filter(i => i.script === operation.script && i.location === operation.location).map(i => i.pid).shift()

/**
 * Define Schema
 */
const typeDefs = gql`
  type Operation {
    pid: ID!
    script: String!
    location: String!
  }

  type OperationOutput {
    operation: Operation!
    output: String
  }

  extend type Query {
    operations: [Operation!]
    operation(pid: ID!): Operation!
    operationsOutput: [OperationOutput!]
  }

  extend type Element {
    scripts: [String]
  }
  
  extend type Factory {
    scripts: [String]
  }

  extend type Mutation {
    runScript(script: String!, location: String!): Boolean
    stopScript(script: String!, location: String!): Boolean
  }

  extend type Subscription {
    operationsUpdate: String,
    operationsOutput: String
  }
`

const resolvers = {
  Subscription: {
    operationsUpdate: {
      subscribe: () => pubsub.asyncIterator([OPERATIONS_UPDATE]),
    },
    operationsOutput: {
      subscribe: () => pubsub.asyncIterator([OPERATIONS_OUTPUT])
    }
  },

  Query: {
    operations: (parent) => operations,
    operation: (parent, { pid }, ctx) => operations.filter(i => i.pid === pid),
    operationsOutput: () => operationsOutput
  },

  OperationOutput: {
    operation: ({ operation }) => operations.find(i => i.pid === operation)
  },

  Element: {
    scripts: ({ location }, args, ctx) => getElementScripts(location)
  },

  Factory: {
    scripts: ({ location }, args, ctx) => getElementScripts(location)
  },

  Mutation: {
    runScript: (_, { script, location }, ctx) => {
      try {
        // spawn the command
        const cp = spawn('npm', ['run', script], {
          cwd: location,
        })
        // save the operation
        updateOperation({ __typename: 'Operations', location, script, pid: cp.pid, id: uuid() })

        // listen for stdout
        cp.stdout.on('data', data => {
          saveOperationOutput({ __typename: 'OperationsOutput', output: data.toString(), operation: cp.pid, id: uuid() })
        })

        // verify it completed
        return true
      } catch (error) {
        throw error
      }
    },

    stopScript: async (_, { script, location }, ctx) => await deleteOperation({script, location })
  }
}

module.exports = {
  typeDefs,
  resolvers
}