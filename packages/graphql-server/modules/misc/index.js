const { gql } = require('apollo-server')
const { spawn } = require('child_process')
const { existsSync } = require('fs')

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
        // attempt to spawn the open command
        spawn('code', [location])
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