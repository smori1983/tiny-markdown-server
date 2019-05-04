'use strict';

const yargs = require('yargs');
const mds = require('./lib/markdownServer');

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
    mds.create(argv.directory).listen(argv.port);
  },
});

yargs.help();
yargs.argv;
