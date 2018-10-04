const { factoryOptions, buildOptions } = require('@wcfactory/common/config')

export const questions = [
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
  },
  {
    type: "list",
    name: "factory",
    message: "Factory to build from",
    store: true,
    choices: factoryOptions
  },
  {
    type: "list",
    name: "build",
    message: "Type of build target",
    store: true,
    choices: buildOptions
  }
]