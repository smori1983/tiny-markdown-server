'use strict';

const dir = __dirname + '/files';
const port = 3000;

const mds = require('./lib/markdownServer')(dir);

require('http').createServer(function(request, response) {
  mds.serve(request, response);
}).listen(port);
