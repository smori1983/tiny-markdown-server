const fs = require('fs');
const path = require('path');
const licenseChecker = require('license-checker');

/**
 * @param {string} packageJsonPath
 * @param {string} outputFilePath
 */
const writeFile = (packageJsonPath, outputFilePath) => {
  const packageJson = require(packageJsonPath);

  const args = {
    excludePackages: packageJson.name + '@' + packageJson.version,
    production: true,
    start: path.dirname(packageJsonPath),
  };

  const outputLines = [];

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

    fs.writeFileSync(outputFilePath, outputLines.join('\n'));
  });
};

writeFile(
  path.resolve(__dirname + '/../package.json'),
  path.resolve(__dirname + '/../LICENSE.third_party.txt')
);
