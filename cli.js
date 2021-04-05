'use strict';

const browserSync = require('browser-sync');
const sprintf = require('sprintf-js').sprintf;
const yargs = require('yargs');
const mds = require('./lib/markdownServer');

yargs.command({
  command: ['serve <directory> <port>', '$0'],
  desc: 'Run markdown server',
  builder: (yargs) => {
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
  handler: (argv) => {
    mds.serve(argv.directory, argv.port, (server) => {
      if (argv.autoDeploy === true) {
        /** @type {module:net.AddressInfo} */
        const addressInfo = server.address();
        const bs = browserSync.create();
        bs.init({
          proxy: sprintf('http://%s:%s', addressInfo.address, addressInfo.port),
          files: [
            'files_builtin',
            'lib',
            'templates',
          ],
        });
      }
    });
  },
});

yargs.help();
yargs.argv;
