/**
 * Importa marche/modelli da Wikidata via SPARQL e genera:
 *  - ../js/models.generated.js  (file JS pronto da includere al posto di models.js)
 *
 * Requisiti:
 *  - Node.js 14+
 *  - Eseguire: npm install node-fetch@2
 *
 * Esegui (da workspace): node scripts\import-wikidata-models.js
 *
 * Nota: la query SPARQL cerca elementi che sono (o derivano da) modelli di automobile
 * e che hanno una proprietà "manufacturer" (P176). La copertura dipende dai dati Wikidata.
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const OUT_JS = path.resolve(__dirname, '..', 'js', 'models.generated.js');

const sparqlQuery = `
SELECT DISTINCT ?makeLabel ?modelLabel WHERE {
  # Trova elementi che sono (o sottoclassi di) modelli di automobile e hanno manufacturer (P176)
  ?model wdt:P31/wdt:P279* wd:Q1420.
  ?model wdt:P176 ?make.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "it,en". }
}
LIMIT 20000t
`;

async function run() {
  const url = 'https://query.wikidata.org/sparql';
  const res = await fetch(url + '?query=' + encodeURIComponent(sparqlQuery), {
    headers: { 'Accept': 'application/sparql-results+json', 'User-Agent': 'BonfatiCar-Importer/1.0 (mailto:info@autofficinabonfati.it)' }
  });

  if (!res.ok) {
    console.error('Errore SPARQL:', res.status, res.statusText);
    process.exit(1);
  }

  const data = await res.json();
  const pairs = data.results.bindings;

  // Aggrega in mappa marca -> Set(modelli)
  const map = new Map();
  for (const row of pairs) {
    const make = row.makeLabel && row.makeLabel.value ? row.makeLabel.value.trim() : null;
    const model = row.modelLabel && row.modelLabel.value ? row.modelLabel.value.trim() : null;
    if (!make || !model) continue;

    // Normalizza nomi minimi (rimuove doppioni evidenti)
    const normMake = make.replace(/\s+$/,'');
    let normModel = model.replace(/\s+$/,'');

    // Rimuovi eventuali parentesi con anno/varianti ripetute (semplificazione)
    normModel = normModel.replace(/\s*\(.*\)$/, '');

    if (!map.has(normMake)) map.set(normMake, new Set());
    map.get(normMake).add(normModel);
  }

  // Converte in oggetto ordinato alfabeticamente
  const obj = {};
  const brands = Array.from(map.keys()).sort((a,b) => a.localeCompare(b, 'it'));
  for (const brand of brands) {
    obj[brand] = Array.from(map.get(brand)).sort((a,b) => a.localeCompare(b, 'it'));
  }

  // Genera file JS
  const header = `/* Auto-generated from Wikidata - ${new Date().toISOString()} */\n`;
  const content = header + 'const carModels = ' + JSON.stringify(obj, null, 4) + ';\n\n' +
                  'if (typeof module !== "undefined") module.exports = carModels;\n';

  fs.writeFileSync(OUT_JS, content, 'utf8');
  console.log('Generato:', OUT_JS);
  console.log('Marche importate:', brands.length);
  // Suggerimento: se vuoi sovrascrivere js/models.js, copiare manualmente o adattare qui.
}

run().catch(err => {
  console.error('Errore:', err);
  process.exit(1);
});
