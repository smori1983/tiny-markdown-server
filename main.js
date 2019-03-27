'use strict';

const fs = require('fs');
const md = require('markdown-it')();

const server = require('http').createServer(function(request, response) {
  let file = request.url;
  let path = './files' + file;
  let responseCode = 200;
  let result;

  if (file === '/') {
    result = 'Index';
  } else {
    try {
      fs.statSync(path);

      let content = fs.readFileSync(path);

      result = md.render(content.toString());
    } catch (e) {
      console.log(e);

      responseCode = 404;
      result = 'Not Found.'
    }
  }

  response.writeHead(responseCode, { 'Content-Type': 'text/html' });
  response.write(result);
  response.end();
});

server.listen(3000);
