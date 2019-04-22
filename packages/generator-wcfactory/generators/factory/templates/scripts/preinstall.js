const fs = require('fs')
const path = require('path')
const pkgJson = require('../package.json')

// get the factory npm org name as it is stored in node_modules
const factoryName = pkgJson.wcfactory.orgNpm

// recursively remove directory with vanilla fs
const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

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
      // remove the current node modules directory
      deleteFolderRecursive(nodeModulesDir)
  })
})