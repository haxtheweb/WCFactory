const { ApolloServer } = require('apollo-server')
// Set a really high max listener.
require('events').EventEmitter.defaultMaxListeners = 1000;

const server = new ApolloServer({
  modules: [
    require('./modules/factory'),
    require('./modules/element'),
    require('./modules/scripts'),
    require('./modules/misc')
  ]
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url} & ${subscriptionsUrl}`);
})