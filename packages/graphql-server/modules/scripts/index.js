const { gql, PubSub } = require('apollo-server')
const { spawn } = require('child_process')
const pubsub = new PubSub()
const { getElementScripts, runScript } = require('@wcfactory/common/config.js')

/**
 * Init the in memory database
 */
operations = []

const OPERATIONS_UPDATE = 'OPERATIONS_UPDATE';
const OPERATIONS_CHILD_PROCESS = 'OPERATIONS_CHILD_PROCESS';

/**
 * Define Schema
 */
const typeDefs = gql`
  type Operation {
    script: String!
    location: String!
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
    operationsUpdate: String,
    operationsChildProcess: String
  }
` 

const resolvers = {
  Subscription: {
    operationsUpdate: {
      subscribe: () => pubsub.asyncIterator([OPERATIONS_UPDATE]),
    },
    operationsChildProcess: {
      subscribe: () => pubsub.asyncIterator([OPERATIONS_CHILD_PROCESS]),
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
        spawn('npm', ['run', script], {
          cwd: location,
        }).stdout.on('data', data => {
          pubsub.publish(OPERATIONS_CHILD_PROCESS, { operationsChildProcess: data.toString()});
          return true
        })
        const operation = {location, script, __typename: 'Operations'} 
        // add to operations
        operations.push(operation)
        // notify the subscription
        pubsub.publish(OPERATIONS_UPDATE, { operationsUpdate: JSON.stringify(operation) });
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