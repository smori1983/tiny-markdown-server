'use strict';

const ejs = require('ejs');
const mime = require('mime');

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

const makeResponse = function(path) {
  const fs = require('fs');
  const md = require('markdown-it')();

  if (path === '/') {
    return response200(ejs.render(fs.readFileSync(__dirname + '/templates/index.ejs').toString()));
  }

  try {
    let file = './files' + path;

    fs.statSync(file);

    if (/\.md$/.test(file)) {
      return response200(ejs.render(fs.readFileSync(__dirname + '/templates/markdown.ejs').toString(), {
        content: md.render(fs.readFileSync(file).toString()),
      }));
    } else {
      return response200(fs.readFileSync(file), mime.getType(file));
    }
  } catch (e) {
    console.log(e);

    return response404(ejs.render(fs.readFileSync(__dirname + '/templates/404.ejs').toString()));
  }
};

const server = require('http').createServer(function(request, response) {
  let result = makeResponse(request.url);

  response.writeHead(result.responseCode, { 'Content-Type': result.mimeType });
  response.write(result.body);
  response.end();
});

server.listen(3000);
