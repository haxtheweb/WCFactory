const { spawn } = require('child_process')
const { ApolloServer, gql, PubSub } = require('apollo-server');
const { factoryOptions, getElements } = require('@wcfactory/common/config')
const pubsub = new PubSub()

const CHILD_PROCESS = 'CHILD_PROCESS';

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
    childProcess: String
  }

  type Query {
    factories: [Factory]
    elements(factoryLocation: String): [Element]!
  }

  type Mutation {
    runOperation(location: String!, operation: String): Boolean!
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
    childProcess: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([CHILD_PROCESS]),
    },
  },
  Mutation: {
    runOperation(root, { location, operation = 'dev' }, context) {
      spawn('npm', ['run', operation], { cwd: location }).stdout.on('data', function(data) {
        pubsub.publish(CHILD_PROCESS, { childProcess: data.toString()});
        return true
      });
    },
  },
};

/**
 * Create and start server
 */
const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: (params, webSocket) => {
      console.log(params)
    }
  }
});
server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url} & ${subscriptionsUrl}`);
});