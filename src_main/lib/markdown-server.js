const express = require('express');
const fs = require('fs');
const http = require('http');

const index = require('./middleware.index');
const markdown = require('./middleware.markdown');

/**
 * @callback middlewareCallback
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */

/**
 * @param {string} userFileDir The directory to be served.
 */
const createApplication = (userFileDir) => {
  const app = express();

  app.set('views', fs.realpathSync(__dirname + '/templates'));
  app.set('view engine', 'ejs');

  app.get('/', index(userFileDir));

  app.use(markdown(userFileDir));

  app.use('/-/', express.static(fs.realpathSync(__dirname + '/files_builtin'), {
    fallthrough: false,
  }));

  app.use(express.static(userFileDir, {
    fallthrough: false,
  }));

  app.use((err, req, res, next) => {
    res.status(404);
    res.render('404.ejs');
  });

  return app;
};

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

  server.on('request', createApplication(userFileDir));
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
