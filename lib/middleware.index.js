const indexUtil = require('./indexUtil');

/**
 * @param {string} userFileDir
 * @returns {middlewareCallback}
 */
const main = function (userFileDir) {
  return function (req, res) {
    res.render('index.ejs', {
      files: indexUtil.scanMarkdownFiles(userFileDir),
    });
  };
};

module.exports = main;
