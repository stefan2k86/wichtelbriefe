// Reine Funktionen ohne DOM, damit sie mit `node --test` prüfbar sind.

export function heuteISO(date) {
  const jahr = date.getFullYear();
  const monat = String(date.getMonth() + 1).padStart(2, '0');
  const tag = String(date.getDate()).padStart(2, '0');
  return `${jahr}-${monat}-${tag}`;
}

export function zustand(brief, heute) {
  if (brief.typ === 'pause') return 'pause';
  if (brief.datum > heute) return 'gesperrt';
  return 'verschlossen';
}

export function sortiere(briefe) {
  return [...briefe].sort((a, b) => a.datum.localeCompare(b.datum));
}
