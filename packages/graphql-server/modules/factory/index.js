const { gql } = require('apollo-server')
const { factoryOptions, getElements, factoryDir } = require('@wcfactory/common/config')
const { spawn } = require('child_process')
const path = require('path')

/**
 * SDK
 */
const getFactories = () => factoryOptions().map(i => formatFactory(i))
const getFactory = (name) => getFactories().map(i => formatFactory(i)).find(i => i.name === name)
const formatFactory = (factory) => Object.assign({}, {
  id: `factory:${factory.value}`,
  name: factory.name,
  location: factory.value,
  output: factoryGetOutput(`factory:${factory.value}`),
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
 * @param {FactoryScript.id} id 
 */
const factorySetOutput = (id, output) => {
  let newFactoryScripts = factoryScripts.filter(i => i.id !== id)
  factoryScripts = [...newFactoryScripts, { id, output }]
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
      const cp = spawn('wcf', ['factory', `--name=${name}`, `--humanName=${humanName}`, `--description=${description}`, `--orgGit=${orgGit}`, `--orgNpm=${orgNpm}`, `--gitRepo=${gitRepo}`, '-y'])
      cp.stdout.on('data', data => {
        console.log('data:', data.toString())
        const output = data.toString()
        const factoryId = `factory:${path.join(factoryDir, name)}`
        factorySetOutput(factoryId, output)
      })
      return true
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}