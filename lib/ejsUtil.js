'use strict';

const fs = require('fs');
const ejs = require('ejs');

/**
 * @param {string} path The relative path of template file.
 * @param {object} [data]
 */
const render = function(path, data) {
  const file = fs.realpathSync(__dirname + '/../templates/' + path);
  const content = fs.readFileSync(file).toString();

  return ejs.render(content, data || {}, {
    // Needed to write relative path in include().
    // See getIncludePath() of ejs.js.
    filename: file,
  });
};

module.exports.render = render;
