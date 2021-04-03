const fs = require('fs');
const builder = require('electron-builder');
const Platform = builder.Platform;

builder.build({
  targets: Platform.MAC.createTarget(),
  config: JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8')),
}).then(() => {
  console.log('finished');
}).catch((error) => {
  console.log(error);
});
