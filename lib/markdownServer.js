'use strict';

const fs = require('fs');
const mime = require('mime');
const url = require('url');

const router = require('./router')();

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

const indexUtil = require('./indexUtil');
const ejsUtil = require('./ejsUtil');
const responseUtil = require('./responseUtil');

/**
 * @type {string}
 */
let userFileDir;

router.register('index', '/', function() {
  return responseUtil.make200(ejsUtil.render('index.ejs', {
    files: indexUtil.scanMarkdownFiles(userFileDir),
  }));
});

router.register('builtin_file', /\/-\/.+/, function(path) {
  const basePath = '/-/';
  const relativePath = path.slice(basePath.length);
  const file = fs.realpathSync(__dirname + '/../files_builtin/' + relativePath);

  fs.statSync(file);

  return responseUtil.make200(fs.readFileSync(file), mime.getType(file));
});

router.register('markdown', /\.md$/, function(path) {
  const file = fs.realpathSync(userFileDir + path);

  fs.statSync(file);

  return responseUtil.make200(ejsUtil.render('markdown.ejs', {
    title: path.slice(1),
    content: md.render(fs.readFileSync(file).toString()),
  }));
});

router.register('other_resource', /.+/, function(path) {
  const file = fs.realpathSync(userFileDir + path);

  fs.statSync(file);

  return responseUtil.make200(fs.readFileSync(file), mime.getType(file));
});

router.registerError(function() {
  return responseUtil.make404(ejsUtil.render('404.ejs'));
});

/**
 * @param {string} path 
 * @returns {responseData}
 */
const makeResponse = function(path) {
  try {
    return router.resolve(path)(path);
  } catch (e) {
    console.log(e);
    return router.error()();
  }
};

/**
 * @param {string} dir The directory to be served.
 */
const server = function(dir) {
  userFileDir = dir;

  return {
    serve: function(request, response) {
      const path = decodeURIComponent(url.parse(request.url).pathname);
      const result = makeResponse(path);

      response.writeHead(result.responseCode, result.header);
      response.write(result.body);
      response.end();
    },
  };
};

module.exports = server;
