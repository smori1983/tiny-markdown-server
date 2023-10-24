const browserSync = require('browser-sync');
const sprintf = require('sprintf-js').sprintf;
const open = require('open');
const yargs = require('yargs');
const mds = require('./lib/markdown-server');

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
      /** @type {module:net.AddressInfo} */
      const addressInfo = server.address();
      const url = sprintf('http://localhost:%s', addressInfo.port);

      if (argv.autoDeploy === true) {
        const bs = browserSync.create();
        bs.init({
          proxy: url,
          files: [
            'files_builtin',
            'lib',
            'templates',
          ],
        });
      } else {
        open(url);
      }
    });
  },
});

yargs.help();
yargs.argv;
