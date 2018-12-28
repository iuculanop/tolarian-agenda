const express = require('express');
const path = require('path');

// Webpack app configs
const webApps = require('../../webpack.base.config.js').apps;
const distDir = path.resolve(__dirname, '../../dist');

const app = express();

// Log requests
app.use(require('morgan')('short'));

// GZip files
app.use(require('compression')());

// WebApp single pages
Object.keys(webApps).forEach((webAppName) => {
  const webApp = webApps[webAppName];
  app.get(`/${webApp.filename}*`, (req, res) => {
    console.log('Managing request', req.path, 'with', webApp.filename);
    res.sendFile(path.resolve(distDir, webApp.filename));
  });
});

// Static assets
app.use('/', express.static(path.resolve(distDir)));


var httpsServer = require('./server.https.js');
var config = require('../../webpack.base.config.js');

httpsServer.launch(config, app);
