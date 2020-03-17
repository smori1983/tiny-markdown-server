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

    const matcher = searchUtil.createMatcher(req.query.word);

    if (matcher.countPatterns() > 0) {
      indexUtil.scanMarkdownFiles(userFileDir).forEach(function (item) {
        try {
          const filePath = fs.realpathSync(userFileDir + '/' + item.notation);
          const content = fs.readFileSync(filePath).toString();

          if (matcher.matches(content)) {
            result.push(item);
          }
        } catch (e) {
          /* istanbul ignore next */
          console.log(e);
        }
      });
    }

    res.json(result);
  };
};

module.exports = main;
