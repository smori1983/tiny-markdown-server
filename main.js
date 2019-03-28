'use strict';

const responseOf = function(code, body) {
  return {
    responseCode: code,
    body: body,
  };
};

const response200 = function(body) {
  return responseOf(200, body);
};

const response404 = function(body) {
  return responseOf(404, body);
};

const makeResponse = function(path) {
  const fs = require('fs');
  const md = require('markdown-it')();

  if (path === '/') {
    return response200(md.render(fs.readFileSync('./templates/index.md').toString()));
  }

  try {
    let file = './files' + path;

    fs.statSync(file);

    return response200(md.render(fs.readFileSync(file).toString()));
  } catch (e) {
    console.log(e);

    return response404(md.render(fs.readFileSync('./templates/404.md').toString()));
  }
};

const server = require('http').createServer(function(request, response) {
  let result = makeResponse(request.url);

  response.writeHead(result.responseCode, { 'Content-Type': 'text/html' });
  response.write(result.body);
  response.end();
});

server.listen(3000);
