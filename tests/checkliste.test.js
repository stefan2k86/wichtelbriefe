import { test } from 'node:test';
import assert from 'node:assert/strict';
import { umschalten, leseStand, speichereStand } from '../js/checkliste.js';

test('umschalten dreht den Haken und verändert das Original nicht', () => {
  const alt = { 'Tür bauen': false };
  const neu = umschalten(alt, 'Tür bauen');
  assert.equal(neu['Tür bauen'], true);
  assert.equal(alt['Tür bauen'], false);
});

test('Stand bleibt pro Brief getrennt und übersteht ein Neuladen', () => {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  speichereStand(storage, '2026-11-28', { 'Tür bauen': true });
  assert.deepEqual(leseStand(storage, '2026-11-28'), { 'Tür bauen': true });
  assert.deepEqual(leseStand(storage, '2026-12-01'), {});
});

test('kaputter Speicher liefert leeren Stand', () => {
  const storage = { getItem: () => '{kaputt' };
  assert.deepEqual(leseStand(storage, '2026-11-28'), {});
});
