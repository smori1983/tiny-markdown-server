const fileReader = require('./fileReader');
const indexUtil = require('./indexUtil');
const searchUtil = require('./searchUtil');

/**
 * @param {string} userFileDir
 * @returns {middlewareCallback}
 */
const main = (userFileDir) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    let result = [];

    const matcher = searchUtil.createMatcher(req.query.word);

    if (matcher.countPatterns() > 0) {
      indexUtil.scanMarkdownFiles(userFileDir).forEach((item) => {
        try {
          const filePath = userFileDir + '/' + item.notation;
          const reader = fileReader.init(filePath);

          if (matcher.matches(reader.read())) {
            result.push(item);
          }

          reader.close();
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
