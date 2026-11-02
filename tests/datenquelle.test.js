import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zeileZuBrief, speichereCache, leseCache } from '../js/datenquelle.js';

test('zeileZuBrief teilt die Checkliste am | und lässt leere Felder leer', () => {
  const brief = zeileZuBrief({
    datum: '2026-11-28', typ: 'ankuendigung', titel: 'Hallo',
    text: 'Text', bild: '', checkliste: 'Tür bauen|Bett einrichten',
  });
  assert.deepEqual(brief.checkliste, ['Tür bauen', 'Bett einrichten']);
  assert.equal(brief.bild, '');
});

test('zeileZuBrief übernimmt eine Checkliste, die schon ein Array ist', () => {
  const brief = zeileZuBrief({ datum: '2026-11-28', typ: 'ankuendigung', checkliste: ['Tür bauen', 'Bett einrichten'] });
  assert.deepEqual(brief.checkliste, ['Tür bauen', 'Bett einrichten']);
});

test('zeileZuBrief normalisiert ein langes Datum auf YYYY-MM-DD', () => {
  const brief = zeileZuBrief({ datum: 'Sat Nov 28 2026 09:00:00 GMT+0100 (Mitteleuropäische Normalzeit)', typ: 'ankuendigung' });
  assert.equal(brief.datum, '2026-11-28');
});

test('zeileZuBrief lässt ein Datum im Format YYYY-MM-DD unverändert', () => {
  const brief = zeileZuBrief({ datum: '2026-12-01', typ: 'brief' });
  assert.equal(brief.datum, '2026-12-01');
});

test('zeileZuBrief: leere Checkliste ergibt leeres Array', () => {
  const brief = zeileZuBrief({ datum: '2026-12-01', typ: 'brief', titel: 'x', text: 'y', bild: '', checkliste: '' });
  assert.deepEqual(brief.checkliste, []);
});

test('Cache: speichern und wieder lesen', () => {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  speichereCache([{ datum: '2026-12-01' }], storage);
  assert.deepEqual(leseCache(storage), [{ datum: '2026-12-01' }]);
});

test('Cache: kaputte Daten führen zu null statt zu einem Absturz', () => {
  const storage = { getItem: () => '{kaputt' };
  assert.equal(leseCache(storage), null);
});
