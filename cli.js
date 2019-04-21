'use strict';

const yargs = require('yargs');

yargs.command({
  command: ['serve <directory> <port>', '$0'],
  desc: 'Run markdown server',
  builder: function(yargs) {
    yargs.positional('directory', {
      describe: 'The directory to be served',
      type: 'string',
    });
    yargs.positional('port', {
      describe: 'The port to be listened',
      type: 'number',
    });
  },
  handler: function(argv) {
    const mds = require('./lib/markdownServer')(argv.directory);

    require('http').createServer(function(request, response) {
      mds.serve(request, response);
    }).listen(argv.port);
  },
});

yargs.help();
yargs.argv;
