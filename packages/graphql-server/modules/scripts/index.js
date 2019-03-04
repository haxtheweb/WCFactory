const { gql } = require('apollo-server')
const { getElementScripts } = require('@wcfactory/common/config.js')

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
` 

const resolvers = {
  Element: {
    scripts: ({location}, args, ctx) => getElementScripts(location)
  },

  Factory: {
    scripts: ({location}, args, ctx) => getElementScripts(location)
  }
}

module.exports = {
  typeDefs,
  resolvers
}