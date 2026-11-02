// Liefert die Briefe aus dem Blatt „Briefe“ als JSON.
function doGet() {
  const blatt = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Briefe');
  const werte = blatt.getDataRange().getValues();
  const kopf = werte.shift();
  const zeilen = werte
    .filter((zeile) => zeile[0])
    .map((zeile) => {
      const eintrag = {};
      kopf.forEach((name, i) => {
        const wert = zeile[i];
        eintrag[name] = wert instanceof Date
          ? Utilities.formatDate(wert, 'Europe/Berlin', 'yyyy-MM-dd')
          : String(wert ?? '');
      });
      return eintrag;
    });
  return ContentService.createTextOutput(JSON.stringify(zeilen))
    .setMimeType(ContentService.MimeType.JSON);
}
