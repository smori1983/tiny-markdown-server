const Markdown = require('./markdown');

/**
 * @param {string} userFileDir
 * @returns {middlewareCallback}
 */
const main = (userFileDir) => {
  return (req, res) => {
    const markdown = new Markdown(userFileDir);
    const result = markdown.search(req.query.word);

    res.render('index.ejs', {
      word: req.query.word || '',
      total: result.total,
      foundItems: result.foundItems,
    });
  };
};

module.exports = main;
