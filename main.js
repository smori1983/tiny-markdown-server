'use strict';

const server = require('http').createServer(function(request, response) {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write('Hello world!');
  response.end();
});

server.listen(3000);
