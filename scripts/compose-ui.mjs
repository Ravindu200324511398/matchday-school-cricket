import {readFileSync,writeFileSync,copyFileSync} from 'node:fs';
writeFileSync('public/app.js',['core','workspace','offline-scoring','squads','match-management','live','match-centre','competitions','standings','i18n'].map(n=>readFileSync(`public/${n}.js`,'utf8')).join('\n'));
copyFileSync('lib/cricket/engine.mjs','public/score-engine.mjs');
