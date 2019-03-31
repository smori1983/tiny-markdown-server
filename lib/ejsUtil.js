const fs = require('fs');
const ejs = require('ejs');

/**
 * @param {string} path The relative path of template file.
 * @param {object} data 
 */
const render = function(path, data) {
  const file = fs.realpathSync(__dirname + '/../templates/' + path);
  const content = fs.readFileSync(file).toString();

  return ejs.render(content, data || {});
};

module.exports.render = render;
