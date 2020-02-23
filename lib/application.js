'use strict';

const fs = require('fs');

const index = require('./middleware.index');
const markdown = require('./middleware.markdown');

const express = require('express');

/**
 * @param {string} userFileDir The directory to be served.
 */
const create = function(userFileDir) {
  const app = express();

  app.set('views', fs.realpathSync(__dirname + '/../templates'));
  app.set('view engine', 'ejs');

  app.get('/', index(userFileDir));

  app.use(markdown(userFileDir));

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
