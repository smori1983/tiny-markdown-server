const fs = require('fs');
const path = require('path');
const licenseChecker = require('license-checker');

const packageJsonPath = path.resolve(__dirname + '/../package.json');
const packageJson = require(packageJsonPath);

const outputFile = path.resolve(__dirname + '/../LICENSE.third_party.txt');
const outputLines = [];

const args = {
  excludePackages: packageJson.name + '@' + packageJson.version,
  production: true,
  start: path.dirname(packageJsonPath),
};

licenseChecker.init(args, (err, json) => {
  const packageAndVersions = Object.keys(json);

  outputLines.push(packageJson.name);
  outputLines.push('');
  outputLines.push('THIRD-PARTY SOFTWARE LICENSES');
  outputLines.push('');
  outputLines.push('');

  packageAndVersions.forEach((packageAndVersion) => {
    const licenseFile = json[packageAndVersion].licenseFile;

    outputLines.push(packageAndVersion + ' BEGIN HERE');
    outputLines.push('================================================================================');
    outputLines.push(fs.readFileSync(licenseFile).toString());
    outputLines.push('================================================================================');
    outputLines.push(packageAndVersion + ' END');
    outputLines.push('');
  });

  fs.writeFileSync(outputFile, outputLines.join('\n'));
});
