const gulp = require("gulp");
const connect = require("gulp-connect");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const PORT = 8054;
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const stripCssComments = require("strip-css-comments");
const decomment = require("decomment");
const packageJson = require("./package.json");

gulp.task("merge", () => {
  return gulp
    .src("./src/" + packageJson.wcfactory.elementName + ".js")
    .pipe(
      replace(
        /extends\s+packageJson.wcfactory.className\s+{/g,
        (classStatement, character, jsFile) => {
          // extract the templateUrl and styleUrl with regex.  Would prefer to do
          // this by require'ing heym-asdf.js and asking it directly, but without
          // node.js support for ES modules, we're stuck with this.
          const oneLineFile = jsFile
            .slice(character)
            .split("\n")
            .join(" ");
          const [
            ,
            templateUrl
          ] = /templateUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(oneLineFile);

          let html = fs
            .readFileSync(path.join("./src", templateUrl))
            .toString()
            .trim();

          html = decomment(html);
          // check on the HAX wiring
          const [
            ,
            HAXPropertiesUrl
          ] = /HAXPropertiesUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
            oneLineFile
          );
          let HAXProps = fs.readFileSync(path.join("./src", HAXPropertiesUrl));
          HAXProps = stripCssComments(HAXProps).trim();
          // pull properties off of the file location
          const [
            ,
            propertiesUrl
          ] = /propertiesUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(
            oneLineFile
          );
          let props = fs.readFileSync(path.join("./src", propertiesUrl));
          props = stripCssComments(props).trim();
          // pull together styles from url
          const [
            ,
            styleUrl
          ] = /styleUrl\([^)]*\)\s*{\s*return\s+"([^"]+)"/.exec(oneLineFile);
          const styleFilePath = path.join("./src", styleUrl);
          let cssResult = fs.readFileSync(styleFilePath);
          cssResult = stripCssComments(cssResult).trim();
          return `${classStatement}
  static get template() {
    return html\`
<style>
${cssResult}
</style>
${html}\`;
  }
  // haxProperty definition
  static get haxProperties() {
    return ${HAXProps};
  }
  // properties available to the custom element for data binding
  static get properties() {
    return ${props};
  }
  ${functs}`;
        }
      )
    )
    .pipe(gulp.dest("./"));
});

gulp.task("compile", () => {
  return gulp
    .src("./" + packageJson.wcfactory.elementName + ".js")
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
    .pipe(gulp.dest("./"));
});

gulp.task("watch", () => {
  return gulp.watch(
    "./src/*",
    gulp.series("merge", "compile")
  );
});

/**
 * Start server
 */
const startServer = function() {
  return connect.server({
    root: "./public",
    port: PORT
  });
};

/**
 * Stop server
 */
const stopServer = function() {
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
const handleOk = function(results) {
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
const handleError = function(e) {
  stopServer();
  console.error(e); // eslint-disable-line no-console
  throw e; // Throw to exit process with status 1.
};
const flags = {}; // available options - https://github.com/GoogleChrome/lighthouse/#cli-options

gulp.task("default", gulp.series("merge", "compile"));

gulp.task(
  "dev",
  gulp.series("merge", "compile", "watch")
);

gulp.task("lighthouse", () => {
  startServer();
  const config = { extends: "lighthouse:default" };
  return launchChromeAndRunLighthouse(
    `http://127.0.0.1:${PORT}/index.html`,
    flags,
    config
  )
    .then(handleOk)
    .catch(handleError);
});
