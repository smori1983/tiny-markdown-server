'use strict';

const fs = require('fs');

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

const indexUtil = require('./indexUtil');

const http = require('http');
const express = require('express');

const application = require('./application');

/**
 * @param {string} userFileDir The directory to be served.
 */
const create = function(userFileDir) {
  const app = express();

  app.set('views', fs.realpathSync(__dirname + '/../templates'));
  app.set('view engine', 'ejs');

  app.get('/', function(req, res) {
    res.render('index.ejs', {
      files: indexUtil.scanMarkdownFiles(userFileDir),
    });
  });

  app.get('/*.md', function(req, res) {
    const path = decodeURIComponent(req.path);
    const file = fs.realpathSync(userFileDir + path);

    fs.statSync(file);

    res.render('markdown.ejs', {
      title: path.slice(1),
      content: md.render(fs.readFileSync(file).toString()),
    });
  });

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

  return http.createServer(app);
};

/**
 * @param {string} userFileDir The directory to be served.
 * @param {number} port
 */
const serve = function(userFileDir, port)
{
  const server = http.createServer();

  server.on('request', application.create(userFileDir));
  server.keepAliveTimeout = 10;
  server.listen(port);

  return server;
};

module.exports.create = create;
module.exports.serve = serve;
