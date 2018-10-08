const mix = require("laravel-mix");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
  .setPublicPath("dist")
  .js("js/app.js", "js/app.js")
  .sass("scss/app.scss", "css/app.css")
  // .disableNotifications() // Disables native Laravel Mix notifications
  .browserSync({
    proxy: "localhost", // Point this to your Grav server
    // notify: false, // Disables Browsersync notifications
    files: [
      "dist/**/*",
      "templates/**/*"
    ]
  });

// Source maps when not in production.
if (!mix.inProduction()) {
  mix.sourceMaps();
}

// Hash and version files in production.
if (mix.inProduction()) {
  mix.version();
}
