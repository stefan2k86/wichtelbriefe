const PRAEFIX = 'wichtel-checkliste-';

export function umschalten(stand, schluessel) {
  return { ...stand, [schluessel]: !stand[schluessel] };
}

export function leseStand(storage, briefDatum) {
  try {
    const roh = storage.getItem(PRAEFIX + briefDatum);
    return roh ? JSON.parse(roh) : {};
  } catch {
    return {};
  }
}

export function speichereStand(storage, briefDatum, stand) {
  try {
    storage.setItem(PRAEFIX + briefDatum, JSON.stringify(stand));
  } catch {
    // Ohne Speicher bleiben die Häkchen nur für diese Sitzung.
  }
}
