const fs = require('fs');

const notEmpty = function(value) {
  return value.length > 0;
};

/**
 * @param {string} directory 
 * @param {string[]} list 
 * @param {string[]} dirNames 
 */
const scan = function(directory, list, dirNames) {
  let dir = [directory, dirNames.join('/')].filter(notEmpty).join('/');

  fs.readdirSync(dir, { withFileTypes: true }).forEach(function(dirent) {
    if (dirent.isFile() && /\.md$/.test(dirent.name)) {
      let path = [dirNames.join('/'), dirent.name].filter(notEmpty).join('/');

      list.push(path);
    }

    if (dirent.isDirectory()) {
      dirNames.push(dirent.name);
      list = scan(directory, list, dirNames);
      dirNames.pop();
    }
  });

  return list;
};

/**
 * @param {string} directory 
 */
const scanMarkdownFiles = function(directory) {
  return scan(directory, [], []);
};

module.exports.scanMarkdownFiles = scanMarkdownFiles;
