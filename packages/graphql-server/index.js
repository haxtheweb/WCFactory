const { ApolloServer, gql, PubSub } = require('apollo-server');
const { factoryOptions, getElements } = require('@wcfactory/common/config')
const pubsub = new PubSub()

const STREAM_UPDATED = 'STREAM_UPDATED';

/**
 * SDK
 */
const getFactories = () => factoryOptions().map(i => Object.assign({ name: i.name, location: i.value}))
const getFactoryElements = (location) => getElements(location).map(i => Object.assign(i, { factory: getFactories().find(i => i.location === location)}))

/**
 * Define Schema
 */
const typeDefs = gql`
  type Factory {
    location: String!
    name: String
  }

  type Element {
    name: String
    location: String
    version: String
    private: Boolean
    factory: Factory!
  }

  type Subscription {
    streamUpdated: String
  }

  type Query {
    factories: [Factory]
    elements(factoryLocation: String): [Element]!
  }

  type Mutation {
    startStream(factoryLocation: String): Boolean!
  }
`;

/**
 * Resolvers
 */
const resolvers = {
  Query: {
    factories: () => getFactories(),
    elements: (parent, { factoryLocation }) => getFactoryElements(factoryLocation)
  },
  Subscription: {
    streamUpdated: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([STREAM_UPDATED]),
    },
  },
  Mutation: {
    startStream(root, args, context) {
      pubsub.publish(STREAM_UPDATED, { streamUpdated: 'asdf'});
      return true
    },
  },
};

/**
 * Create and start server
 */
const server = new ApolloServer({ cors: true, typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});