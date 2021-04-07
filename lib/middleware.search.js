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

    const matcher = searchUtil.createMatcher(req.query.word);
    const files = indexUtil.scanMarkdownFiles(userFileDir);

    const result = searchUtil.filter(userFileDir, files, matcher);

    res.json(result);
  };
};

module.exports = main;
