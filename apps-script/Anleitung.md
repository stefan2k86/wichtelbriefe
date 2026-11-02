# Einrichtung der Google Tabelle

1. Neue Google Tabelle anlegen. Das Blatt heißt `Briefe`.
2. Erste Zeile (Kopfzeile) exakt so: `datum | typ | titel | text | bild | checkliste`
3. Pro Brief eine Zeile. Datum als echtes Datum, Typ `ankuendigung`, `brief` oder `pause`.
4. Bild: die Drive-Datei-ID. Sie steht im Freigabelink zwischen `/d/` und `/view`.
5. Checkliste: Punkte mit `|` trennen, z. B. `Tür bauen|Bett einrichten`.
6. Erweiterungen > Apps Script, den Inhalt von `Code.gs` einfügen, speichern.
7. Bereitstellen > Neue Bereitstellung > Typ „Web-App“. Ausführen als „Ich“, Zugriff „Jeder“. Die URL endet auf `/exec` und kommt in `js/config.js` (Konstante `BRIEFE_URL`).
8. Im Drive-Ordner mit den Bildern: Freigabe „Jeder mit dem Link“.
9. Die `/exec`-URL im Browser öffnen. Es erscheint JSON mit den Briefen, Datumsangaben als `YYYY-MM-DD`.
