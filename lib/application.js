const fs = require('fs');

const index = require('./middleware.index');
const markdown = require('./middleware.markdown');
const search = require('./middleware.search');

const express = require('express');

/**
 * @callback middlewareCallback
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */

/**
 * @param {string} userFileDir The directory to be served.
 */
const create = function(userFileDir) {
  const app = express();

  app.set('views', fs.realpathSync(__dirname + '/../templates'));
  app.set('view engine', 'ejs');

  app.get('/', index(userFileDir));

  app.use(markdown(userFileDir));

  app.get('/-/search', search(userFileDir));

  app.use('/-/', express.static(fs.realpathSync(__dirname + '/../files_builtin'), {
    fallthrough: false,
  }));

  app.use(express.static(userFileDir, {
    fallthrough: false,
  }));

  app.use(function(err, req, res, next) {
    res.status(404);
    res.render('404.ejs');
  });

  return app;
};

module.exports.create = create;
