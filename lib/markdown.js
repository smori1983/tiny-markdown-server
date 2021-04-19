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
   *
   * @param {string} baseDir
   * @param {*} word
   * @return {SearchResult}
   */
  search(baseDir, word) {
    const files = new MarkdownFileCollector().collect(baseDir);
    const matcher = new SearchMatcher(word);
    const foundItems = this._filter(baseDir, files, matcher);

    return {
      total: files.length,
      foundItems: foundItems,
    };
  }

  /**
   * @param {string} baseDir
   * @param {MarkdownFileItem[]} items
   * @param {SearchMatcher} matcher
   * @return {MarkdownFileItem[]}
   * @private
   */
  _filter(baseDir, items, matcher) {
    if (matcher.countPatterns() === 0) {
      return items;
    }

    let filtered = [];

    items.forEach((item) => {
      try {
        const filePath = baseDir + '/' + item.notation;
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
}

module.exports = Markdown;
