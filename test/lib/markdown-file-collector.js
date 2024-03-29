const { describe, it } = require('mocha');
const assert = require('assert');
const MarkdownFileCollector = require('../../src_main/lib/markdown-file-collector');

describe('lib.MarkdownFileCollector', () => {
  describe('collect', () => {
    describe('ignored directories', () => {
      it('should ignore DOT directory', () => {
        const dir = __dirname + '/../../test_resource/ignore_01';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].title, 'file_02');
        assert.strictEqual(result[1].title, 'file_01');
      });
    });

    describe('file extension', () => {
      it('.md - 1 file found', () => {
        const dir = __dirname + '/../../test_resource/dir_01';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].path, '/file_01.md');
        assert.strictEqual(result[0].notation, 'file_01.md');
      });

      it('.md - 2 files found', () => {
        const dir = __dirname + '/../../test_resource/dir_02';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].path, '/file_01.md');
        assert.strictEqual(result[0].notation, 'file_01.md');
        assert.strictEqual(result[1].path, '/file_03.md');
        assert.strictEqual(result[1].notation, 'file_03.md');
      });

      it('.markdown - 1 file found', () => {
        const dir = __dirname + '/../../test_resource/dir_03';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].path, '/file_02.markdown');
        assert.strictEqual(result[0].notation, 'file_02.markdown');
      });

      it('has directory - 4 files found', () => {
        const dir = __dirname + '/../../test_resource/dir_04';

        const result = new MarkdownFileCollector().collect(dir);

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

    describe('encode', () => {
      it('# should be encoded to %23', () => {
        const dir = __dirname + '/../../test_resource/dir_05';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].path, '/dir_05%2301/file%2302.md');
        assert.strictEqual(result[0].notation, 'dir_05#01/file#02.md');
        assert.strictEqual(result[1].path, '/file%2301.md');
        assert.strictEqual(result[1].notation, 'file#01.md');
      });

      it('+ should be encoded to %2B', () => {
        const dir = __dirname + '/../../test_resource/dir_06';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].path, '/dir_06%2B01/file%2B02.md');
        assert.strictEqual(result[0].notation, 'dir_06+01/file+02.md');
        assert.strictEqual(result[1].path, '/file%2B01.md');
        assert.strictEqual(result[1].notation, 'file+01.md');
      });

      it.skip('? should be encoded to %3F', () => {
        const dir = __dirname + '/../../test_resource/dir_07';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].path, '/dir_07%3F01/file%3F02.md');
        assert.strictEqual(result[0].notation, 'dir_07?01/file?02.md');
        assert.strictEqual(result[1].path, '/file%3F01.md');
        assert.strictEqual(result[1].notation, 'file?01.md');
      });
    });

    describe('title', () => {
      it('should find #', () => {
        const dir = __dirname + '/../../test_resource/dir_08';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result[0].title, 'file_01');
      });

      it('should find ##', () => {
        const dir = __dirname + '/../../test_resource/dir_08';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result[1].title, 'file_02');
      });

      it('should find ###', () => {
        const dir = __dirname + '/../../test_resource/dir_08';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result[2].title, 'file_03');
      });

      it('should find ######', () => {
        const dir = __dirname + '/../../test_resource/dir_08';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result[3].title, 'file_04');
      });

      it('should not find any header line - no header lines', () => {
        const dir = __dirname + '/../../test_resource/dir_08';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result[4].title, 'file_05.md');
      });

      it('should permit being no space after hash character', () => {
        const dir = __dirname + '/../../test_resource/dir_08';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result[5].title, 'Title of file_06');
      });

      it('should find # - 3 spaces after hash character', () => {
        const dir = __dirname + '/../../test_resource/dir_08';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result[6].title, 'file_07');
      });

      it('should not find any header line - 4 spaces after hash character', () => {
        const dir = __dirname + '/../../test_resource/dir_08';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result[7].title, 'file_08.md');
      });

      it('should return file name as title when text found but heading line not found within first 3 lines', () => {
        const dir = __dirname + '/../../test_resource/dir_09';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result[0].title, 'file_01.md');
      });

      it('should return file name as title when heading line not found within first 3 lines', () => {
        const dir = __dirname + '/../../test_resource/dir_09';

        const result = new MarkdownFileCollector().collect(dir);

        assert.strictEqual(result[1].title, 'file_02.md');
      });
    });
  });
});
