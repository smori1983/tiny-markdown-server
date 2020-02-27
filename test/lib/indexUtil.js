const { describe, it } = require('mocha');
const assert = require('assert');
const SUT = require('../../lib/indexUtil');

describe('lib.indexUtil', function () {
  describe('scanMarkdownFiles', function () {
    describe('file extension', function () {
      it('.md - 1 file found', function () {
        const dir = __dirname + '/../../test_resource/dir_01';

        const result = SUT.scanMarkdownFiles(dir);

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].path, '/file_01.md');
        assert.strictEqual(result[0].notation, 'file_01.md');
      });

      it('.md - 2 files found', function () {
        const dir = __dirname + '/../../test_resource/dir_02';

        const result = SUT.scanMarkdownFiles(dir);

        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].path, '/file_01.md');
        assert.strictEqual(result[0].notation, 'file_01.md');
        assert.strictEqual(result[1].path, '/file_03.md');
        assert.strictEqual(result[1].notation, 'file_03.md');
      });

      it('.markdown - 1 file found', function () {
        const dir = __dirname + '/../../test_resource/dir_03';

        const result = SUT.scanMarkdownFiles(dir);

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].path, '/file_02.markdown');
        assert.strictEqual(result[0].notation, 'file_02.markdown');
      });

      it('has directory - 4 files found', function () {
        const dir = __dirname + '/../../test_resource/dir_04';

        const result = SUT.scanMarkdownFiles(dir);

        assert.strictEqual(result.length, 4);
        assert.strictEqual(result[0].path, '/dir_04_01/file_04.md');
        assert.strictEqual(result[0].notation, 'dir_04_01/file_04.md');
        assert.strictEqual(result[1].path, '/dir_04_01/file_05.markdown');
        assert.strictEqual(result[1].notation, 'dir_04_01/file_05.markdown');
        assert.strictEqual(result[2].path, '/file_01.md');
        assert.strictEqual(result[2].notation, 'file_01.md');
        assert.strictEqual(result[3].path, '/file_03.markdown');
        assert.strictEqual(result[3].notation, 'file_03.markdown');
      });
    });

    describe('encode', function () {
      it('# should be encoded to %23', function () {
        const dir = __dirname + '/../../test_resource/dir_05';

        const result = SUT.scanMarkdownFiles(dir);

        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].path, '/dir_05%2301/file%2302.md');
        assert.strictEqual(result[0].notation, 'dir_05#01/file#02.md');
        assert.strictEqual(result[1].path, '/file%2301.md');
        assert.strictEqual(result[1].notation, 'file#01.md');
      });

      it('+ should be encoded to %2B', function () {
        const dir = __dirname + '/../../test_resource/dir_06';

        const result = SUT.scanMarkdownFiles(dir);

        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].path, '/dir_06%2B01/file%2B02.md');
        assert.strictEqual(result[0].notation, 'dir_06+01/file+02.md');
        assert.strictEqual(result[1].path, '/file%2B01.md');
        assert.strictEqual(result[1].notation, 'file+01.md');
      });

      it('? should be encoded to %3F', function () {
        const dir = __dirname + '/../../test_resource/dir_07';

        const result = SUT.scanMarkdownFiles(dir);

        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].path, '/dir_07%3F01/file%3F02.md');
        assert.strictEqual(result[0].notation, 'dir_07?01/file?02.md');
        assert.strictEqual(result[1].path, '/file%3F01.md');
        assert.strictEqual(result[1].notation, 'file?01.md');
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

  describe('title', function () {
    it('should find #', function () {
      const dir = __dirname + '/../../test_resource/dir_08';

      const result = SUT.scanMarkdownFiles(dir);

      assert.strictEqual(result[0].title, 'file_01');
    });

    it('should find ##', function () {
      const dir = __dirname + '/../../test_resource/dir_08';

      const result = SUT.scanMarkdownFiles(dir);

      assert.strictEqual(result[1].title, 'file_02');
    });

    it('should find ###', function () {
      const dir = __dirname + '/../../test_resource/dir_08';

      const result = SUT.scanMarkdownFiles(dir);

      assert.strictEqual(result[2].title, 'file_03');
    });

    it('should find ######', function () {
      const dir = __dirname + '/../../test_resource/dir_08';

      const result = SUT.scanMarkdownFiles(dir);

      assert.strictEqual(result[3].title, 'file_04');
    });

    it('should not find any heading line', function () {
      const dir = __dirname + '/../../test_resource/dir_08';

      const result = SUT.scanMarkdownFiles(dir);

      assert.strictEqual(result[4].title, 'file_05.md');
    });
  });
});
