# How do I use this?
Edit `app/package.json` to include the assets you need to import.

Edit `app/src/app.js` to add additional imported assets you want available. This is your entrypoint to your application. You can tweak `app/src/index.html` but it probably is fine as is. Occationally if your element imports assets dynamically (css, img, etc) then you may need to modify the `extraDependencies` piece of the `polymer.json` file, otherwise it's default configuration should be fine.

## index.html
To deploy and implement your build you can use one of the following integrations. The default index.html here shows the simplest possible integration routine which is simply to reference the `app/dist/build.js` file located in the `app/dist/` directory.

Copy this directory to your application, reference `app/dist/build.js` and it should work on it's own.

## advanced.html
Advanced shows some of the global variables you can set in order to customize the integration location. This is useful for CDN based deployments and special exceptions to our standardized build integration routine.

## head tags
Both examples should have copy and paste style head tags that will optimize the delivery of these unbundled assets in an application agnostic way.