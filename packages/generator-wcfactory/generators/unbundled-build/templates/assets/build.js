window.process = {env: {NODE_ENV: "production"}};
var cdn = "./";
var fname = "wc-registry.json";
if (window.__appCDN) {
  cdn = window.__appCDN;
}
if (window.WCGlobalRegistryFileName) {
  fname = window.WCGlobalRegistryFileName;
}
window.WCAutoloadRegistryFile = cdn + fname;
try {
  var def = document.getElementsByTagName("script")[0];
  // if a dynamic import fails, we bail over to the compiled version
  new Function("import('');");
  // insert polyfille for web animations
  var ani = document.createElement("script");
  ani.src = cdn + "build/es6/node_modules/web-animations-js/web-animations-next-lite.min.js";
  def.parentNode.insertBefore(ani, def);
  var build = document.createElement("script");
  build.src = cdn + "build/es6/node_modules/@lrnwebcomponents/wc-autoload/wc-autoload.js";
  build.type = "module";
  def.parentNode.insertBefore(build, def);
} catch (err) {
  var legacy = document.createElement("script");
  legacy.src = cdn + "assets/build-legacy.js";
  def.parentNode.insertBefore(legacy, def);
}