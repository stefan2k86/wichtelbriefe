import { heuteISO, sortiere } from './logik.js';

const CACHE_KEY = 'wichtel-briefe-cache';

// Das Apps Script kann das Datum als langen Text liefern („Sat Nov 28 2026 09:00:00 GMT+0100 …“).
// Hier wird jedes Datum auf YYYY-MM-DD gebracht.
function normalisiereDatum(datum) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(datum)) return datum;
  return heuteISO(new Date(datum));
}

// Eine Tabellenzeile wird zu einem Brief. Die Checkliste steht in der Tabelle als Text mit „|“ als Trenner,
// in der Testdatei als Array.
export function zeileZuBrief(zeile) {
  return {
    datum: normalisiereDatum(zeile.datum),
    typ: zeile.typ,
    titel: zeile.titel ?? '',
    text: zeile.text ?? '',
    bild: zeile.bild ?? '',
    checkliste: Array.isArray(zeile.checkliste)
      ? zeile.checkliste
      : zeile.checkliste
        ? String(zeile.checkliste).split('|').map((s) => s.trim()).filter(Boolean)
        : [],
  };
}

export async function ladeBriefe(url, fetchFn = fetch) {
  const antwort = await fetchFn(url);
  if (!antwort.ok) throw new Error(`Laden fehlgeschlagen: ${antwort.status}`);
  const zeilen = await antwort.json();
  return sortiere(zeilen.map(zeileZuBrief));
}

export function speichereCache(briefe, storage) {
  try {
    storage.setItem(CACHE_KEY, JSON.stringify(briefe));
  } catch {
    // Speicher voll oder gesperrt: die Seite funktioniert trotzdem.
  }
}

export function leseCache(storage) {
  try {
    const roh = storage.getItem(CACHE_KEY);
    return roh ? JSON.parse(roh) : null;
  } catch {
    return null;
  }
}
