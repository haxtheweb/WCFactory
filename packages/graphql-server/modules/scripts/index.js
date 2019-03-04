const { gql, PubSub } = require('apollo-server')
const pubsub = new PubSub()
const { getElementScripts, runScript } = require('@wcfactory/common/config.js')

/**
 * Init the in memory database
 */
operations = []

const OPERATIONS_UPDATE = 'OPERATIONS_UPDATE';

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
        runScript(script, location)
        // add to operations
        operations.push({location, script})
        // notify the subscription
        pubsub.publish(OPERATIONS_UPDATE, { operationsUpdate: JSON.stringify({ script, location }) });
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