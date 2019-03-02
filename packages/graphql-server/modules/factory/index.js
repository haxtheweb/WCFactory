const { gql } = require('apollo-server')
const { factoryOptions, getElements } = require('@wcfactory/common/config')

/**
 * SDK
 */
const getFactories = () => factoryOptions().map(i => Object.assign({ name: i.name, location: i.value}))

/**
 * Define Schema
 */
const typeDefs = gql`
  extend type Query {
    factory(name: ID!): Factory
    factories: [Factory]
  }

  type Factory {
    name: ID!
    location: String!
  }
` 

const resolvers = {
  Query: {
    factory: (_, {name}, ctx) => getFactories().find(i => i.name === name),
    factories: () => getFactories()
  },
}

module.exports = {
  typeDefs,
  resolvers
}