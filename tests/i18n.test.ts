import {ct} from "../src";

const {expect, test} = require("@jest/globals");
const {t, init, setTranslations} = require('../src');

const en = require('./translations/en.json');
const sv = require('./translations/sv.json');

// init
test('Initializing the translations work', () => {
  expect(() => init('en', {en, sv})).not.toThrow();
})

// t()
test('t() returns English translation of test string', () => {
  expect(t('Test string')).toBe('Test string');
})

test('Changing language works', () => {
  expect(() => setTranslations('sv')).not.toThrow();
})

test('t() returns Swedish translation of test string with variable', () => {
  expect(
    t('Test string with variable {{variable}}', {variable: 'test'})
  ).toBe('En teststräng med variabel test');
})

test('t() returns Swedish translation of test string with multiple variables', () => {
  expect(
    t('Test string with variable {{variable1}} and {{variable2}}', {variable1: 'test1', variable2: 'test2'})
  ).toBe('En teststräng med variabel test1 och test2');
})

test('Changing language back works', () => {
  expect(() => setTranslations('en')).not.toThrow();
})

test('t() returns correct translation in a string with non letter characters', () => {
  expect(
    t('Test string, with weird characters. Wow!')
  ).toBe('Test string, with weird characters. Wow!');
})

// ct()
test('ct() returns translation of test string', () => {
  expect(ct('Context', 'Context test string')).toBe('Context test string');
})

test('ct() returns translation of test string with variable', () => {
  expect(
    ct('Context', 'Context test string with variable {{variable}}', {variable: 'test'})
  ).toBe('Context test string with variable test');
})

test('ct() returns translation of test string with multiple variables', () => {
  expect(
    ct('Context', 'Context test string with variable {{variable1}} and {{variable2}}', {variable1: 'test1', variable2: 'test2'})
  ).toBe('Context test string with variable test1 and test2');
})
