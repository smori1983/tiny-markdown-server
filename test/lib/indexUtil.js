const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const SUT = require('../../lib/indexUtil');

describe('lib.indexUtil', function () {
  describe('scanMarkdownFiles', function () {
    it('.md - 1 file found', function () {
      const dir = __dirname + '/../../test_resource/dir_01';

      const result = SUT.scanMarkdownFiles(dir);

      const expected = [
        {
          path: '/file_01.md',
          notation: 'file_01.md',
        },
      ];

      assert.deepStrictEqual(result, expected);
    });

    it('.md - 2 files found', function () {
      const dir = __dirname + '/../../test_resource/dir_02';

      const result = SUT.scanMarkdownFiles(dir);

      const expected = [
        {
          path: '/file_01.md',
          notation: 'file_01.md',
        },
        {
          path: '/file_03.md',
          notation: 'file_03.md',
        },
      ];

      assert.deepStrictEqual(result, expected);
    });

    it('.markdown - 1 file found', function () {
      const dir = __dirname + '/../../test_resource/dir_03';

      const result = SUT.scanMarkdownFiles(dir);

      const expected = [
        {
          path: '/file_02.markdown',
          notation: 'file_02.markdown',
        },
      ];

      assert.deepStrictEqual(result, expected);
    });

    it('has directory - 4 files found', function () {
      const dir = __dirname + '/../../test_resource/dir_04';

      const result = SUT.scanMarkdownFiles(dir);

      const expected = [
        {
          path: '/dir_04_01/file_04.md',
          notation: 'dir_04_01/file_04.md',
        },
        {
          path: '/dir_04_01/file_05.markdown',
          notation: 'dir_04_01/file_05.markdown',
        },
        {
          path: '/file_01.md',
          notation: 'file_01.md',
        },
        {
          path: '/file_03.markdown',
          notation: 'file_03.markdown',
        },
      ];

      assert.deepStrictEqual(result, expected);
    });
  });
});
