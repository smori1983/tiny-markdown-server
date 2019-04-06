'use strict';

const fs = require('fs');
const mime = require('mime');
const md = require('markdown-it')();

const indexUtil = require('./indexUtil');
const ejsUtil = require('./ejsUtil');

let userFileDir;

/**
 * @param {number} code 
 * @param {string} mime 
 * @param {string} body 
 */
const responseOf = function(code, mime, body) {
  return {
    responseCode: code,
    header: { 'Content-Type': mime },
    body: body,
  };
};

/**
 * @param {string} body 
 * @param {string} mimeType 
 */
const response200 = function(body, mimeType) {
  return responseOf(200, mimeType || mime.getType('html'), body);
};

/**
 * @param {string} body 
 */
const response404 = function(body) {
  return responseOf(404, mime.getType('html'), body);
};

/**
 * @param {string} path 
 */
const index = function(path) {
  if (path === '/') {
    return response200(ejsUtil.render('index.ejs', {
      files: indexUtil.scanMarkdownFiles(userFileDir),
    }));
  }
};

/**
 * @param {string} path 
 */
const builtInFile = function(path) {
  const basePath = '/-/';

  if (path.indexOf(basePath) === 0) {
    const relativePath = path.slice(basePath.length);
    const file = fs.realpathSync(__dirname + '/../files_builtin/' + relativePath);

    fs.statSync(file);

    return response200(fs.readFileSync(file), mime.getType(file));
  }
};

/**
 * @param {string} path 
 */
const markdown = function(path) {
  if (/\.md$/.test(path)) {
    const file = fs.realpathSync(userFileDir + path);

    fs.statSync(file);

    return response200(ejsUtil.render('markdown.ejs', {
      content: md.render(fs.readFileSync(file).toString()),
    }));
  }
};

/**
 * @param {string} path 
 */
const otherResource = function(path) {
  const file = fs.realpathSync(userFileDir + path);

  fs.statSync(file);

  return response200(fs.readFileSync(file), mime.getType(file));
};

const sentinel = function() {
  return response404(ejsUtil.render('404.ejs'));
};

/**
 * @param {string} path 
 */
const makeResponse = function(path) {
  const controllers = [
    index,
    builtInFile,
    markdown,
    otherResource,
    sentinel,
  ];

  let result;

  for (let i = 0; i < controllers.length; i++) {
    try {
      if (result = controllers[i](path)) {
        return result;
      }
    } catch (e) {
      console.log(e);
    }
  }
};

/**
 * @param {string} dir The directory to be served.
 */
const server = function(dir) {
  userFileDir = dir;

  return {
    serve: function(request, response) {
      const result = makeResponse(request.url);

      response.writeHead(result.responseCode, result.header);
      response.write(result.body);
      response.end();
    },
  };
};

module.exports = server;
