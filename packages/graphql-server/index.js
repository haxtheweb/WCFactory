const { ApolloServer } = require('apollo-server')

const server = new ApolloServer({
  modules: [
    require('./modules/factory'),
    require('./modules/element'),
  ]
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url} & ${subscriptionsUrl}`);
})