const { gql } = require('apollo-server')
const { factoryOptions, getElements } = require('@wcfactory/common/config')

/**
 * SDK
 */
const getFactories = () => factoryOptions().map(i => Object.assign({ name: i.name, location: i.value}))
const getFactory = (name) => getFactories().find(i => i.name === name)

/**
 * Define Schema
 */
const typeDefs = gql`
  extend type Query {
    factory(name: ID!): Factory
    factories: [Factory]
  }

  extend type Mutation {
    createFactory(createFactoryInput: CreateFactoryInput): Boolean
  }

  type Factory {
    name: ID!
    location: String!
  }

  input CreateFactoryInput {
    name: String!
    description: String!
    gitOrg: String!
    npmOrg: String!
  }
` 

const resolvers = {
  Query: {
    factory: (_, {name}, ctx) => getFactory(name),
    factories: () => getFactories()
  },
  Mutation: {
    createFactory: (_, variables) => true
  }
}

module.exports = {
  typeDefs,
  resolvers
}