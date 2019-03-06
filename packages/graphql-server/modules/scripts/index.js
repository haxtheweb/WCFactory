const { gql, PubSub } = require('apollo-server')
const { spawn } = require('child_process')
const pubsub = new PubSub()
const { getElementScripts, runScript } = require('@wcfactory/common/config.js')

/**
 * Init the in memory database
 */
operations = []

const OPERATIONS_UPDATE = 'OPERATIONS_UPDATE';

const updateOperation = (operation) => {
  // filter out the current operation if there is one
  const newOperations = operations.filter(i => (i.script === i.script && i.location === operation.location) ? false : true)
  // add operation
  newOperations.push(operation)
  // save to operations
  operations = newOperations
  // notify the subscription
  pubsub.publish(OPERATIONS_UPDATE, { operationsUpdate: JSON.stringify(operation) });
}

/**
 * Define Schema
 */
const typeDefs = gql`
  type Operation {
    script: String!
    location: String!
    pid: String
    output: [String]
  }

  extend type Query {
    operations: [Operation!]
  }

  extend type Element {
    scripts: [String]
  }
  
  extend type Factory {
    scripts: [String]
  }

  extend type Mutation {
    runScript(script: String!, location: String!): Boolean
  }

  extend type Subscription {
    operationsUpdate: String
  }
` 

const resolvers = {
  Subscription: {
    operationsUpdate: {
      subscribe: () => pubsub.asyncIterator([OPERATIONS_UPDATE]),
    }
  },

  Query: {
    operations: () => operations
  },

  Element: {
    scripts: ({location}, args, ctx) => getElementScripts(location)
  },

  Factory: {
    scripts: ({location}, args, ctx) => getElementScripts(location)
  },

  Mutation: {
    runScript: (_, {script, location}, ctx) => {
      try {
        let operation = { __typename: 'Operations', location, script } 
        // spawn the command
        const cp = spawn('npm', ['run', script], {
          cwd: location,
        })
        // save pid
        operation = Object.assign({}, operation, { pid: cp.pid, output: [] })
        // save the operation
        updateOperation(operation)

        // listen for stdout
        cp.stdout.on('data', data => {
          // save the operation
          operation.output.push(data.toString())
          updateOperation(operation)
        })

        // verify it completed
        return true
      } catch (error) {
        throw error
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}