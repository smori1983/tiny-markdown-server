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

    const searchInput = req.query.word;

    if (typeof searchInput !== 'string') {
      res.json(result);
      return;
    }

    const words = searchUtil.toWords(searchInput);

    if (words.length === 0) {
      res.json(result);
      return;
    }

    /** @type {RegExp[]} */
    const patterns = words.map(function (word) {
      return searchUtil.toRegExp(word);
    });

    indexUtil.scanMarkdownFiles(userFileDir).forEach(function (item) {
      try {
        const filePath = fs.realpathSync(userFileDir + '/' + item.notation);
        const content = fs.readFileSync(filePath).toString();

        for (let i = 0; i < patterns.length; i++) {
          if (patterns[i].test(content)) {
            result.push(item);
            break;
          }
        }
      } catch (e) {
        console.log(e);
      }
    });

    res.json(result);
  };
};

module.exports = main;
