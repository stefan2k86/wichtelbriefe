import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heuteISO, zustand, sortiere } from '../js/logik.js';

test('heuteISO nutzt das lokale Datum, nicht UTC', () => {
  const d = new Date(2026, 11, 1, 0, 30); // 1. Dezember 2026, 00:30 lokal
  assert.equal(heuteISO(d), '2026-12-01');
});

test('zustand: Pause-Tag ist immer Pause', () => {
  assert.equal(zustand({ datum: '2026-11-29', typ: 'pause' }, '2026-12-05'), 'pause');
});

test('zustand: Zukunft ist gesperrt', () => {
  assert.equal(zustand({ datum: '2026-12-02', typ: 'brief' }, '2026-12-01'), 'gesperrt');
});

test('zustand: heute und Vergangenheit sind verschlossen (also öffenbar)', () => {
  assert.equal(zustand({ datum: '2026-12-01', typ: 'brief' }, '2026-12-01'), 'verschlossen');
  assert.equal(zustand({ datum: '2026-11-28', typ: 'ankuendigung' }, '2026-12-01'), 'verschlossen');
});

test('sortiere ordnet nach Datum aufsteigend', () => {
  const sortiert = sortiere([{ datum: '2026-12-02' }, { datum: '2026-11-28' }]);
  assert.deepEqual(sortiert.map((b) => b.datum), ['2026-11-28', '2026-12-02']);
});
