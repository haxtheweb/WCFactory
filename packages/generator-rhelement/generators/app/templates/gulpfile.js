const gulp = require('gulp');
const connect = require('gulp-connect');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const PORT = 8054;
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const stripCssComments = require("strip-css-comments");
const trim = require("trim");
const decomment = require("decomment");
const sourcemaps = require("gulp-sourcemaps");
const uglifyES6 = require("gulp-uglify-es").default;
const uglifyES5 = require("gulp-uglify");
const gulpif = require("gulp-if");
const babel = require("gulp-babel");
<%_ if (useSass) { _%>
const sass = require('node-sass');
<%_ } _%>

gulp.task("compile", () => {
  //const htmlMinifier = require('gulp-html-minifier');
  const mergeStream = require("merge-stream");
  const PolymerProject = require("polymer-build").PolymerProject;
  const forkStream = require("polymer-build").forkStream;
  const project = new PolymerProject({
    npm: true,
    moduleResolution: "node",
    extraDependencies: [
      'node_modules/@webcomponents/webcomponentsjs/**'
    ]
  });
  const cssSlam = require("css-slam").gulp;
  // create a build stream that we'll fork against to keep getting
  // different types of build routines
  const buildStream = mergeStream(project.sources(), project.dependencies());
  // Create a build pipeline to pipe both streams together to the 'build/' dir
  // Fork your build stream to write directly to the 'build/unbundled' dir
  const es6BuildStream = forkStream(buildStream)
    .pipe(gulpif(/\.js$/, uglifyES6()))
    .pipe(gulpif(/\.css$/, cssSlam()))
    .pipe(gulp.dest("build/es6"));
  // Fork your build stream to bundle your application and write to the 'build/bundled' dir
  const es5BuildStream = forkStream(buildStream)
    .pipe(project.addCustomElementsEs5Adapter())
    .pipe(
      gulpif(
        /\.js$/,
        babel({
          presets: ["@babel/env"]
        })
      )
    )
    .pipe(gulpif(/\.js$/, uglifyES5()))
    .pipe(gulpif(/\.css$/, cssSlam()))
    .pipe(gulp.dest("build/es5"));

  return gulp
    .src("./<%= elementName %>.js")
    .pipe(
      replace(
        /^(import .*?)(['"]\.\.\/(?!\.\.\/).*)(\.js['"];)$/gm,
        "$1$2.umd$3"
      )
    )
    .pipe(
      rename({
        suffix: ".umd"
      })
    )
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(uglifyES5())
    .pipe(gulp.dest("./"));
});

gulp.task("watch", () => {
  return gulp.watch("./src/*", gulp.series("merge", "compile", "cleanup"));
});

gulp.task("merge", () => {
  return gulp
    .src("./src/<%= elementName %>.js")
    .pipe(
    replace(/extends\s+<%= customElementClass %>\s+{/g, (classStatement, character, jsFile) => {
        // extract the templateUrl and styleUrl with regex.  Would prefer to do
        // this by require'ing <%= elementName %>.js and asking it directly, but without
        // node.js support for ES modules, we're stuck with this.
        const oneLineFile = jsFile.slice(character).split("\n").join(" ");
        const [
          ,
          templateUrl
        ] = /templateUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
          oneLineFile
        );

        let html = fs
          .readFileSync(path.join("./src", templateUrl))
          .toString()
          .trim();

        html = decomment(html);
        // pull properties off of the file location
        const [
          ,
          propertiesUrl
        ] = /propertiesUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
          oneLineFile
        );
        let props = fs.readFileSync(path.join("./src", propertiesUrl));
        props = stripCssComments(props).trim();
        // convert to object so we can build functions
        const propObject = JSON.parse(props);
        var functs = '';
        _.forEach(propObject, (prop) => {
          if (prop.observer) {
            functs += `  // Observer ${prop.name} for changes
  _${prop.name}Changed (newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      console.log(newValue);
    }
  }` + "\n\n";
          }
        });
        // pull together styles from url
        const [
          ,
          styleUrl
        ] = /styleUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
          oneLineFile
        );
        const styleFilePath = path.join("./src", styleUrl);
<%_ if (useSass) { _%>
        let cssResult = sass.renderSync({
          file: styleFilePath
        }).css;
<%_ } else { _%>
        let cssResult = fs.readFileSync(styleFilePath);
<%_ } _%>
        cssResult = stripCssComments(cssResult).trim();
        return `${classStatement}
  <%= templateReturnFunctionPart %>\`
<style>
${cssResult}
</style>
${html}\`;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return ${props};
  }
  ${functs}`;
      })
    )
    .pipe(gulp.dest("./"));
});

// shift build files around a bit and build source maps
gulp.task("cleanup", () => {
  gulp
    .src("./<%= elementName %>.js")
    .pipe(sourcemaps.init())
    .pipe(uglifyES6())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./"));
  return gulp
    .src("./<%= elementName %>.js")
    .pipe(
      rename({
        suffix: ".es5"
      })
    )
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(sourcemaps.init())
    .pipe(uglifyES5())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./"));
});

/**
 * Start server
 */
const startServer = function () {
  return connect.server({
    root: './public',
    port: PORT,
  });
};

/**
 * Stop server
 */
const stopServer = function () {
  connect.serverClose();
};

/**
 * Run lighthouse
 */
function launchChromeAndRunLighthouse(url, flags, config = null) {
  return chromeLauncher.launch().then(chrome => {
    flags.port = chrome.port;
    return lighthouse(url, flags, config).then(results =>
      chrome.kill().then(() => results)
    );
  });
}

/**
 * Handle ok result
 * @param {Object} results - Lighthouse results
 */
const handleOk = function (results) {
  stopServer();
  console.log(results); // eslint-disable-line no-console
  // TODO: use lighthouse results for checking your performance expectations.
  // e.g. process.exit(1) or throw Error if score falls below a certain threshold.
  // if (results.audits['first-meaningful-paint'].rawValue > 3000) {
  //   console.log(`Warning: Time to first meaningful paint ${results.audits['first-meaningful-paint'].displayValue}`);
  //   process.exit(1);
  // }
  return results;
};

/**
 * Handle error
 */
const handleError = function (e) {
  stopServer();
  console.error(e); // eslint-disable-line no-console
  throw e; // Throw to exit process with status 1.
};
const flags = {}; // available options - https://github.com/GoogleChrome/lighthouse/#cli-options

gulp.task("default", gulp.series("merge", "compile", "cleanup"));

gulp.task("dev", gulp.series("merge", "compile", "cleanup", "watch"));

gulp.task('lighthouse', () => {
  startServer();
  const config = { extends: 'lighthouse:default' };
  return launchChromeAndRunLighthouse(`http://127.0.0.1:${PORT}/index.html`, flags, config)
    .then(handleOk)
    .catch(handleError);
});