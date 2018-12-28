'use strict';
const http = require('http');
const https = require('https');
const fs = require('fs');

function launchSecureServer(config, app) {
  const protocol = config.server.protocol;
  const outFQDN = config.server.outFQDN;
  const listenAddr = config.server.listenAddr;
  const listenPort = config.server.listenPort;
  const publicPath = config.publicPath;
  const serverKey = config.server.serverKey;
  const serverCert = config.server.serverCert;
  const serverCA = config.server.serverCA;

  try {
    fs.accessSync(serverKey, fs.R_OK);
    fs.accessSync(serverCert, fs.R_OK);
  } catch (err) {
    throw new Error(`Impossible to open the server key and/or the server certificate.
Please generate them with:
openssl genrsa -out ${serverKey} 1024
openssl req -new -key ${serverKey} -out TEMP.csr
openssl x509 -req -days 3660 -in TEMP.csr -signkey ${serverKey} -out ${serverCert}
rm TMP.csr`
    );
  }

  let hasCA = false;
  try {
    if (serverCA) {
      fs.accessSync(serverCA, fs.R_OK);
      hasCA = true;
    }
  } catch (err) {
    console.log('No CA certificate found');
    hasCA = false;
  }

  const options = {
    key: fs.readFileSync(serverKey),
    cert: fs.readFileSync(serverCert),
  };
  if (hasCA) {
    options.ca = fs.readFileSync(serverCA);
  }
  https.createServer(options, app).listen(listenPort, listenAddr, function (err) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Listening at ${protocol}://${outFQDN}:${listenPort}${publicPath}`);
  });
}

function launchInsecureServer(config, app) {
  const protocol = config.server.protocol;
  const outFQDN = config.server.outFQDN;
  const listenAddr = config.server.listenAddr;
  const listenPort = config.server.listenPort;
  const publicPath = config.publicPath;

  http.createServer(app).listen(listenPort, listenAddr, function (err) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Listening at ${protocol}://${outFQDN}:${listenPort}${publicPath}`);
  });
}


function isSecure(protocol) {
  switch (protocol) {
    case 'https':
    case 'HTTPS':
      console.log('Serving on HTTPS');
      return true;
    case 'http':
    case 'HTTP':
      console.log('Serving on HTTP');
      return false;
    default:
      console.error('Unkwnown protocol '+protocol);
      return null;
  }
}

function launchServer(config, app) {
  const secure = isSecure(config.server.protocol);
  if (secure) {
    launchSecureServer(config, app);
  } else {
    launchInsecureServer(config, app);
  }
}

module.exports = {
  launch: launchServer,
};
