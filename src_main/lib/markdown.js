const fs = require('fs');
const MarkdownIt = require('markdown-it');
const FileReader = require('./file-reader');
const MarkdownFileCollector = require('./markdown-file-collector');
const SearchMatcher = require('./search-matcher');

/**
 * @typedef SearchResult
 * @property {number} total
 * @property {MarkdownFileItem[]} foundItems
 */

class Markdown {
  /**
   * @param {string} baseDir
   */
  constructor(baseDir) {
    this._baseDir = baseDir;
  }

  /**
   * @param {*} word
   * @return {SearchResult}
   */
  search(word) {
    const files = new MarkdownFileCollector().collect(this._baseDir);
    const matcher = new SearchMatcher(word);
    const foundItems = this._filter(files, matcher);

    return {
      total: files.length,
      foundItems: foundItems,
    };
  }

  /**
   * @param {MarkdownFileItem[]} items
   * @param {SearchMatcher} matcher
   * @return {MarkdownFileItem[]}
   * @private
   */
  _filter(items, matcher) {
    if (matcher.countPatterns() === 0) {
      return items;
    }

    let filtered = [];

    items.forEach((item) => {
      try {
        const filePath = this._baseDir + '/' + item.notation;
        const reader = new FileReader(filePath);

        if (matcher.matches(reader.read())) {
          filtered.push(item);
        }

        reader.close();
      } catch (e) {
        /* istanbul ignore next */
        console.log(e);
      }
    });

    return filtered;
  }

  /**
   * @param {string} requestPath
   * @return {string}
   */
  render(requestPath) {
    const file = fs.realpathSync(this._baseDir + requestPath);

    fs.statSync(file);

    const md = new MarkdownIt();

    return md.render(fs.readFileSync(file).toString());
  }
}

module.exports = Markdown;
