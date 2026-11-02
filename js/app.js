import { heuteISO, zustand, sortiere } from './logik.js';
import { ladeBriefe, leseCache, speichereCache } from './datenquelle.js';
import { umschalten, leseStand, speichereStand } from './checkliste.js';
import { BRIEFE_URL, PIN_HASH } from './config.js';
import { pruefePin } from './vorschau.js';

const buehne = document.getElementById('buehne');
const position = document.getElementById('position');
const zurueckKnopf = document.getElementById('zurueck');
const weiterKnopf = document.getElementById('weiter');
const vorschauDialog = document.getElementById('vorschau-dialog');
const vorschauForm = document.getElementById('vorschau-form');

let briefe = [];
let index = 0;
let vorschauAktiv = false;
const heute = heuteISO(new Date());
const geoeffnet = new Set();

function zeigeFolie() {
  const brief = briefe[index];
  if (!brief) { buehne.textContent = 'Noch keine Briefe geladen.'; return; }
  // In der Vorschau gelten alle Briefe als freigegeben, Pausen bleiben Pausen.
  const z = vorschauAktiv && brief.typ !== 'pause' ? 'verschlossen' : zustand(brief, heute);
  position.textContent = `${index + 1} / ${briefe.length}`;
  zurueckKnopf.disabled = index === 0;
  weiterKnopf.disabled = index === briefe.length - 1;

  if (z === 'gesperrt') {
    buehne.innerHTML = '<div class="folie"><div class="gesperrt" aria-label="Gesperrt">🔒</div></div>';
    return;
  }
  if (z === 'pause') {
    buehne.innerHTML = '<div class="folie"><div class="pause" aria-label="Pause">✦</div></div>';
    return;
  }
  if (geoeffnet.has(brief.datum)) {
    zeigeBrief(brief);
  } else {
    zeigeUmschlag(brief);
  }
}

function zeigeUmschlag(brief) {
  buehne.innerHTML = `<div class="folie"><div class="umschlag" role="button" tabindex="0">${brief.titel || 'Brief'}</div></div>`;
  const umschlag = buehne.querySelector('.umschlag');
  const oeffnen = () => {
    umschlag.classList.add('offen');
    setTimeout(() => {
      geoeffnet.add(brief.datum);
      zeigeBrief(brief);
    }, 800);
  };
  umschlag.addEventListener('click', oeffnen);
  umschlag.addEventListener('keydown', (e) => { if (e.key === 'Enter') oeffnen(); });
}

function zeigeBrief(brief) {
  const stand = leseStand(localStorage, brief.datum);
  const bildTeil = brief.bild ? `<img src="https://drive.google.com/uc?export=view&id=${brief.bild}" alt="">` : '';
  const listeTeil = brief.checkliste.length
    ? brief.checkliste.map((punkt) => `<label><input type="checkbox" data-punkt="${punkt}" ${stand[punkt] ? 'checked' : ''}> ${punkt}</label>`).join('')
    : '';
  buehne.innerHTML = `<div class="folie"><article class="brief"><h2>${brief.titel}</h2>${bildTeil}<p>${brief.text}</p>${listeTeil}</article></div>`;
  buehne.querySelectorAll('input[data-punkt]').forEach((box) => {
    box.addEventListener('change', () => {
      const neu = umschalten(leseStand(localStorage, brief.datum), box.dataset.punkt);
      speichereStand(localStorage, brief.datum, neu);
    });
  });
}

zurueckKnopf.addEventListener('click', () => { index = Math.max(0, index - 1); zeigeFolie(); });
weiterKnopf.addEventListener('click', () => { index = Math.min(briefe.length - 1, index + 1); zeigeFolie(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') zurueckKnopf.click();
  if (e.key === 'ArrowRight') weiterKnopf.click();
});

vorschauForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const eingabe = document.getElementById('pin').value;
  if (await pruefePin(eingabe, PIN_HASH)) {
    vorschauAktiv = true;
    index = 0;
    vorschauDialog.hidden = true;
    zeigeFolie();
  } else {
    document.getElementById('pin').value = '';
  }
});

async function start() {
  try {
    briefe = await ladeBriefe(BRIEFE_URL);
    speichereCache(briefe, localStorage);
  } catch {
    briefe = sortiere(leseCache(localStorage) ?? []);
  }
  // Startfolie: der jüngste Eintrag, dessen Datum nicht in der Zukunft liegt.
  // Vor dem ersten Brief bleibt die erste Folie (gesperrt) stehen.
  const erreicht = briefe.filter((b) => b.datum <= heute).length;
  index = Math.max(0, erreicht - 1);
  if (location.search === '?vorschau') vorschauDialog.hidden = false;
  zeigeFolie();
}

start();
