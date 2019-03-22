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
    element(factory: String!, name: String!): Element
    elements(factory: String!): [Element]
  }

  extend type Factory {
    elements: [Element]
  }

  extend type Operation {
    element: Element!
  }

  type Element {
    id: ID!
    name: String!
    location: String!
    version: String!
    private: Boolean!
  }
` 

const resolvers = {
  Query: {
    element: (_, {factory, name}, ctx) =>
      getElements(factory)
        .find(i => i.name === name)
        .map(i => Object.assign({}, i, { id: `${i.location}`})),

    elements: (_, {factory}) =>
      getElements(factory)
        .map(i => Object.assign({}, i, { id: `${i.location}`})),
  },

  Factory: {
    elements({name}, args, context) {
      const factory = name
      return getElements(factory)
        .map(i => Object.assign({}, i, { id: `${i.location}`}))
    }
  },

  Operation: {
    element: ({ location }) => {
      const element = getElementByLocation(location)
      return Object.assign({}, element, { id: `${location}`})
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}