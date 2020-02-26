'use strict';

const http = require('http');
const app = require('./application');

/**
 * @param {string} userFileDir The directory to be served.
 * @param {number} port
 */
const serve = function(userFileDir, port) {
  const server = http.createServer();

  server.on('request', app.create(userFileDir));
  server.keepAliveTimeout = 10;
  server.listen(port);

  return server;
};

module.exports.serve = serve;
