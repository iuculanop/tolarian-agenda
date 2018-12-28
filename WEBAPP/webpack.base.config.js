/* jslint node: true */

// Base root of the applications (used to rewrite relative URLs)
const publicPath = '/';

// Definitions of the Single Page Applications.
// Each element has:
// - a key
// - a template file (JS and CSS are automagically injected)
// - an output filename (relative to dist/)
// - a JS entry point (or an array of entry points)
const apps = {
  registridoce: {
    template: 'app/templates/mtgorganizer.jade',
    filename: 'default.htm',
    js: [
      'app/mtgorganizer.js', // the app's entry point
    ],
  },
};

// List of the external libraries.
// For convenience, these libraries will be bundled together
// in a separate file (dist/scripts/vendor.js).
// This list can be empty.
const vendorLibs = [
//  'jquery',
  'bootstrap-loader',
  'font-awesome-webpack',
//  'react-dom', 'react',
//  'redux', 'redux-logger', 'react-redux', 'reselect',
//  'react-router', 'react-router-redux',
//  'redux-thunk',
//  'moment',
//  'query-string',
//  'classnames',
];

module.exports = {
  publicPath,
  apps,
  vendorLibs,
  externals: {
    // // Example: require("jquery") is external and available
    // // on the global var jQuery
    // 'jquery': 'jQuery',
  },
  profile: false,                 // NOTE: Set to true for building stats
  tryToSupportOldBrowser: true,   // NOTE: could be useful to support old browsers
  cssStylePrefix: 'unimi-events', // NOTE: used to isolate CSS selectors inside the application
  locales: ['it', 'en'],          // NOTE: List of locales bundled with the app
  server: {
    protocol: 'http',             // One of https or http
    outFQDN: 'iuculano.divsi.unimi.it',
    listenAddr: '0.0.0.0',
    listenPort: 3000,
    serverKey: 'cert/privkey.pem',
    serverCert: 'cert/fullchain.pem',
    serverCA: 'cert/chain.pem',
  },
};
