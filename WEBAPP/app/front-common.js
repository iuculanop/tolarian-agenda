// ************************************************************
//  External styles (in their webpack-friendly package)
//
import 'font-awesome-webpack';
// Bootstrap (for customizations see file /.bootstraprc and the documentation)
import 'bootstrap-loader';
//
// ************************************************************

// Include common styles and images (also .sass/.scss are fine)

// Include a favicon to get rid of 404 errors during development
if (process.env.NODE_ENV === 'development') {
  // Image taken from google material icons
  // https://design.google.com/icons/#ic_event
  require('./images/favicon.ico'); // eslint-disable-line global-require
}
