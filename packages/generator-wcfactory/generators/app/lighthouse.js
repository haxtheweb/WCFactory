const gulp = require("gulp");
const connect = require("gulp-connect");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const PORT = 8054;
const flags = {}; // available options - https://github.com/GoogleChrome/lighthouse/#cli-options

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

/**
 * Start server
 */
const startServer = function () {
  return connect.server({
    root: "./public",
    port: PORT
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
