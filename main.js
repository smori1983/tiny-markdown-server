'use strict';

const fs = require('fs');
const md = require('markdown-it')();

const server = require('http').createServer(function(request, response) {
  let file = request.url;
  let path = './files' + file;
  let result;

  if (file === '/') {
    result = 'Index';
  } else if (fs.existsSync(path)) {
    let content = fs.readFileSync(path);

    result = md.render(content.toString());
  } else {
    result = 'Not Found.'
  }

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(result);
  response.end();
});

server.listen(3000);
