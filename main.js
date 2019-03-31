'use strict';

const mds = require('./lib/markdownServer')(__dirname + '/files');
const port = 3000;

require('http').createServer(function(request, response) {
  mds.serve(request, response);
}).listen(port);
