const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const OUT_JS = path.resolve(__dirname, '..', 'js', 'models.generated.js');

async function getMakes() {
    const url = 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes';
    const res = await fetch(url);
    const text = await res.text();
    // Rimuove JSONP wrapper
    const json = JSON.parse(text.slice(2, -2));
    return json.Makes;
}

async function getModels(make) {
    const url = `https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getModels&make=${make}`;
    const res = await fetch(url);
    const text = await res.text();
    // Rimuove JSONP wrapper
    const json = JSON.parse(text.slice(2, -2));
    return json.Models;
}

async function run() {
    console.log('Scaricamento marche...');
    const makes = await getMakes();
    console.log(`Trovate ${makes.length} marche`);

    const carModels = {};
    
    for (const make of makes) {
        const makeName = make.make_display;
        console.log(`Scaricamento modelli per ${makeName}...`);
        
        try {
            const models = await getModels(make.make_id);
            if (models && models.length) {
                // Rimuovi duplicati e ordina
                carModels[makeName] = [...new Set(models.map(m => m.model_name))]
                    .sort((a, b) => a.localeCompare(b, 'it'));
            }
            // Piccola pausa per non sovraccaricare l'API
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err) {
            console.error(`Errore per ${makeName}:`, err);
        }
    }

    // Genera file JS
    const header = `/* Auto-generated from CarQuery API - ${new Date().toISOString()} */\n`;
    const content = header + 'const carModels = ' + JSON.stringify(carModels, null, 4) + ';\n\n' +
                   'if (typeof module !== "undefined") module.exports = carModels;\n';

    fs.writeFileSync(OUT_JS, content, 'utf8');
    console.log('Generato:', OUT_JS);
    console.log('Marche importate:', Object.keys(carModels).length);
}

run().catch(err => {
    console.error('Errore:', err);
    process.exit(1);
});