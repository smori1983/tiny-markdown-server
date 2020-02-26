const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const SUT = require('../../lib/indexUtil');

describe('lib.indexUtil', function () {
  describe('scanMarkdownFiles', function () {
    describe('file extension', function () {
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

    describe('encode', function () {
      it('# should be encoded to %23', function () {
        const dir = __dirname + '/../../test_resource/dir_05';

        const result = SUT.scanMarkdownFiles(dir);

        const expected = [
          {
            path: '/dir_05%2301/file%2302.md',
            notation: 'dir_05#01/file#02.md',
          },
          {
            path: '/file%2301.md',
            notation: 'file#01.md',
          },
        ];

        assert.deepStrictEqual(result, expected);
      });

      it('+ should be encoded to %2B', function () {
        const dir = __dirname + '/../../test_resource/dir_06';

        const result = SUT.scanMarkdownFiles(dir);

        const expected = [
          {
            path: '/dir_06%2B01/file%2B02.md',
            notation: 'dir_06+01/file+02.md',
          },
          {
            path: '/file%2B01.md',
            notation: 'file+01.md',
          },
        ];

        assert.deepStrictEqual(result, expected);
      });

      it('? should be encoded to %3F', function () {
        const dir = __dirname + '/../../test_resource/dir_07';

        const result = SUT.scanMarkdownFiles(dir);

        const expected = [
          {
            path: '/dir_07%3F01/file%3F02.md',
            notation: 'dir_07?01/file?02.md',
          },
          {
            path: '/file%3F01.md',
            notation: 'file?01.md',
          },
        ];

        assert.deepStrictEqual(result, expected);
      });
    });
  });

  describe('regexp', function () {
    it('string not matched for # - 1', function () {
      const text = '#hello, world.';
      const result = text.match(/^#+\s+(.+)$/);

      assert.strictEqual(result, null);
    });

    it('string not matched for # - 2', function () {
      const text = ' # hello, world.';
      const result = text.match(/^#+\s+(.+)$/);

      assert.strictEqual(result, null);
    });

    it('string matched for #', function () {
      const text = '# hello, world.';
      const result = text.match(/^#+\s+(.+)$/);

      assert.strictEqual(result[1], 'hello, world.');
    });

    it('string not matched for ## - 1', function () {
      const text = '##hello, world.';
      const result = text.match(/^#+\s+(.+)$/);

      assert.strictEqual(result, null);
    });

    it('string not matched for ## - 2', function () {
      const text = ' ## hello, world.';
      const result = text.match(/^#+\s+(.+)$/);

      assert.strictEqual(result, null);
    });

    it('string matched for ##', function () {
      const text = '## hello, world.';
      const result = text.match(/^#+\s+(.+)$/);

      assert.strictEqual(result[1], 'hello, world.');
    });
  });
});
