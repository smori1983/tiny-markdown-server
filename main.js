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
  if (path === '/') {
    return response200('Index');
  }

  const fs = require('fs');
  const md = require('markdown-it')();

  try {
    let file = './files' + path;

    fs.statSync(file);

    return response200(md.render(fs.readFileSync(file).toString()));
  } catch (e) {
    console.log(e);

    return response404('Not Found.');
  }
};

const server = require('http').createServer(function(request, response) {
  let result = makeResponse(request.url);

  response.writeHead(result.responseCode, { 'Content-Type': 'text/html' });
  response.write(result.body);
  response.end();
});

server.listen(3000);
