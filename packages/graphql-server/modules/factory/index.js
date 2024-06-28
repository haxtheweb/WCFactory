const { gql, PubSub } = require('apollo-server')
const pubsub = new PubSub()
const { factoryOptions, getElements, factoryDir } = require('@wcfactory/common/config')
const { spawn } = require('child_process')
const path = require('path')
const kill = require('tree-kill')

/**
 * SDK
 */
const getFactories = () => factoryOptions().map(i => formatFactory(i))
const getFactory = (name) => getFactories().find(i => i.name === name)
const formatFactory = (factory) => Object.assign({}, {
  id: `${factory.value}`,
  name: factory.name,
  location: factory.value,
  output: factoryGetOutput(`${factory.value}`),
  __typename: 'Factory'
})

/**
 * Get any factory output
 * @param {FactoryScript.id} id 
 */
const factoryGetOutput = (id) =>  {
  const found = factoryScripts.find(i => i.id === id)
  if (found) {
    return found.output
  }
  return null
}

/**
 * Update the factory set output list
 * @param {Factory} factory
 */
const factorySetOutput = (factory, output) => {
  const newfactory = Object.assign({}, factory, { output })

  // save new factory output
  let newFactoryScripts = factoryScripts.filter(i => i.id !== factory.id)
  factoryScripts = [...newFactoryScripts, newfactory]

  // publish over websocket
  pubsub.publish(FACTORY_UPDATE, { factoryUpdate: JSON.stringify(newfactory) })
}

/**
 * Update the factory set output list
 * @param {FactoryScript.id} id 
 */
const factoryDeleteOutput = (id) => {
  let newFactoryScripts = factoryScripts.filter(i => i.id !== id)
  factoryScripts = [...newFactoryScripts]
}

/**
 * @typedef {Object} FactoryScript
 * @property {string} id factory id
 * @property {string} output factory output
 */

/**
 * @typedef {FactoryScript[]} FactoryScripts
 */
let factoryScripts = []



/**
 * Subscriptions
 */
const FACTORY_UPDATE = 'FACTORY_UPDATE'


/**
 * Define Schema
 */
const typeDefs = gql`
  extend type Query {
    factory(name: String!): Factory
    factories: [Factory]
  }

  extend type Mutation {
    createFactory(createFactoryInput: CreateFactoryInput): Factory
  }

  extend type Subscription {
    factoryUpdate: String
  }

  type Factory {
    id: ID!
    name: String!
    location: String!
    output: String
  }

  input CreateFactoryInput {
    name: String!
    humanName: String!
    description: String!
    orgGit: String!
    orgNpm: String!
    gitRepo: String!
  }
` 

const resolvers = {
  Query: {
    factory: (_, {name}, ctx) => getFactory(name),
    factories: () => getFactories()
  },
  Mutation: {
    createFactory: (_, { createFactoryInput: { name, humanName, description, orgGit, orgNpm, gitRepo }}) => {
      const factoryId = `${path.join(factoryDir, name)}`
      const location = `${path.join(factoryDir, name)}`
      // assemble new factory
      const factory = { id: factoryId, name, location, output: 'initializing', __typename: 'Factory' }

      // create the new factory with wcf factory
      const cp = spawn('wcf', ['factory', `--name=${name}`, `--humanName=${humanName}`, `--description=${description}`, `--orgGit=${orgGit}`, `--orgNpm=${orgNpm}`, `--gitRepo=${gitRepo}`, '-y'])
      cp.stdout.on('data', data => {
        const output = data.toString()
        if (output.includes('Initialized empty Git')) factorySetOutput(factory, `Initialized empty Git`)
        if (output.includes('Resolving packages')) factorySetOutput(factory, `Resolving packages`)
        if (output.includes('Fetching packages')) factorySetOutput(factory, `Fetching packages`)
        if (output.includes('Linking dependencies')) factorySetOutput(factory, `Linking packages`)
        if (output.includes('Building fresh packages')) factorySetOutput(factory, `Building fresh packages`)
        if (output.includes('master (root-commit)')) factorySetOutput(factory, `Wrapping up!`)
      })
      cp.on('close', (code) => {
        // set the output to null
        factorySetOutput(factory, null)
        // delete output in storage
        factoryDeleteOutput(factoryId)
      });

      // return the new factory for the user
      return factory
    }
  },
  Subscription: {
    factoryUpdate: {
      subscribe: () => pubsub.asyncIterator([FACTORY_UPDATE])
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}