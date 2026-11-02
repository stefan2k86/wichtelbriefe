import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruefePin } from '../js/vorschau.js';

const HASH_VON_1234 = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';

test('richtiger PIN wird akzeptiert', async () => {
  assert.equal(await pruefePin('1234', HASH_VON_1234), true);
});

test('falscher PIN wird abgelehnt', async () => {
  assert.equal(await pruefePin('0000', HASH_VON_1234), false);
});
