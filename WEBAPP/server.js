/* jslint node: true */
'use strict';

var webpack = require('webpack');
var devWebpackConfig = require('./webpack.config.js');


var devWSWebpackConfig = Object.create(devWebpackConfig);

devWSWebpackConfig.profile = false;
devWSWebpackConfig.bail = false;
devWSWebpackConfig.cache = true;
devWSWebpackConfig.entry =
  Object.keys(devWSWebpackConfig.entry).reduce(function (obj, key) {
    obj[key] = devWSWebpackConfig.entry[key].concat([ // eslint-disable-line no-param-reassign
      'webpack-hot-middleware/client',
    ]);
    return obj;
  }, {});

devWSWebpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

// Disable CSS extraction (does not work with Hot Module Reload)
devWSWebpackConfig.private.extractTextPlugin.options.disable = true;

var replacedLoader = false;
devWSWebpackConfig.module.loaders =
  devWSWebpackConfig.module.loaders.map(function (loader) {
    if (loader.test && loader.test.toString() === '/\\.(js|jsx)$/') {
      replacedLoader = true;
      var newLoader = Object.create(loader);
      newLoader.loader = 'react-hot!' + loader.loader;
      return newLoader;
    }
    return loader;
  });

if (!replacedLoader) {
  throw new Error('"react-hot" loader has not been injected!');
}

// Remove eslint
devWSWebpackConfig.module.preLoaders =
  devWSWebpackConfig.module.preLoaders.filter(function (loader) {
    return (loader.loader !== 'eslint-loader');
  });


var path = require('path');
var mime = require('mime');
var express = require('express');
var app = express();

var compiler = webpack(devWSWebpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  contentBase: 'dist/',
  publicPath: '/',
  hot: true,
  noInfo: false,
  colors: true,
  stats: {
    chunkModules: true,
    colors: true,
  },
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: console.log,
});

var distDir = path.resolve('dist');

// Log requests
app.use(require('morgan')('short'));
// GZip files
app.use(require('compression')());
// Serve webpack bundles
app.use(devMiddleware);
// Serve hot-reload requests
app.use(hotMiddleware);
// Fallback
app.get('*', function (req, res) {
  console.log('Fallback request of', req.path, '[Accept:', req.get('Accept'), ']');
  var fs = devMiddleware.fileSystem;
  var filename = devMiddleware.getFilenameFromUrl(req.path);
  var ok = false;
  while (!ok && filename && filename !== distDir && filename !== '/') {
    try {
      var stat = fs.statSync(filename);
      if (stat.isFile()) {
        console.log('Serving file', filename);
        var content = fs.readFileSync(filename);
        res.setHeader('Access-Control-Allow-Origin', '*'); // To support XHR, etc.
        res.setHeader('Content-Type', mime.lookup(filename));
        res.setHeader('Content-Length', content.length);
        res.status(200).send(content);
        ok = true;
      }
      if (stat.isDirectory()) {
        console.log('Serving directory', filename);
        var files = fs.readdirSync(filename);
        var body = '<html><body><h1>' + req.path + ' (' + filename + ')</h1><ul>' +
              files.map(function (f) {
                return '<li><a href="' + req.path + '/' + f + '">' + f + '</a></li>';
              }).join('\n') +
              '</ul></body></html>';
        var buf = new Buffer(body, 'utf8');
        res.setHeader('Access-Control-Allow-Origin', '*'); // To support XHR, etc.
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', buf.length);
        res.status(200).send(buf).end();
        ok = true;
      }
    } catch (e) {
      // File not found
    }
    if (!ok) {
      console.log('File not found', filename);
      filename = path.dirname(filename);
    }
  }
  if (!ok) {
    var red = path.dirname(req.path);
    if (red && red !== '/') {
      console.log('Redirecting to', red);
      res.redirect(red);
    } else {
      if (req.path !== '/index.html') {
        console.log('Redirecting to /index.html');
        res.redirect('/index.html');
      } else {
        res.status(404).send('404 File Not Found!');
      }
    }
  }
});

var httpsServer = require('./webpack-util/js/server.https.js');

httpsServer.launch(devWSWebpackConfig.output, app);
