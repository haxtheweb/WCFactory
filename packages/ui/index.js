import loadPolyfills from '@open-wc/polyfills-loader';

loadPolyfills().then(() => {
  import('./components/wcfactory-ui.js');
});