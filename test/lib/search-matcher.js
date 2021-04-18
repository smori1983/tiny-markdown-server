const { describe, it } = require('mocha');
const { given } = require('mocha-testdata');
const assert = require('assert');
const SearchMatcher = require('../../lib/search-matcher');

describe('lib.SearchMatcher', () => {
  describe('countPatterns', () => {
    given(
      ['', 'empty string'],
      [' ', '1 space'],
      ['  ', '2 spaces'],
      ['　', 'Japanese space'],
    ).it('should create no patterns', (value) => {
      const SUT = new SearchMatcher(value);

      assert.deepStrictEqual(SUT.countPatterns(), 0);
    });

    given(
      ['a '],
      [' a '],
      [' a'],
      ['　a　'],
    ).it('should create 1 pattern', (value) => {
      const SUT = new SearchMatcher(value);

      assert.deepStrictEqual(SUT.countPatterns(), 1);
    });

    given(
      ['a aa  aaa'],
      [' a  aa  aaa '],
    ).it('should create 3 patterns', (value) => {
      const SUT = new SearchMatcher(value);

      assert.deepStrictEqual(SUT.countPatterns(), 3);
    });
  });

  describe('matches', () => {
    given(
      'hello',
      'Hello',
      'HELLO',
    ).it('should match as case-insensitive (HELLO)', (value) => {
      const SUT = new SearchMatcher('HELLO');

      assert.ok(SUT.matches(value));
    });

    given(
      '|',
      '|key|value|',
      '/(a|b)/',
    ).it('should match for text contains "|"', (value) => {
      const SUT = new SearchMatcher('|');

      assert.ok(SUT.matches(value));
    });

    given(
      '+',
      '1+1=2',
      '/.+/',
    ).it('should match for text contains "+"', (value) => {
      const SUT = new SearchMatcher('+');

      assert.ok(SUT.matches(value));
    });

    given(
      'aaaaa\n00000\n00000',
      '00000\naaaaa\n00000',
      '00000\n00000\naaaaa',
    ).it('should match for multiline text', (value) => {
      const SUT = new SearchMatcher('aaaaa');

      assert.ok(SUT.matches(value));
    });
  });
});
