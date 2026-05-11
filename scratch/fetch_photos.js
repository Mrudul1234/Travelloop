const fs = require('fs');
const path = require('path');

const API_KEY = 'f1AOny5O_9mWXoWnyJeCvVjfaf48nzHd2EzUna7Tmec';

const CITY_MAP = {
  'goa': '29ezCWtMtnM',
  'ladakh (leh)': 'DDiLYt_F88w',
  'jaipur': 'LMj_BZKeGfE',
  'varanasi (kashi)': '6rDbvXzIVpQ',
  'agra': 'J4Ui2ch3oRU',
  'udaipur': 'uwMlZPLgRk8',
  'kerala backwaters': 'E5GDXuRiAzU',
  'coorg': 'hcRK-x_H21g',
  'ziro valley': 'ZgbzOZW9U3o',
  'mawlynnong': 'IjzhtDTsibQ',
  'shimla': 'k-ejtalL1Ik',
  'dharamshala': '5LEkpdrv1Tg',
  'manali': 'd2eVURGcqjc',
  'tawang': 'ii0oWs5abCo',
  'khajjiar': '6uhSB5vYzQw',
  'spiti valley': 'Rwtxp23mn3o',
  'nubra valley': 'eg3H8kvqN9s',
  'pangong lake': 'ofgTuyRKVnA',
  'ooty': 'aU9yXmIwfkw',
  'munnar': 'FYGEA9aezAw',
  'kanyakumari': 'VV0fF4EoZaI',
  'rann of kutch': 'JS_ohjocm00',
  'dhanushkodi': 'WbBTlOk-CRY',
  'chitrakote falls': 'Jqc2nOH3u3Y',
  'gokarna': 'Iya5bn212xA',
  'pondicherry': 'QTJOi7z_Hp8',
  'hampi': 'RxYnq-q_DGc',
  'majuli island': 'I8DKi3ely24',
  'araku valley': '6XZaixAjdOE',
  'varkala': 'PYXgS098W-w',
  'havelock island': '75gcu08p9TY',
  'neil island': 'JOrwcGtaxK0',
  'shillong': 'GlGwwElWGvY',
  'cherrapunji': '8vv87tI238s',
  'dawki': 'CTAN_92tsjU',
  'krang suri falls': 'Kl2Q7zzzaak',
  'rishikesh': 'lrm2dh_TI0A',
  'haridwar': 'oODtsFye6lQ',
  'amritsar': 'CVUAJlOhzpM',
  'kanatal': 'SWT2xGoUpZA',
  'binsar': 'Y7UIBtbVywA',
  'munsiyari': 'qb_zJEP-yII',
  'chakrata': 'l9tnQaxP34o',
  'kanha': 'WosJhHFVFBw',
  'ranthambore': 'a0fToHHyLHg',
  'bandhavgarh': '_0wdgeHabbY',
  'tadoba': 'vc6cSLmZIMs',
  'lakshadweep': 'xpPMmHBgFd0',
  'kalpeni': 'q5wWGf2-Jyg',
  'jaisalmer': '49WBWRVDFe4'
};

async function updatePhotos() {
  const results = {};
  for (const [city, id] of Object.entries(CITY_MAP)) {
    try {
      const res = await fetch(`https://api.unsplash.com/photos/${id}?client_id=${API_KEY}`);
      if (res.ok) {
        const data = await res.json();
        results[city] = `${data.urls.regular.split('?')[0]}?w=800&q=80`;
        console.log(`Updated ${city}: ${results[city]}`);
      } else {
        console.error(`Failed to fetch ${id} for ${city}: ${res.status}`);
      }
    } catch (err) {
      console.error(`Error fetching ${id} for ${city}:`, err);
    }
  }
  
  fs.writeFileSync('updated_photos.json', JSON.stringify(results, null, 2));
}

updatePhotos();
