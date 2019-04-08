const fs = require('fs-extra')
const path = require('path')
const pkgJson = require('../package.json')

// get the factory npm org name as it is stored in node_modules
const factoryName = pkgJson.wcfactory.orgNpm
/**
 * @todo this should be dynaimc probably
 */
// get elements directory in the
const elementsDir = path.join(__dirname, '../elements')

// loop through the elements directory and clean up the node_modules dir
fs.readdir(elementsDir, (err, folders) => {
  // move on to the next thing if there is an error
  if (err) return
  folders.forEach(element => {
    const elementDir = path.join(elementsDir, element)

      // re-symlink the node_modules dir
      // make sure that this is a directory
      const nodeModulesDir = path.join(elementDir, 'node_modules')
      // check if this element has a node modules dir in it
      if (fs.existsSync(nodeModulesDir)) {
        // remove the current node modules directory
        fs.removeSync(nodeModulesDir)
        // add a symlink back to the the root node modules
        fs.ensureSymlinkSync('../../node_modules', nodeModulesDir)
      }

      // remove this elements symlink in the node modules dir
      fs.emptyDirSync(path.join(elementDir, '../../node_modules', factoryName, element))
      if (fs.existsSync(path.join(elementDir, `${element}.js`))) {
        fs.ensureSymlinkSync(`../../../elements/${element}/${element}.js`, path.join(elementDir, `../../node_modules/@lrnwebcomponents/${element}/${element}.js`))
      }
      if (fs.existsSync(path.join(elementDir, `lib`))) {
        fs.ensureSymlinkSync(`../../../elements/${element}/lib`, path.join(elementDir, `../../node_modules/@lrnwebcomponents/${element}/lib`))
      }
      if (fs.existsSync(path.join(elementDir, `build`))) {
        fs.ensureSymlinkSync(`../../../elements/${element}/build`, path.join(elementDir, `../../node_modules/@lrnwebcomponents/${element}/build`))
      }
      if (fs.existsSync(path.join(elementDir, `src`))) {
        fs.ensureSymlinkSync(`../../../elements/${element}/src`, path.join(elementDir, `../../node_modules/@lrnwebcomponents/${element}/src`))
      }
      if (fs.existsSync(path.join(elementDir, `dist`))) {
        fs.ensureSymlinkSync(`../../../elements/${element}/dist`, path.join(elementDir, `../../node_modules/@lrnwebcomponents/${element}/dist`))
      }
  })
})