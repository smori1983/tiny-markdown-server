'use strict';

const response200 = function(body) {
  return {
    responseCode: 200,
    body: body,
  };
};

const response404 = function(body) {
  return {
    responseCode: 404,
    body: body,
  };
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
