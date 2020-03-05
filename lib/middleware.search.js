const fs = require('fs');
const indexUtil = require('./indexUtil');
const searchUtil = require('./searchUtil');

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
      const pattern = searchUtil.toRegExp(word);

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
