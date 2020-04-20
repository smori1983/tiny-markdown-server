const fs = require('fs');
const path = require('path');
const licenseChecker = require('license-checker');

const outputFile = path.resolve(__dirname + '/../LICENSE.third_party.txt');
const outputLines = [];

const args = {
  production: true,
  start: path.resolve(__dirname + '/..'),
};

licenseChecker.init(args, function(err, json) {
  const packageAndVersions = Object.keys(json);

  outputLines.push('tiny-markdown-server');
  outputLines.push('');
  outputLines.push('THIRD-PARTY SOFTWARE LICENSES');
  outputLines.push('');
  outputLines.push('');

  packageAndVersions.forEach(function(packageAndVersion) {
    const licenseFile = json[packageAndVersion].licenseFile;

    outputLines.push(packageAndVersion + ' BEGIN HERE');
    outputLines.push('--------------------------------------------------');
    outputLines.push(fs.readFileSync(licenseFile).toString());
    outputLines.push('--------------------------------------------------');
    outputLines.push(packageAndVersion + ' END');
    outputLines.push('');
  });

  fs.writeFileSync(outputFile, outputLines.join('\n'));
});
