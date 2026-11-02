// Prüft einen eingegebenen PIN gegen den gespeicherten SHA-256-Hash.
export async function pruefePin(eingabe, erwarteterHash) {
  const daten = new TextEncoder().encode(eingabe);
  const puffer = await crypto.subtle.digest('SHA-256', daten);
  const hash = [...new Uint8Array(puffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return hash === erwarteterHash;
}
