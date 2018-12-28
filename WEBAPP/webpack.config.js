/* jslint node: true */
'use strict'; // eslint-disable-line strict

const webpack = require('webpack');
const baseConfig = require('./webpack.base.config.js');
const apps = baseConfig.apps;
const vendorLibs = baseConfig.vendorLibs;

if (!apps) {
  throw new Error('Description of the apps is not provided. ' +
                  'Please check file "webpack.base.config.js"');
}
if (!vendorLibs) {
  throw new Error('Description of the vendor libs is not provided. ' +
                  'Please check file "webpack.base.config.js"');
}

if (!process.env.NODE_ENV ||
    (process.env.NODE_ENV !== 'production' &&
     process.env.NODE_ENV !== 'development')) {
  if (process.stderr.isTTY) { // print a warning only if started from console
    console.error('"NODE_ENV" not specified or not recognized.');
    console.error('Valid values are: "development" | "production".');
    console.error('Using "development" as default.');
  }
  process.env.NODE_ENV = 'development';
}


const browsers = [];
const additionalPlugins = [
  new webpack.ContextReplacementPlugin(
      /moment[\\/]locale$/,
    new RegExp(`^\.\/(${baseConfig.locales.join('|')})$`)
  ),
];
if (baseConfig.tryToSupportOldBrowser) {
  if (process.stderr.isTTY) console.error('Trying to support older browsers.');
  vendorLibs.unshift('babel-polyfill');
  browsers.concat(['last 5 versions', '> 0.1% in IT', '> 0.1%']);
  additionalPlugins.push(new webpack.ProvidePlugin({
    fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
  }));
} else {
  browsers.concat(['last 5 versions', '> 0.1% in IT', '> 0.1%']);
}

// generic
const path = require('path');

// Webpack
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ETP = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Post-CSS
const autoprefixer = require('autoprefixer');

// css-loader config
const styleTemplate =
        process.env.NODE_ENV === 'development' ?
          '[local]_[hash:base64:3]' :
          '[name]__[local]___[hash:base64:6]';
const css =
          `css?camelCase&localIdentName=${styleTemplate}&importLoaders=1` +
          '!postcss?pack=defaults!resolve-url';


const wpEntries = {};
const baseChunks = [];
if (vendorLibs.length > 0) {
  wpEntries.vendor = vendorLibs;
  baseChunks.push('vendor');
}

Object.keys(apps).forEach((key) => {
  let js = apps[key].js;
  if (!Array.isArray(js)) {
    js = [js];
  }
  wpEntries[key] = js.map((f) => path.resolve(__dirname, f));
});


const wpPages = [];
const finalPages = [];
Object.keys(apps).forEach((key) => {
  if (apps[key].filename) {
    wpPages.push(
      new HtmlWebpackPlugin({
        chunks: baseChunks.concat([key]),
        chunksSortMode: 'dependency',
        template: apps[key].template,
        filename: apps[key].filename,
        inject: true,
        cssStylePrefix: baseConfig.cssStylePrefix,
      }));
    finalPages.push({ name: key, link: apps[key].filename });
  }
});
/*
if (finalPages.length > 0) {
  wpPages.unshift(
    new HtmlWebpackPlugin({
      chunks: ['vendor'],
      template: 'webpack-util/templates/index-pages.ejs',
      filename: 'index.html',
      inject: false,
      pages: finalPages,
    }));
}
*/
const extractTextPlugin = new ETP('styles/[name].css'); // extract CSS from the bundle

const eslintConfig = {
  emitError: true,
  emitWarning: true,
  failOnError: false,
  failOnWarning: false,
  configFile: 'app/.eslintrc',
};

