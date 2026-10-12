// Monta el HTML final de un caso: sustituye en la plantilla los marcadores
//   {{frag:nombre}}  -> tabla generada por soih_engine.js (datos/fragmentos.json)
//   {{res:ruta}}     -> cifra de datos/resumen.json (por ejemplo {{res:porConfianza.Alta}})
// Uso: node montar_documento.js <plantilla.html> <carpeta_del_caso> <salida.html>
'use strict';
const fs = require('fs');
const path = require('path');
const [plantilla, dirCaso, salida] = process.argv.slice(2);
const frag = JSON.parse(fs.readFileSync(path.join(dirCaso, 'datos', 'fragmentos.json'), 'utf8'));
const res = JSON.parse(fs.readFileSync(path.join(dirCaso, 'datos', 'resumen.json'), 'utf8'));
let faltan = [];
let html = fs.readFileSync(plantilla, 'utf8')
  .replace(/\{\{frag:([\w]+)\}\}/g, (m, k) => { if (!(k in frag)) faltan.push(m); return frag[k] || ''; })
  .replace(/\{\{res:([\w.]+)\}\}/g, (m, k) => {
    const v = k.split('.').reduce((o, p) => (o == null ? o : o[p]), res);
    if (v == null) faltan.push(m);
    return v == null ? '' : String(v);
  });
if (faltan.length) { console.error('Marcadores sin dato: ' + faltan.join(', ')); process.exit(1); }
fs.writeFileSync(salida, html, 'utf8');
console.log('OK ' + salida);
