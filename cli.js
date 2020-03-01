'use strict';

const browserSync = require('browser-sync');
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
    yargs.option('auto-deploy', {
      description: 'Reload when source files changed',
      type: 'boolean',
    });
  },
  handler: function (argv) {
    mds.serve(argv.directory, argv.port, function (server) {
      if (argv.autoDeploy === true) {
        /** @type {module:net.AddressInfo} */
        const addressInfo = server.address();
        browserSync({
          proxy: 'http://' + addressInfo.address + ':' + addressInfo.port,
          files: '.',
        });
      }
    });
  },
});

yargs.help();
yargs.argv;
