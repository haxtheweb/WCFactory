const { factoryOptions, getElements, getElementScripts } = require('@wcfactory/common/config')
// fuzzy search
const Fuse = require('fuse.js')

let FACTORY_CHOICE = null
let ELEMENT_OPTIONS = null
let ELEMENT_CHOICE = null

const questions = [
  {
    type: "list",
    name: "factory",
    message: "Factory to build from",
    store: true,
    choices: () => {
      return factoryOptions()
    },
  },
  {
    type: "autocomplete",
    name: "element",
    message: "Choose your element",
    when: (answers) => {
      // forward the answer to other choices
      FACTORY_CHOICE = answers.factory
      ELEMENT_OPTIONS = getElements(FACTORY_CHOICE)
        .map(i => Object.assign(i, { value: i.location }))
      return true
    },
    source: (answers, input) => {
      const fuse = new Fuse(ELEMENT_OPTIONS, { keys: ['name'] })
      return new Promise((res,rej) => {
        // fuzzy search the elements
        if (input) {
          const result = fuse.search(input)
          res(result)
        }
        res(ELEMENT_OPTIONS)
      })
    }
  },
  {
    type: "list",
    name: "script",
    message: "Choose what operation to run.",
    store: true,
    when: (answers) => {
      // forward the answer to other choices
      ELEMENT_CHOICE = answers.element
      return true
    },
    choices: (answers) => {
      return getElementScripts(ELEMENT_CHOICE)
    }
  },
]

module.exports.questions = questions