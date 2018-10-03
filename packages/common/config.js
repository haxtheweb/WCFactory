/**
 * Recursively finds all package.json files relative to a wcfactory Factory
 * and returns a settings object.
 * 
 * @todo think about where we want these configs, how we want overrides to work
 */
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

/**
 * Get a singular config object for this project.
 */
const config = (() => {
  const configs = getConfigs()
  const configObject = convertConfigs(configs)
  return config
})

/**
 * Retreive array of config objects found
 */
const getConfigs = () => {
  const packageConfigs = collectPackageConfigs()
  const userConfigs = collectUserConfigs()
  return [...packageConfigs, ...userConfigs]
}

/**
 * Recursivley build an array of package configs
 */
const collectPackageConfigs = () => {
  const cwd = process.cwd();

  let configs = []

  let _cwd = cwd
  while (path.basename(_cwd) !== '') {
    // look for package
    const p = path.join(_cwd, 'package.json')
    if (fs.existsSync(p)) {
      // push the content of the file into an array
      const packageJSONContents = JSON.parse(fs.readFileSync(p, 'utf8'))
      const wcfactorySettings = _.get(packageJSONContents, 'wcfactory')
      if (wcfactorySettings) {
        configs.push(wcfactorySettings)
      }
    }
    // move up a directory
    _cwd = path.join(_cwd, '../')
  }

  return configs
}

/**
 * Recursivley build an array of package configs
 */
const collectUserConfigs = () => {
  const cwd = process.cwd();

  let configs = []

  let _cwd = cwd
  while (path.basename(_cwd) !== '') {
    // look for package
    const c = path.join(_cwd, '.wcfconfig')
    const p = path.join(c, 'user')
    if (fs.existsSync(p)) {
      // push the content of the file into an array
      const wcfactorySettings = JSON.parse(fs.readFileSync(p, 'utf8'))
      configs.push(wcfactorySettings)
    }
    // move up a directory
    _cwd = path.join(_cwd, '../')
  }

  return configs
}

/**
 * Convert a raw array of config file contents into a single config object
 * @param configs array of config file contents
 */
const convertConfigs = (configs) => {
  const _configs = configs.reverse()
  // reverse array
  const config = _configs.reduce((acc, cur) => Object.assign(acc, cur))
  return config
}

module.exports.config = config