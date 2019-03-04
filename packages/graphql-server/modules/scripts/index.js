const { gql } = require('apollo-server')
const { getElementScripts } = require('@wcfactory/common/config.js')

/**
 * Define Schema
 */
const typeDefs = gql`
  extend type Element {
    scripts: [String]
  }
` 

const resolvers = {
  Element: {
    scripts: ({location}, args, ctx) => {
      if (location) {
        const scripts = getElementScripts(location)
        return scripts
      }
      else {
        return []
      }
    }
  },
}

module.exports = {
  typeDefs,
  resolvers
}