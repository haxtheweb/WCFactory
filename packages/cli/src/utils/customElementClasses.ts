const _ = require("lodash");
const fs = require('fs');
const cwd = process.cwd();
const packageJson = require(`${cwd}/package.json`);
const elementsDirectory = `${cwd}/elements/`;
const wcfLibrariesCache = JSON.parse(fs.readFileSync(`${cwd}/.wcflibcache.json`, 'utf8'));

/**
 * Get the list of the custom element classes in the factory
 */
export const getCustomElementClasses = () : any => {
  const wcfLibraries: any = []
  // generated dynamically
  let customElementClassChoices: any = [];
  // array into nestings we need to simplify yo work
  _.forEach(wcfLibrariesCache, (lib: any, key: any) => {
    if (typeof lib.name !== typeof undefined) {
      // @notice this effectively assumes there is only 1 def per class
      wcfLibraries[key] = lib;
      customElementClassChoices.push({
        name: `${lib.name} -- ${lib.description}. ${Object.keys(lib.dependencies).length} dependencies`,
        value: key
      });
    }
  });

  return customElementClassChoices
}