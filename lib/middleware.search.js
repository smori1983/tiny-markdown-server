const Markdown = require('./markdown');

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

    const markdown = new Markdown(userFileDir);
    const result = markdown.search(req.query.word);

    res.json(result);
  };
};

module.exports = main;
