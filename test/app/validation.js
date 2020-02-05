const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const SUT = require('../../app/validation');

describe('app.validation', function () {
  describe('valid pattern', function () {
    it('80 is valid for port', function () {
      const data = {
        directory: __dirname,
        port: '80',
      };

      assert.strictEqual(SUT.execute(data).isValid, true);
    });

    it('65535 is valid for port', function () {
      const data = {
        directory: __dirname,
        port: '65535',
      };

      assert.strictEqual(SUT.execute(data).isValid, true);
    });
  });

  describe('invalid pattern', function () {
    it('lacks directory', function () {
      const data = {
        port: '80',
      };

      assert.strictEqual(SUT.execute(data).isValid, false);
    });

    it('lacks port', function () {
      const data = {
        directory: __dirname,
      };

      const result = SUT.execute(data);

      assert.strictEqual(result.isValid, false);
      assert.deepStrictEqual(result.errors, ['port']);
    });

    it('directory does not exist', function () {
      const data = {
        directory: '/foo/bar',
        port: '80',
      };

      const result = SUT.execute(data);

      assert.strictEqual(result.isValid, false);
      assert.deepStrictEqual(result.errors, ['directory']);
    });

    it('79 is invalid for port', function () {
      const data = {
        directory: __dirname,
        port: '79',
      };

      const result = SUT.execute(data);

      assert.strictEqual(result.isValid, false);
      assert.deepStrictEqual(result.errors, ['port']);
    });

    it('65536 is invalid for port', function () {
      const data = {
        directory: __dirname,
        port: '65536',
      };

      const result = SUT.execute(data);

      assert.strictEqual(result.isValid, false);
      assert.deepStrictEqual(result.errors, ['port']);
    });

    it('unknown property is rejected', function () {
      const data = {
        directory: __dirname,
        port: '80',
        foo: 'bar',
      };

      const result = SUT.execute(data);

      assert.strictEqual(result.isValid, false);
    });
  });
});
