'use strict';

const fs = require('fs');
const mime = require('mime');
const url = require('url');

const router = require('./router')();

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

const indexUtil = require('./indexUtil');
const ejsUtil = require('./ejsUtil');

/**
 * @type {string}
 */
let userFileDir;

/**
 * @typedef {object} responseData
 * @property {number} responseCode
 * @property {object} header
 * @property {(string|Buffer)} body
 */

/**
 * @param {number} code 
 * @param {string} mime 
 * @param {(string|Buffer)} body
 * @returns {responseData}
 */
const responseOf = function(code, mime, body) {
  return {
    responseCode: code,
    header: { 'Content-Type': mime },
    body: body,
  };
};

/**
 * @param {(string|Buffer)} body
 * @param {string} [mimeType]
 * @returns {responseData}
 */
const response200 = function(body, mimeType) {
  return responseOf(200, mimeType || mime.getType('html'), body);
};

/**
 * @param {(string|Buffer)} body
 * @returns {responseData}
 */
const response404 = function(body) {
  return responseOf(404, mime.getType('html'), body);
};

router.register('/', function() {
  return response200(ejsUtil.render('index.ejs', {
    files: indexUtil.scanMarkdownFiles(userFileDir),
  }));
});

router.register(/\/-\/.+/, function(path) {
  const basePath = '/-/';
  const relativePath = path.slice(basePath.length);
  const file = fs.realpathSync(__dirname + '/../files_builtin/' + relativePath);

  fs.statSync(file);

  return response200(fs.readFileSync(file), mime.getType(file));
});

router.register(/\.md$/, function(path) {
  const file = fs.realpathSync(userFileDir + path);

  fs.statSync(file);

  return response200(ejsUtil.render('markdown.ejs', {
    title: path.slice(1),
    content: md.render(fs.readFileSync(file).toString()),
  }));
});

router.register(/.+/, function(path) {
  const file = fs.realpathSync(userFileDir + path);

  fs.statSync(file);

  return response200(fs.readFileSync(file), mime.getType(file));
});

router.registerError(function() {
  return response404(ejsUtil.render('404.ejs'));
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
