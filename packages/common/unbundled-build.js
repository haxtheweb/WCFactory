const cp = require("child_process");
// @todo this should be handled better
const path = require("path");
const polymer = path.join(require.resolve("polymer-cli"), '../../bin/polymer.js');
const glob = require("glob");
const Terser = require("terser");
const chalk = require("chalk");
const stripAnsi = require("strip-ansi");
const rimraf = require("rimraf");
const fs = require("fs-extra");


const build = () => {
  // Moving index.html
  const spawn = cp.spawn(polymer, ["build"], {
    cwd: process.cwd(),
    stdout: 'inherit'
  });
  spawn.stdout.on('data', data => {
    let output = data.toString();
    output = stripAnsi(output);
    output = output.replace(/info(.)[\s]/gm, '');
    output = output.trim();
    console.log(output);
  });
  spawn.on('close', code => {
    // delete distributed build directory prior to creation of a new one
    fs.rmdirSync(path.join(process.cwd(), 'dist/build'), { recursive: true });
    // move files to productionb build path
    fs.renameSync(path.join(process.cwd(), 'build'), path.join(process.cwd(), 'dist/build'), () => { return true;});
    // Run terser
    runTerser({
      name: 'es6',
      pattern: path.join(process.cwd(), "dist/build/es6/**/*.js"),
      terserOpts: {
        ecma: 2017,
        keep_fnames: true,
        mangle: false,
        module: true
      }
    })
    // Run terser
    runTerser({
      name: 'es6-amd',
      pattern: path.join(process.cwd(), "dist/build/es6-amd/**/*.js"),
      terserOpts: {
        keep_fnames: true,
        mangle: false,
        module: true,
        safari10: true,
      }
    })
    moveFiles({ name: `html files`, pattern: "*.html" });
  })
}

const moveFiles = ({ name, pattern }) => {
  // copy assets directory
  const assetsDir = path.join(process.cwd(), `src`, `assets`);
  const assetsDirNew = path.join(assetsDir.replace(path.join(process.cwd(), 'src'), path.join(process.cwd(), 'dist')));
  // remove old dir
  rimraf.sync(assetsDirNew);
  fs.copy(assetsDir, assetsDirNew);
  console.log(`Copying assets directory...`)

  glob(path.join(process.cwd(), `src`, pattern), null, function (er, files) {
    let itemsProcessed = 0;
    files.forEach((file) => {
      let contents = fs.readFileSync(file, 'utf8');
      contents = contents.replace('app.js', 'build.js');
      const newPath = path.join(file.replace(path.join(process.cwd(), 'src'), path.join(process.cwd(), 'dist')));
      if (!fs.existsSync(path.dirname(newPath))){
        fs.mkdirSync(path.dirname(newPath));
      }
      fs.writeFileSync(newPath, contents, 'utf8');
      itemsProcessed++;
      if (itemsProcessed === files.length) {
        console.log(`${name} move complete!`);
      }
    })
  })
}

const runTerser = ({ name, pattern, terserOpts }) => {
  console.log(`(${name}) Optimizing...`);
  glob(pattern, null, function (er, files) {
    let itemsProcessed = 0;
    files.forEach((file) => {
      const newFile = Terser.minify(fs.readFileSync(file, 'utf-8'), terserOpts);
      fs.writeFileSync(file, newFile.code, 'utf8');
      itemsProcessed++;
      if (itemsProcessed === files.length) {
        console.log(`(${name}) Optimizing complete!`);
      }
    })
  })
}

module.exports = build;
