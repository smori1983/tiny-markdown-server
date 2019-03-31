'use strict';

const fs = require('fs');
const mime = require('mime');

const indexUtil = require('./lib/indexUtil');
const ejsUtil = require('./lib/ejsUtil');

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
      files: indexUtil.scanMarkdownFiles('./files'),
    }));
  }
};

const buildInFile = function(path) {
  if (/^\/files_builtin\//.test(path)) {
    const file = __dirname + path;

    fs.statSync(file);

    return response200(fs.readFileSync(file), mime.getType(file));
  }
};

const markdown = function(path) {
  if (/\.md$/.test(path)) {
    const md = require('markdown-it')();
    const file = './files' + path;

    fs.statSync(file);

    return response200(ejsUtil.render('markdown.ejs', {
      content: md.render(fs.readFileSync(file).toString()),
    }));
  }
};

const otherResource = function(path) {
  const file = './files' + path;

  fs.statSync(file);

  return response200(fs.readFileSync(file), mime.getType(file));
};

const sentinel = function() {
  return response404(ejsUtil.render('404.ejs'));
};

const makeResponse = function(path) {
  const responseMakers = [
    index,
    buildInFile,
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

const server = require('http').createServer(function(request, response) {
  let result = makeResponse(request.url);

  response.writeHead(result.responseCode, { 'Content-Type': result.mimeType });
  response.write(result.body);
  response.end();
});

server.listen(3000);
