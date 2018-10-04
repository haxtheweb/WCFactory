const _ = require("lodash");
const fs = require('fs');
const cwd = process.cwd();

/**
 * Get the list of wcfLibraries from cache
 */
const wcfLibraries = () => {
  const wcfLibraries = []
  // array into nestings we need to simplify yo work
  _.forEach(wcfLibrariesCache, (lib, key) => {
    if (typeof lib.name !== typeof undefined) {
      // @notice this effectively assumes there is only 1 def per class
      wcfLibraries[key] = lib;
    }
  });
  return wcfLibraries;
}

/**
 * Get a formatted list of the wcflibraries for use in a list.
 */
const wcfLibrariesListChoices = () => {
  // generated dynamically
  let wcfLibrariesListChoices = [];
  // array into nestings we need to simplify yo work
  _.forEach(wcfLibrariesCache, (lib, key) => {
    if (typeof lib.name !== typeof undefined) {
      // @notice this effectively assumes there is only 1 def per class
      wcfLibrariesListChoices.push({
        name: `${lib.name} -- ${lib.description}. ${Object.keys(lib.dependencies).length} dependencies`,
        value: key
      });
    }
  });
  return wcfLibrariesListChoices
}

/**
 * Current state of the wcf cache file.
 * @return object
 */
const wcfLibrariesCache = (() => {
  const cacheFile = `${cwd}/.wcflibcache.json`;
  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(`${cwd}/.wcflibcache.json`, 'utf8'))
  }
  return {}
})

module.exports.wcfLibraries = wcfLibraries()
module.exports.wcfLibrariesListChoices = wcfLibrariesListChoices()