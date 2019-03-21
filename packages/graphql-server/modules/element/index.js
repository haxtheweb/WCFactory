const { gql } = require('apollo-server')
const { getElements, getFactories, getElementByLocation } = require('@wcfactory/common/config')

/**
 * SDK
 */
const getFactoryElements = (factory) => getElements(factory).map(i => Object.assign(i, { factory: getFactories().find(i => i.name === factory)}))

/**
 * Define Schema
 */
const typeDefs = gql`
  extend type Query {
    element(factory: ID!, name: String!): Element
    elements(factory: ID!): [Element]
  }

  extend type Factory {
    elements: [Element]
  }

  extend type Operation {
    element: Element!
  }

  type Element {
    name: ID!
    location: String
    version: String
    private: Boolean
  }
` 

const resolvers = {
  Query: {
    element: (_, {factory, name}, ctx) =>
      getElements(factory)
        .find(i => i.name === name)
        .map(i => Object.assign({}, i, { factory: getFactory() })),

    elements: (_, {factory}) => getElements(factory)
  },

  Factory: {
    elements({name}, args, context) {
      const factory = name
      return getElements(factory)
    }
  },

  Operation: {
    element: ({ location }) => getElementByLocation(location)
  }
}

module.exports = {
  typeDefs,
  resolvers
}