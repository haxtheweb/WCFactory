const { factoryOptions, buildOptions } = require('@wcfactory/common/config')

const questions = [
  {
    type: "list",
    name: "factory",
    message: "Factory to build from",
    store: true,
    // we just need the name of the factory
    choices: factoryOptions()
  },
  {
    type: "list",
    name: "build",
    message: "Type of build target",
    store: true,
    choices: buildOptions
  },
  {
    type: "string",
    name: "name",
    message: "Folder name for the build",
    required: true
  },
  {
    type: "string",
    name: "description",
    message: "Brief description for the build"
  }
]

module.exports.questions = questions