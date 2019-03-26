'use strict';

const fs = require('fs');
const md = require('markdown-it')();

const server = require('http').createServer(function(request, response) {
  let content = fs.readFileSync('./sample01.md');
  let parsed = md.render(content.toString());

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(parsed);
  response.end();
});

server.listen(3000);
