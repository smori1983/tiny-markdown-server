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
        /** @type {number} file descriptor */
        let fd;

        try {
          const filePath = fs.realpathSync(userFileDir + '/' + item.notation);

          fd = fs.openSync(filePath, 'r');
          if (matcher.matches(fs.readFileSync(fd).toString())) {
            result.push(item);
          }
        } catch (e) {
          /* istanbul ignore next */
          console.log(e);
        } finally {
          if (typeof fd === 'number') {
            fs.closeSync(fd);
          }
        }
      });
    }

    res.json(result);
  };
};

module.exports = main;
