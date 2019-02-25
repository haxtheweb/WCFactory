const { factoryLocations, getElements, getElementScripts } = require('@wcfactory/common/config')

let FACTORY_CHOICE = null
let ELEMENT_CHOICE = null

const questions = [
  {
    type: "list",
    name: "factory",
    message: "Factory to build from",
    store: true,
    choices: factoryLocations
  },
  {
    type: "list",
    name: "element",
    message: "Choose your element",
    when: (answers) => {
      // forward the answer to other choices
      FACTORY_CHOICE = answers.factory
      return true
    },
    choices: (answers) => {
      // get the list of elements for this factory
      const elements = getElements(FACTORY_CHOICE)
      // format the element for the list
      return elements.map(i => Object.assign(i, { value: i.location }))
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