const { ApolloServer, gql, PubSub } = require('apollo-server');
const { factoryOptions, getElements } = require('@wcfactory/common/config')
const pubsub = new PubSub()

const STREAM_UPDATED = 'STREAM_UPDATED';

// get factories
const getFactories = () => factoryOptions().map(i => Object.assign({ name: i.name, location: i.value}))
const getFactoryElements = (location) => getElements(location).map(i => Object.assign(i, { factory: getFactories().find(i => i.location === location)}))

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
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

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    factories: [Factory]
    elements(factoryLocation: String): [Element]!
  }

  type Mutation {
    startStream(factoryLocation: String): Boolean!
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
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

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ cors: true, typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});