/**
 * Recursively finds all package.json files relative to a wcfactory Factory
 * and returns a settings object.
 * 
 * @todo think about where we want these configs, how we want overrides to work
 */
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const glob = require('glob')
const cwd = process.cwd()

/**
 * Get a singular config object for this project.
 */
const config = () => {
  const configs = getConfigs()
  const configObject = convertConfigs(configs)
  return configObject
}

/**
 * Get factories Directory
 */
const factoryDir = () => {
  return path.join(cwd, 'factories')
}

/**
 * Get a list of factory options
 */
const factoryOptions = () => {
  let factoryOptions = [];
  let folders = glob.sync(`${factoryDir()}/*`);
  _.forEach(folders, val => {
    let name = val.split("/").pop();
    factoryOptions.push({
      name: name,
      value: name
    });
  });
  return factoryOptions
}

/**
 * Get location of the build directory
 */
const buildsDir = () => {
  return path.join(cwd, 'builds')
}

/**
 * Get a list of build options
 */
const buildOptions = () => {
  let buildOptions = [];
  // array into nestings we need to simplify yo work
  _.forEach(buildData(), (val, key) => {
    if (typeof val !== typeof undefined) {
      buildOptions.push({
        name: val.name,
        value: key
      });
    }
  });
  return buildOptions
}

/**
 * Get build data
 */
const buildData = () => {
  // generated dynamically
  return {
    static: {
      name: "Static boilerplate",
      key: "Static"
    },
    cdn: {
      name: "CDN based publish",
      key: "CDN"
    },
    drupal8: {
      name: "Drupal 8 (Twig)",
      key: "Drupal-8"
    },
    drupal7: {
      name: "Drupal 7",
      key: "Drupal-7"
    }
  };
}

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

const libraries = () => {
  const libs = []
  const libsLocations = getLibrarieLocations()
  _.forEach(libsLocations, (lib, key) => {
    const packageLocation = path.join(lib, 'package.json')
    let json = JSON.parse(fs.readFileSync(packageLocation, "utf8"));
    libs.push(json)
  })
  return libs
}

/**
 * Libraries Dir
 */
const librariesDir = () => {
  return path.join(cwd, 'templates', 'libraries')
}

/**
 * Listing of library templates
 */
const librariesOptions = () => {
  // package files of each element
  let options = []
  let libraries = getLibrarieLocations()
  _.forEach(libraries, (lib, key) => {
    const packageLocation = path.join(lib, 'package.json')
    let json = JSON.parse(fs.readFileSync(packageLocation, "utf8"));
    options.push({
      name: `${json.name} -- ${json.description}. ${Object.keys(json.dependencies).length} dependencies`,
      value: key
    })
  });
  return options
}


/**
 * Returns the a list of libraries found
 */
const getLibrarieLocations = () => {
  // package files of each element
  let files = glob.sync(`${librariesDir()}/*`);
  return files
}

module.exports.config = config()
module.exports.factoryDir = factoryDir()
module.exports.factoryOptions = factoryOptions()
module.exports.buildsDir = buildsDir()
module.exports.buildOptions = buildOptions()
module.exports.buildData = buildData()
module.exports.libraries = libraries()
module.exports.librariesOptions = librariesOptions()
module.exports.librariesDir = librariesDir()