const baseWebpackConfig = {
  private: {
    extractTextPlugin,
  },
  entry: wpEntries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/[name].[id].js',
    publicPath: baseConfig.publicPath,
    server: baseConfig.server,
  },
  resolve: {
    root: path.resolve(__dirname, 'app/scripts'),
    fallback: [path.resolve(__dirname, 'manual-deps'),
               path.resolve(__dirname, 'resources'),
    ],
  },
  bail: true, // Fail fast in case of error
  externals: baseConfig.externals || {},
  plugins: additionalPlugins.concat([
    new webpack.optimize.CommonsChunkPlugin({
      names: baseChunks,
      filename: 'scripts/[name].js',
      minChunks: Infinity,
    }),
    extractTextPlugin,
    new webpack.NoErrorsPlugin(),
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true,
      dry: false,
    }),
  ]).concat(wpPages),
  module: {
    loaders: [
      { test: /\.(js|jsx)$/,
        loader: 'babel?cacheDirectory',
        include: `${__dirname}/app/`,
      },
      { test: /\.jade$/,
        loader: 'jade?pretty',
      },
      { test: /\.html$/,
        loader: 'html',
      },
      { test: /\.sass/,
        loader: ETP.extract('style', `${css}!sass?sourceMap&outputStyle=expanded&indentedSyntax`),
      },
      { test: /\.scss/,
        loader: ETP.extract('style', `${css}!sass?sourceMap&outputStyle=expanded`),
      },
      { test: /\.css$/,
        loader: ETP.extract('style', css),
      },
      { test: /bootstrap-sass\/assets\/javascripts\//,
        loader: 'imports?jQuery=jquery',
      },
      { test: /admin-lte\/dist\/js\//,
        loader: 'imports?$=jquery&jQuery=jquery',
      },
      { test: /\.(png|jpg|gif)$/,
        loader: 'url?limit=8192&name=images/[name].[ext]',
      },
      { test: /favicon\.ico$/,
        loader: 'file?name=[name].[ext]',
      },
      { test: /resources\//,
        loader: 'file?name=[path]/[name].[ext]',
        include: `${__dirname}/resources/`,
        exclude: `${__dirname}/resources/.`,  // do not include dotfiles
      },
    ],
    preLoaders: [
      { test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: `${__dirname}/app/`,
      },
    ],
  },
  postcss: () => ({
    defaults: [
//      scopify(`.${baseConfig.cssStylePrefix}`),
//      elevateGlobals({ prefix: baseConfig.cssStylePrefix }),
      autoprefixer({ browsers }),
    ],
  }),
  sassLoader: {
    includePaths: [`${__dirname}/app/styles`],
  },
};

const prodUrlFontLoader = 'url?name=fonts/[name].[ext]&limit=4096';
const prodFontLoaders = [
  { test: /\.eot(\?\S+)?$/,
    loader: `${prodUrlFontLoader}&mimetype=application/vnd.ms-fontobject`,
  },
  { test: /\.ttf(\?\S+)?$/,
    loader: `${prodUrlFontLoader}&mimetype=application/x-font-ttf`,
  },
  { test: /\.woff(\?\S+)?$/,
    loader: `${prodUrlFontLoader}&mimetype=application/font-woff`,
  },
  { test: /\.woff2(\?\S+)?$/,
    loader: `${prodUrlFontLoader}&mimetype=application/font-woff2`,
  },
  { test: /\.svg(\?\S+)?$/,
    loader: 'file?name=fonts/[name].[ext]',
  },
];

const prodWebpackConfig = Object.create(baseWebpackConfig);
prodWebpackConfig.plugins = [
  new webpack.optimize.DedupePlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      // This has effect on the react lib size
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new webpack.optimize.UglifyJsPlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.AggressiveMergingPlugin(),
].concat(prodWebpackConfig.plugins);
prodWebpackConfig.eslint = Object.assign({}, eslintConfig, { failOnError: true });
prodWebpackConfig.devtool = '#source-map'; // "preserve" source lines with external source maps
prodWebpackConfig.debug = false;
prodWebpackConfig.module = Object.create(prodWebpackConfig.module);
prodWebpackConfig.module.loaders = prodWebpackConfig.module.loaders.concat(prodFontLoaders);


const devUrlFontLoader = 'url?name=fonts/[name].[ext]&limit=4096000';
const devFontLoaders = [
  { test: /\.eot(\?\S+)?$/,
    loader: `${devUrlFontLoader}&mimetype=application/vnd.ms-fontobject`,
  },
  { test: /\.ttf(\?\S+)?$/,
    loader: `${devUrlFontLoader}&mimetype=application/x-font-ttf`,
  },
  { test: /\.woff(\?\S+)?$/,
    loader: `${devUrlFontLoader}&mimetype=application/font-woff`,
  },
  { test: /\.woff2(\?\S+)?$/,
    loader: `${devUrlFontLoader}&mimetype=application/font-woff2`,
  },
  { test: /\.svg(\?\S+)?$/,
    loader: 'file?name=fonts/[name].[ext]',
  },
];
const devWebpackConfig = Object.create(baseWebpackConfig);
devWebpackConfig.plugins = devWebpackConfig.plugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      // This has effect on the react lib size
      NODE_ENV: JSON.stringify('development'),
    },
  }),
]);
devWebpackConfig.debug = true;
devWebpackConfig.eslint = Object.assign({},
  eslintConfig, {
    failOnError: false,  // it still fails since NoErrorsPlugin is present
    rules: {
      'no-console': 0,   // we are still in dev, allow console.log statements
    },
  });
// "preserve" source lines with embedded source maps
devWebpackConfig.devtool = '#cheap-module-eval-source-map';
devWebpackConfig.profile = baseConfig.profile;
if (devWebpackConfig.profile) {
  devWebpackConfig.plugins = devWebpackConfig.plugins.concat([
    new require('stats-webpack-plugin')('stats.json', {
      chunkModules: true,
    }),
  ]);
}
devWebpackConfig.module = Object.create(devWebpackConfig.module);
devWebpackConfig.module.loaders = devWebpackConfig.module.loaders.concat(devFontLoaders);

module.exports =
  process.env.NODE_ENV === 'production' ?
  prodWebpackConfig :
  devWebpackConfig;
