const fs = require('fs');
const indexUtil = require('./indexUtil');

/**
 * @param {string} userFileDir
 * @returns {middlewareCallback}
 */
const main = function (userFileDir) {
  return function (req, res, next) {
    if (req.method !== 'GET') {
      next();
      return;
    }

    let result = [];

    const word = req.query.word;

    if (word.length > 0) {
      const pattern = new RegExp(word, 'i');

      indexUtil.scanMarkdownFiles(userFileDir).forEach(function (item) {
        try {
          const filePath = fs.realpathSync(userFileDir + '/' + item.notation);
          const content = fs.readFileSync(filePath);

          if (pattern.test(content)) {
            result.push(item);
          }
        } catch (e) {
          console.log(e);
        }
      });
    }

    res.json(result);
  };
};

module.exports = main;
