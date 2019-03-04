const { gql } = require('apollo-server')
const { getElementScripts, runScript } = require('@wcfactory/common/config.js')

/**
 * Define Schema
 */
const typeDefs = gql`
  extend type Element {
    scripts: [String]
  }
  
  extend type Factory {
    scripts: [String]
  }

  extend type Mutation {
    runScript(script: String!, location: String!): Boolean
  }
` 

const resolvers = {
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