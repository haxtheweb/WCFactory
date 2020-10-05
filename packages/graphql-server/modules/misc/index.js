const { gql } = require('apollo-server')
const { spawn } = require('child_process')
const { existsSync } = require('fs')
const { config } = require('@wcfactory/common/config.js')
const open = require('open');

const typeDefs = gql`
  extend type Mutation {
    openLocation(location: String!): Boolean
  }
`

const resolvers = {
  Mutation: {
    openLocation: (_, {location}, ctx) => {
      try {
        // check if the location exists
        if (!existsSync(location)) throw new Error('That location does not exist.')
        if (typeof config.openCmd !== 'undefined') {
          spawn('code', [location])
        }
        else {
          open(location)
        }
        // attempt to spawn the open command
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