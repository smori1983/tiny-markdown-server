'use strict';

const fs = require('fs');
const mime = require('mime');
const md = require('markdown-it')();

const indexUtil = require('./indexUtil');
const ejsUtil = require('./ejsUtil');

let userFileDir;

const responseOf = function(code, mime, body) {
  return {
    responseCode: code,
    mimeType: mime,
    body: body,
  };
};

const response200 = function(body, mimeType) {
  return responseOf(200, mimeType || mime.getType('html'), body);
};

const response404 = function(body) {
  return responseOf(404, mime.getType('html'), body);
};

const index = function(path) {
  if (path === '/') {
    return response200(ejsUtil.render('index.ejs', {
      files: indexUtil.scanMarkdownFiles(userFileDir),
    }));
  }
};

const builtInFile = function(path) {
  if (/^\/files_builtin\//.test(path)) {
    const file = fs.realpathSync(__dirname + '/..' + path);

    fs.statSync(file);

    return response200(fs.readFileSync(file), mime.getType(file));
  }
};

const markdown = function(path) {
  if (/\.md$/.test(path)) {
    const file = fs.realpathSync(userFileDir + path);

    fs.statSync(file);

    return response200(ejsUtil.render('markdown.ejs', {
      content: md.render(fs.readFileSync(file).toString()),
    }));
  }
};

const otherResource = function(path) {
  const file = fs.realpathSync(userFileDir + path);

  fs.statSync(file);

  return response200(fs.readFileSync(file), mime.getType(file));
};

const sentinel = function() {
  return response404(ejsUtil.render('404.ejs'));
};

const makeResponse = function(path) {
  const responseMakers = [
    index,
    builtInFile,
    markdown,
    otherResource,
    sentinel,
  ];

  let result;

  for (let i = 0, len = responseMakers.length; i < len; i++) {
    try {
      if (result = responseMakers[i](path)) {
        return result;
      }
    } catch (e) {
      console.log(e);
    }
  }
};

const server = function(dir) {
  userFileDir = dir;

  return {
    serve: function(request, response) {
      const result = makeResponse(request.url);

      response.writeHead(result.responseCode, { 'Content-Type': result.mimeType });
      response.write(result.body);
      response.end();
    },
  };
};

module.exports = server;
