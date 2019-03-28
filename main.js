'use strict';

const makeResponse = function(path) {
  if (path === '/') {
    return {
      responseCode: 200,
      body: 'Index',
    };
  }

  const fs = require('fs');
  const md = require('markdown-it')();

  try {
    let file = './files' + path;

    fs.statSync(file);

    return {
      responseCode: 200,
      body: md.render(fs.readFileSync(file).toString()),
    };
  } catch (e) {
    console.log(e);

    return {
      responseCode: 404,
      body: 'Not Found.',
    };
  }
};

const server = require('http').createServer(function(request, response) {
  let result = makeResponse(request.url);

  response.writeHead(result.responseCode, { 'Content-Type': 'text/html' });
  response.write(result.body);
  response.end();
});

server.listen(3000);
