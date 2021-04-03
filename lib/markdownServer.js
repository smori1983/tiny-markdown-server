const http = require('http');
const app = require('./application');

/**
 * @callback serverListenCallback
 * @param {module:http.Server} server
 */

/**
 * @param {string} userFileDir The directory to be served.
 * @param {number} port
 * @param {serverListenCallback} [cb]
 *
 * @returns {module:http.Server}
 */
const serve = (userFileDir, port, cb) => {
  /** @type {module:http.Server} */
  const server = http.createServer();

  server.on('request', app.create(userFileDir));
  server.keepAliveTimeout = 10;
  server.listen({
    port: port,
    host: 'localhost',
  }, () => {
    if (typeof cb === 'function') {
      cb(server);
    }
  });

  return server;
};

module.exports.serve = serve;
