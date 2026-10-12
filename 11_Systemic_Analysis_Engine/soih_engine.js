// SOIH - motor de analisis v0.1 (parte determinista de las fases 3, 4 y 4F)
// Uso: node soih_engine.js <carpeta_del_caso>
// Lee <caso>/datos/caso.js y escribe CSV, fragmentos HTML y el mapa interactivo.
// No interpreta nada: valida, aplica la regla de confianza y calcula sobre el grafo.
'use strict';
const fs = require('fs');
const path = require('path');

const dirCaso = path.resolve(process.argv[2] || '.');
const caso = require(path.join(dirCaso, 'datos', 'caso.js'));
const dirDatos = path.join(dirCaso, 'datos');
const LONG_MAX = caso.longitudMaximaBucle || 8;

// ---------- 1. Validacion ----------
const errores = [];
const avisos = [];
const V = new Map();
for (const v of caso.variables) {
  if (V.has(v.id)) errores.push(`Variable duplicada: ${v.id}`);
  V.set(v.id, v);
  for (const campo of ['id', 'nombre', 'definicion', 'tipo', 'escala', 'cluster', 'frontera']) {
    if (!v[campo]) errores.push(`${v.id}: falta el campo ${campo}`);
  }
  if (!v.indicador) errores.push(`${v.id}: falta indicador (usar "no medida" si no lo hay)`);
  if (/^(falta|exceso|ausencia|escasez|carencia) /i.test(v.nombre)) avisos.push(`${v.id}: nombre formulado como carencia o exceso (regla 3): "${v.nombre}"`);
  if (/ y /i.test(v.nombre) && !v.permiteY) avisos.push(`${v.id}: posible doble idea (regla 4): "${v.nombre}"`);
  if (v.tipo === 'decision' && !v.dueno) errores.push(`${v.id}: variable de decision sin dueno (P17)`);
  if (!caso.clusters.some(c => c.id === v.cluster)) errores.push(`${v.id}: cluster desconocido ${v.cluster}`);
}
const S = new Map((caso.statements || []).map(s => [s.id, s]));
const E = [];
const vistos = new Set();
for (const e of caso.edges) {
  if (!V.has(e.de)) errores.push(`${e.id}: origen desconocido ${e.de}`);
  if (!V.has(e.a)) errores.push(`${e.id}: destino desconocido ${e.a}`);
  if (e.pol !== '+' && e.pol !== '-') errores.push(`${e.id}: polaridad invalida`);
  if (!e.mecanismo) errores.push(`${e.id}: falta mecanismo`);
  if (!/^D[0-3]$/.test(e.D)) errores.push(`${e.id}: nivel D invalido`);
  // Nivel de percepcion: se deriva, no se declara. Regla fija:
  //   sin expresiones -> P0; una -> P1; varias de un mismo bloque de interes -> P2; de dos bloques o mas -> P3.
  {
    const sts = (e.statements || []).map(id => S.get(id)).filter(Boolean);
    const bloques = new Set(sts.map(x => x.bloque));
    e.P = sts.length === 0 ? 'P0' : bloques.size >= 2 ? 'P3' : sts.length >= 2 ? 'P2' : 'P1';
    e.bloques = [...bloques].sort().join('');
    e.tipos = [...new Set(sts.map(x => x.tipo))];
    e.hip = !!e.hipotesis;
    e.naturaleza = e.contable ? 'contable' : e.hip ? 'hipótesis del analista' : sts.length === 0 ? 'apoyada solo en datos' : (+e.D[1] >= 1 ? 'afirmada y con datos' : 'afirmada');
    // Reglas de registro: nada sin fuente puede pasar por relacion apoyada
    if (e.hip && (sts.length || e.D !== 'D0')) errores.push(`${e.id}: marcada como hipotesis pero lleva afirmaciones o datos`);
    if (!e.hip && !e.contable && sts.length === 0 && e.D === 'D0') errores.push(`${e.id}: sin afirmacion ni fuente; debe marcarse como hipotesis del analista`);
    if (+e.D[1] >= 1 && !e.evidencia) errores.push(`${e.id}: declara nivel ${e.D} sin fuente escrita en «evidencia»`);
  }
  const clave = e.de + '>' + e.a;
  if (vistos.has(clave)) errores.push(`${e.id}: relacion repetida ${clave}`);
  vistos.add(clave);
  for (const sid of (e.statements || [])) if (!S.has(sid)) errores.push(`${e.id}: statement desconocido ${sid}`);
  E.push(e);
}
if (errores.length) {
  console.error('ERRORES DE VALIDACION:\n' + errores.join('\n'));
  process.exit(1);
}

// ---------- 2. Regla de confianza (seccion 10 de la metodologia v0.2) ----------
const NIVELES = ['Conjetura', 'Baja', 'Media', 'Alta'];
function confianza(e) {
  const p = +e.P[1], d = +e.D[1];
  let n;
  if (d === 3 || (d === 2 && p === 3)) n = 3;
  else if (d === 2 || (d === 1 && p === 3)) n = 2;
  else if (d === 1 || p >= 2) n = 1;
  else n = 0;
  if (e.disputada && n > 0) n -= 1;
  return n;
}
for (const e of E) { e.nConf = e.hip ? 0 : confianza(e); e.conf = e.hip ? 'Hipótesis del analista' : e.contable ? 'Contable' : NIVELES[e.nConf]; }
// «Con apoyo» = confianza baja o superior. Las conjeturas (una sola afirmacion, sin datos) y las hipotesis
// del analista quedan fuera de todos los calculos.

// ---------- 2b. Arquetipos: el analista propone, el motor verifica ----------
const RET = { 'inmediato': 0, 'meses': 0.5, '1-3 años': 2, '>3 años': 5 };   // anos, orden de magnitud
const porPar = new Map(E.map(e => [e.de + '>' + e.a, e]));
const CLASES = {
  soluciones_que_fallan: 'Soluciones que fallan', desplazamiento_carga: 'Desplazamiento de la carga',
  limites_crecimiento: 'Límites al crecimiento', exito_para_quien_tiene_exito: 'Éxito para quien tiene éxito',
  escalada: 'Escalada', equilibrio_con_retardo: 'Equilibrio con retardo', equilibrio_simple: 'Bucle de equilibrio'
};
const erroresArq = [];
const arquetipos = (caso.arquetipos || []).map(a => {
  const bucles = a.bucles.map(b => {
    const ar = [];
    b.cadena.forEach((id, i) => {
      const sig = b.cadena[(i + 1) % b.cadena.length];
      const e = porPar.get(id + '>' + sig);
      if (!e) erroresArq.push(`${a.id}: la cadena «${b.rol}» usa una relacion que no existe en el mapa (${id} -> ${sig})`);
      else ar.push(e);
    });
    if (ar.length !== b.cadena.length) return null;
    const tipo = ar.filter(e => e.pol === '-').length % 2 === 0 ? 'R' : 'B';
    if (tipo !== b.tipo) erroresArq.push(`${a.id}: «${b.rol}» se declara ${b.tipo} y el calculo da ${tipo}`);
    const nMin = Math.min(...ar.map(e => e.nConf));
    return { rol: b.rol, tipo, cadena: b.cadena, aristas: ar, nConf: nMin, conf: NIVELES[nMin], debil: ar.filter(e => e.nConf === nMin).map(e => e.id), retardo: ar.reduce((s, e) => s + (RET[e.retardo] || 0), 0), disputadas: ar.filter(e => e.disputada).map(e => e.id) };
  });
  return Object.assign({}, a, { bucles });
});
if (erroresArq.length) { console.error('ERRORES EN ARQUETIPOS:\n' + erroresArq.join('\n')); process.exit(1); }
// Regla estructural de cada clase
for (const a of arquetipos) {
  const B = a.bucles.filter(b => b.tipo === 'B'), R = a.bucles.filter(b => b.tipo === 'R');
  const comunes = a.bucles.map(b => new Set(b.cadena)).reduce((x, y) => new Set([...x].filter(k => y.has(k))));
  const esDecision = id => V.get(id) && V.get(id).tipo === 'decision';
  const tieneDecision = b => b.cadena.some(esDecision);
  let ok, regla;
  switch (a.clase) {
    case 'soluciones_que_fallan':
      regla = 'Al menos un bucle de equilibrio y uno de refuerzo, y todos pasan por la misma variable de decisión.';
      ok = B.length >= 1 && R.length >= 1 && esDecision(a.arreglo) && a.bucles.every(b => b.cadena.includes(a.arreglo)); break;
    case 'desplazamiento_carga':
      regla = 'Dos bucles de equilibrio que comparten el síntoma, cada uno con su variable de decisión, y el primero más rápido que el segundo.';
      ok = B.length >= 2 && B.every(b => b.cadena.includes(a.sintoma)) && B[0].cadena.includes(a.arreglo) && B[1].cadena.includes(a.fundamental) && esDecision(a.arreglo) && esDecision(a.fundamental) && B[0].retardo < B[1].retardo; break;
    case 'limites_crecimiento':
      regla = 'Un bucle de refuerzo y al menos uno de equilibrio que comparte variable con él o con otro bucle del conjunto, sin variables de decisión.';
      ok = R.length >= 1 && B.length >= 1 && !a.bucles.some(tieneDecision) && B.some(b => b.cadena.some(k => R.some(r => r.cadena.includes(k)) || B.some(o => o !== b && o.cadena.includes(k)))); break;
    case 'exito_para_quien_tiene_exito':
      regla = 'Un bucle de refuerzo y otro de equilibrio que comparten variable (regla parcial: el arquetipo completo pide dos bucles de refuerzo que compiten por un recurso).';
      ok = R.length >= 1 && B.length >= 1 && comunes.size >= 1; break;
    case 'escalada':
      regla = 'Un bucle de refuerzo y otro de equilibrio que comparten variables, con dos variables de decisión distintas (regla parcial).';
      ok = R.length >= 1 && B.length >= 1 && comunes.size >= 1 && new Set(a.bucles.flatMap(b => b.cadena.filter(esDecision))).size >= 2; break;
    case 'equilibrio_con_retardo':
      regla = 'Un bucle de equilibrio cuyo retardo acumulado supera los cinco años.';
      ok = B.length === 1 && R.length === 0 && B[0].retardo >= 5; break;
    case 'equilibrio_simple':
      regla = 'Un único bucle de equilibrio.';
      ok = B.length === 1 && R.length === 0; break;
    default: regla = 'Clase sin regla'; ok = false;
  }
  a.regla = regla; a.cumple = ok;
  a.nConf = Math.min(...a.bucles.map(b => b.nConf));
  // Clase de apoyo: se deriva de las relaciones que lo forman
  const todas = a.bucles.flatMap(b => b.aristas);
  a.hip = [...new Set(todas.filter(e => e.hip).map(e => e.id))];
  a.conj = [...new Set(todas.filter(e => !e.hip && e.nConf === 0).map(e => e.id))];
  a.apoyo = a.hip.length ? 'Hipótesis de trabajo' : a.conj.length ? 'Conjetura' : 'Con apoyo';
}

// ---------- 3. Metricas de red ----------
const ids = [...V.keys()];
const idx = new Map(ids.map((id, i) => [id, i]));
const N = ids.length;
// Todas las metricas se calculan solo con las relaciones que tienen apoyo: ni conjeturas ni hipotesis.
const EA = E.filter(e => e.nConf >= 1 && !e.hip);
const sal = ids.map(() => []), ent = ids.map(() => []);
for (const e of EA) { sal[idx.get(e.de)].push(e); ent[idx.get(e.a)].push(e); }

// Intermediacion (Brandes, grafo dirigido sin pesos)
function intermediacion() {
  const cb = new Array(N).fill(0);
  for (let s = 0; s < N; s++) {
    const pila = [], pred = ids.map(() => []), sigma = new Array(N).fill(0), dist = new Array(N).fill(-1);
    sigma[s] = 1; dist[s] = 0;
    const cola = [s];
    while (cola.length) {
      const v = cola.shift(); pila.push(v);
      for (const e of sal[v]) {
        const w = idx.get(e.a);
        if (dist[w] < 0) { dist[w] = dist[v] + 1; cola.push(w); }
        if (dist[w] === dist[v] + 1) { sigma[w] += sigma[v]; pred[w].push(v); }
      }
    }
    const delta = new Array(N).fill(0);
    while (pila.length) {
      const w = pila.pop();
      for (const v of pred[w]) delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
      if (w !== s) cb[w] += delta[w];
    }
  }
  return cb;
}
const cb = intermediacion();
const cbMax = Math.max(...cb, 1);

// Distancia causal a los sintomas (pasos minimos hasta cualquier variable sintoma)
const sintomas = ids.filter(id => V.get(id).tipo === 'sintoma');
const distSint = new Array(N).fill(Infinity);
{
  const cola = [];
  for (const s of sintomas) { distSint[idx.get(s)] = 0; cola.push(idx.get(s)); }
  while (cola.length) {
    const v = cola.shift();
    for (const e of ent[v]) {
      const u = idx.get(e.de);
      if (distSint[u] === Infinity) { distSint[u] = distSint[v] + 1; cola.push(u); }
    }
  }
}

// ---------- 4. Bucles (ciclos simples hasta LONG_MAX) ----------
function buscarBucles(aristas) {
  const ady = ids.map(() => []);
  for (const e of aristas) ady[idx.get(e.de)].push(e);
  const bucles = [];
  const enCamino = new Array(N).fill(false);
  function dfs(inicio, v, camino) {
    for (const e of ady[v]) {
      const w = idx.get(e.a);
      if (w === inicio) { bucles.push([...camino, e]); continue; }
      if (w < inicio || enCamino[w] || camino.length + 1 >= LONG_MAX) continue;
      enCamino[w] = true;
      dfs(inicio, w, [...camino, e]);
      enCamino[w] = false;
    }
  }
  for (let s = 0; s < N; s++) { enCamino[s] = true; dfs(s, s, []); enCamino[s] = false; }
  return bucles.map(ar => {
    const neg = ar.filter(e => e.pol === '-').length;
    const nMin = Math.min(...ar.map(e => e.nConf));
    return {
      aristas: ar,
      nodos: ar.map(e => e.de),
      tipo: neg % 2 === 0 ? 'R' : 'B',
      largo: ar.length,
      nConf: nMin,
      conf: NIVELES[nMin],
      debil: ar.filter(e => e.nConf === nMin).map(e => e.id),
      clusters: [...new Set(ar.map(e => V.get(e.de).cluster))]
    };
  });
}
const buclesFirmes = buscarBucles(E.filter(e => e.nConf >= 1));   // primera pasada: sin conjeturas
const buclesTodos = buscarBucles(E.filter(e => !e.hip));          // con conjeturas, sin hipotesis del analista
const buclesConHipotesis = buscarBucles(E).length;               // solo para informar de cuantos dependen de hipotesis
const partFirme = new Array(N).fill(0), partTodos = new Array(N).fill(0);
for (const b of buclesFirmes) for (const n of b.nodos) partFirme[idx.get(n)]++;
for (const b of buclesTodos) for (const n of b.nodos) partTodos[idx.get(n)]++;

// Conjunto reducido: bucles mas cortos primero, cada uno debe aportar al menos una relacion nueva
function conjuntoReducido(bucles) {
  const orden = [...bucles].sort((a, b) => a.largo - b.largo || b.nConf - a.nConf);
  const cubiertas = new Set(), sel = [];
  for (const b of orden) {
    if (b.aristas.some(e => !cubiertas.has(e.id))) { sel.push(b); b.aristas.forEach(e => cubiertas.add(e.id)); }
  }
  return sel;
}
const reducido = conjuntoReducido(buclesFirmes);
reducido.forEach((b, i) => { b.id = (b.tipo) + String(i + 1).padStart(2, '0'); });

// Tipos de actor que mencionan cada variable (derivado de las expresiones ligadas a sus relaciones)
for (const id of ids) {
  const t = new Set();
  for (const e of E) if (e.de === id || e.a === id) e.tipos.forEach(x => t.add(x));
  V.get(id).actores = [...t].sort();
}

// ---------- 4b. Propagacion de signo: de cada variable de decision a cada sintoma ----------
// Cuenta todos los caminos simples de hasta PROF relaciones (sin conjeturas) y el signo de cada uno.
// No dice cuanto cambia el sintoma: dice por cuantas vias y en que sentido empuja cada decision.
const PROF = caso.profundidadPropagacion || 6;
function caminos(origen, destino, aristas) {
  const ady = ids.map(() => []);
  for (const e of aristas) ady[idx.get(e.de)].push(e);
  const o = idx.get(origen), d = idx.get(destino);
  const res = { pos: 0, neg: 0, corto: null, cortoSigno: null, cortoIds: null };
  const vis = new Array(N).fill(false);
  (function dfs(v, signo, largo, rastro) {
    if (v === d && largo > 0) {
      signo > 0 ? res.pos++ : res.neg++;
      if (res.corto === null || largo < res.corto) { res.corto = largo; res.cortoSigno = signo; res.cortoIds = [...rastro]; }
      else if (largo === res.corto && signo !== res.cortoSigno) res.cortoSigno = 0;
      return;
    }
    if (largo >= PROF) return;
    vis[v] = true;
    for (const e of ady[v]) {
      const w = idx.get(e.a);
      if (vis[w]) continue;
      rastro.push(e.id);
      dfs(w, signo * (e.pol === '+' ? 1 : -1), largo + 1, rastro);
      rastro.pop();
    }
    vis[v] = false;
  })(o, 1, 0, []);
  return res;
}
const decisiones = ids.filter(id => V.get(id).tipo === 'decision');
const firmes = E.filter(e => e.nConf >= 1);
const propagacion = decisiones.map(dv => ({ id: dv, efectos: sintomas.map(sv => Object.assign({ sintoma: sv }, caminos(dv, sv, firmes))) }));

// ---------- 5. Agregacion a N1 (mapa de dominios) ----------
const C = caso.clusters;
const n1 = new Map();
for (const e of EA) {
  const a = V.get(e.de).cluster, b = V.get(e.a).cluster;
  if (a === b) continue;
  const k = a + '>' + b;
  if (!n1.has(k)) n1.set(k, { de: a, a: b, n: 0, pos: 0, neg: 0, firmes: 0, disputadas: 0 });
  const r = n1.get(k);
  r.n++; e.pol === '+' ? r.pos++ : r.neg++;
  if (e.nConf >= 2) r.firmes++;
  if (e.disputada) r.disputadas++;
}
const resumenCluster = C.map(c => {
  const vs = ids.filter(id => V.get(id).cluster === c.id);
  const internas = EA.filter(e => V.get(e.de).cluster === c.id && V.get(e.a).cluster === c.id).length;
  const salen = EA.filter(e => V.get(e.de).cluster === c.id && V.get(e.a).cluster !== c.id).length;
  const entran = EA.filter(e => V.get(e.de).cluster !== c.id && V.get(e.a).cluster === c.id).length;
  const rel = EA.filter(e => V.get(e.de).cluster === c.id || V.get(e.a).cluster === c.id);
  const inciertas = rel.filter(e => e.nConf <= 1 || e.disputada).length;
  const sinApoyo = E.filter(e => (e.hip || e.nConf === 0) && (V.get(e.de).cluster === c.id || V.get(e.a).cluster === c.id)).length;
  const bucles = buclesFirmes.filter(b => b.clusters.includes(c.id)).length;
  const dists = vs.map(id => distSint[idx.get(id)]).filter(d => d !== Infinity);
  return {
    id: c.id, nombre: c.nombre, variables: vs.length, internas, salen, entran,
    bucles, inciertas, totalRel: rel.length, sinApoyo,
    distMedia: dists.length ? (dists.reduce((a, b) => a + b, 0) / dists.length) : null,
    decision: vs.filter(id => V.get(id).tipo === 'decision').length
  };
});

// ---------- 6. Salidas ----------
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function csv(nombre, cab, filas) {
  const q = x => '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"';
  const txt = [cab.map(q).join(';'), ...filas.map(f => f.map(q).join(';'))].join('\r\n');
  fs.writeFileSync(path.join(dirDatos, nombre), '﻿' + txt, 'utf8');
}
const nombre = id => V.get(id).nombre;
const nomCluster = id => C.find(c => c.id === id).nombre;

csv('variables.csv',
  ['ID', 'Nombre', 'Definicion', 'Tipo', 'Unidad', 'Escala', 'Indicador', 'Fuente', 'Cluster', 'Frontera', 'Dueno', 'Tipos de actor que la mencionan', 'Entradas', 'Salidas', 'Intermediacion (0-100)', 'Bucles (sin conjeturas)', 'Pasos hasta sintoma'],
  ids.map((id, i) => { const v = V.get(id); return [id, v.nombre, v.definicion, v.tipo, v.unidad || '', v.escala, v.indicador, v.fuente || '', nomCluster(v.cluster), v.frontera, v.dueno || '', (v.actores || []).join(', '), ent[i].length, sal[i].length, Math.round(100 * cb[i] / cbMax), partFirme[i], distSint[i] === Infinity ? 'sin camino' : distSint[i]]; }));
csv('relaciones.csv',
  ['ID', 'Origen', 'Destino', 'Polaridad', 'Mecanismo', 'Retardo', 'Magnitud', 'Naturaleza', 'Percepcion', 'Datos', 'Disputada', 'Confianza', 'Ambito', 'Evidencia', 'Contradicciones', 'Statements'],
  E.map(e => [e.id, nombre(e.de), nombre(e.a), e.pol, e.mecanismo, e.retardo || '', e.magnitud || '', e.naturaleza || '', e.P, e.D, e.disputada ? 'SI' : '', e.conf, e.ambito || '', e.evidencia || '', e.contra || '', (e.statements || []).join(', ')]));
csv('statements.csv',
  ['ID', 'Actor', 'Tipo de actor', 'Fecha', 'Expresion', 'Literal', 'Afirmacion causal', 'Fuente'],
  (caso.statements || []).map(s => [s.id, s.actor, s.tipo, s.fecha || '', s.texto, s.literal ? 'cita' : 'parafrasis', s.afirma || '', s.url || '']));
csv('bucles.csv',
  ['ID', 'Tipo', 'Relaciones', 'Confianza', 'Eslabon mas debil', 'Clusters', 'Cadena'],
  reducido.map(b => [b.id, b.tipo, b.largo, b.conf, b.debil.join(', '), b.clusters.map(nomCluster).join(' | '), b.aristas.map(e => `${nombre(e.de)} (${e.pol})`).join(' -> ') + ' -> ' + nombre(b.aristas[0].de)]));
csv('clusters_foco.csv',
  ['Cluster', 'Variables', 'Relaciones internas', 'Salen', 'Entran', 'Bucles en que participa', 'Relaciones inciertas o disputadas', 'Total relaciones', 'Pasos medios a sintoma', 'Variables de decision'],
  resumenCluster.map(r => [r.nombre, r.variables, r.internas, r.salen, r.entran, r.bucles, r.inciertas, r.totalRel, r.distMedia == null ? '' : r.distMedia.toFixed(1), r.decision]));

// Fragmentos HTML para el documento Word
const frag = {};
let resumenExtra = {};
const tabla = (cab, filas, anchos) => '<table><tr>' + cab.map((c, i) => `<th${anchos && anchos[i] ? ` style="width:${anchos[i]}"` : ''}>${esc(c)}</th>`).join('') + '</tr>' +
  filas.map(f => '<tr>' + f.map(x => `<td>${x}</td>`).join('') + '</tr>').join('') + '</table>';
const colorConf = ['#C05621', '#B7791F', '#2B6CB0', '#276749'];
const etiConf = e => `<span style="color:${colorConf[e.nConf]}"><b>${e.conf}</b></span>${e.disputada ? ' <span style="color:#C05621">(disputada)</span>' : ''}`;

frag.diccionario = C.map(c => {
  const vs = ids.filter(id => V.get(id).cluster === c.id);
  return `<h3>${esc(c.id)} · ${esc(c.nombre)}</h3><p>${esc(c.descripcion || '')}</p>` + tabla(
    ['ID', 'Variable', 'Definicion', 'Tipo y escala', 'Indicador y fuente'],
    vs.map(id => { const v = V.get(id); return [esc(id), `<b>${esc(v.nombre)}</b>`, esc(v.definicion), esc(v.tipo) + (v.dueno ? `<br><i>Dueno: ${esc(v.dueno)}</i>` : '') + `<br>${esc(v.escala)}` + (v.frontera === 'exogena' ? '<br><i>Exogena</i>' : ''), esc(v.indicador) + (v.fuente ? `<br><i>${esc(v.fuente)}</i>` : '')]; }),
    ['6%', '20%', '32%', '16%', '26%']);
}).join('');

frag.firmes = tabla(['ID', 'Relación', 'Confianza', 'En qué se apoya', 'Límite'],
  E.filter(e => !e.contable && !e.hip && e.nConf >= 2).sort((a, b) => b.nConf - a.nConf).map(e => [esc(e.id), `${esc(nombre(e.de))} <b>→(${e.pol === '+' ? '+' : '−'})</b> ${esc(nombre(e.a))}`, etiConf(e) + `<br>${e.P} / ${e.D}`, esc(e.evidencia), esc(e.contra || '')]),
  ['5%', '25%', '10%', '35%', '25%']);
frag.duenos = tabla(['Variable de decisión', 'La decide', 'Definición'],
  ids.filter(id => V.get(id).tipo === 'decision').map(id => [`<b>${esc(nombre(id))}</b>`, esc(V.get(id).dueno), esc(V.get(id).definicion)]), ['28%', '27%', '45%']);
frag.actores = tabla(['Actor', 'Resultado que se observa', 'Le conviene que…'],
  (caso.resultados || []).flatMap(g => g.variables.map(([id, mejor], i) => [i === 0 ? `<b>${esc(g.dimension)}</b>` : '', esc(nombre(id)), mejor])));
frag.hipotesis = tabla(['ID', 'Relación', 'Mecanismo supuesto', 'Nota'],
  E.filter(e => e.hip).map(e => [esc(e.id), `${esc(nombre(e.de))} <b>→(${e.pol === '+' ? '+' : '−'})</b> ${esc(nombre(e.a))}`, esc(e.mecanismo), esc(e.contra || '')]),
  ['6%', '34%', '38%', '22%']);
frag.relaciones = C.map(c => {
  const es = E.filter(e => !e.hip && V.get(e.de).cluster === c.id);
  if (!es.length) return '';
  return `<h3>Relaciones que salen de ${esc(c.id)} · ${esc(c.nombre)}</h3>` + tabla(
    ['ID', 'Relacion', 'Mecanismo', 'Retardo', 'P / D', 'Confianza', 'Evidencia y contradicciones'],
    es.map(e => [esc(e.id), `${esc(nombre(e.de))} <b>→(${e.pol === '+' ? '+' : '−'})</b> ${esc(nombre(e.a))}`, esc(e.mecanismo), esc(e.retardo || ''), `${e.P} / ${e.D}`, etiConf(e), esc(e.evidencia || '') + (e.contra ? `<br><i>En contra: ${esc(e.contra)}</i>` : '')]),
    ['5%', '22%', '24%', '8%', '6%', '9%', '26%']);
}).join('');

frag.n1matriz = (() => {
  const cab = ['De \\ A', ...C.map(c => c.id)];
  const filas = C.map(a => [`<b>${esc(a.id)}</b> ${esc(a.nombre)}`, ...C.map(b => {
    if (a.id === b.id) { const r = resumenCluster.find(x => x.id === a.id); return `<span style="color:#829AB1">(${r.internas})</span>`; }
    const r = n1.get(a.id + '>' + b.id); if (!r) return '';
    return `<b>${r.n}</b>` + (r.disputadas ? `<span style="color:#C05621">*</span>` : '');
  })]);
  return tabla(cab, filas);
})();

frag.n1lista = tabla(['De', 'A', 'Relaciones', '+ / −', 'Confianza media o alta', 'Disputadas'],
  [...n1.values()].sort((x, y) => y.n - x.n).map(r => [esc(nomCluster(r.de)), esc(nomCluster(r.a)), r.n, `${r.pos} / ${r.neg}`, r.firmes, r.disputadas || '']));

frag.foco = tabla(['Dominio', 'Variables', 'Relaciones con apoyo (internas / salen / entran)', 'De ellas, de confianza baja o disputadas', 'Conjeturas e hipótesis sin usar', 'Bucles con apoyo', 'Variables de decisión'],
  resumenCluster.map(r => [`<b>${esc(r.id)}</b> ${esc(r.nombre)}`, r.variables, `${r.internas} / ${r.salen} / ${r.entran}`, `${r.inciertas} de ${r.totalRel}`, r.sinApoyo, r.bucles, r.decision]));

const top = (arr, n) => ids.map((id, i) => ({ id, x: arr[i] })).sort((a, b) => b.x - a.x).slice(0, n);
frag.centrales = tabla(['Variable', 'Cluster', 'Entradas', 'Salidas', 'Intermediacion (0-100)', 'Bucles sin conjeturas', 'Pasos a sintoma'],
  top(cb, 15).map(o => { const i = idx.get(o.id); return [`<b>${esc(nombre(o.id))}</b>`, esc(V.get(o.id).cluster), ent[i].length, sal[i].length, Math.round(100 * cb[i] / cbMax), partFirme[i], distSint[i] === Infinity ? '-' : distSint[i]]; }));

frag.raices = tabla(['Variable', 'Cluster', 'Tipo', 'Salidas'],
  ids.filter((id, i) => ent[i].length === 0).map(id => [`<b>${esc(nombre(id))}</b>`, esc(V.get(id).cluster), esc(V.get(id).tipo) + (V.get(id).frontera === 'exogena' ? ' (exogena)' : ''), sal[idx.get(id)].length]));

frag.bucles = tabla(['ID', 'Tipo', 'Cadena', 'Confianza', 'Eslabon mas debil'],
  reducido.slice(0, 40).map(b => [b.id, b.tipo === 'R' ? 'Refuerzo' : 'Equilibrio', b.aristas.map(e => `${esc(nombre(e.de))} <b>(${e.pol === '+' ? '+' : '−'})</b>`).join(' → ') + ' → ' + esc(nombre(b.aristas[0].de)), `<span style="color:${colorConf[b.nConf]}"><b>${b.conf}</b></span>`, esc(b.debil.join(', '))]),
  ['6%', '9%', '60%', '10%', '15%']);

frag.inciertas = tabla(['ID', 'Relacion', 'P / D', 'Confianza', 'Bucles que dependen de ella'],
  E.filter(e => !e.hip).map(e => ({ e, n: buclesTodos.filter(b => b.aristas.includes(e)).length })).filter(o => o.e.disputada).sort((a, b) => b.n - a.n).slice(0, 20)
    .map(o => [esc(o.e.id), `${esc(nombre(o.e.de))} →(${o.e.pol === '+' ? '+' : '−'}) ${esc(nombre(o.e.a))}`, `${o.e.P} / ${o.e.D}`, etiConf(o.e), o.n]));

// Matriz decision x sintoma
const celda = f => {
  if (f.corto === null) return '<span style="color:#829AB1">sin camino</span>';
  const s = f.cortoSigno > 0 ? '<b style="color:#C05621">sube</b>' : f.cortoSigno < 0 ? '<b style="color:#276749">baja</b>' : '<b>ambiguo</b>';
  return `${s} en ${f.corto} pasos<br><span style="color:#52606D">${f.pos} vías (+) · ${f.neg} vías (−)</span>`;
};
frag.palancas = tabla(['Si aumenta la variable de decisión…', ...sintomas.map(nombre)],
  propagacion.map(p => [`<b>${esc(nombre(p.id))}</b><br><i>${esc(V.get(p.id).dueno || '')}</i>`, ...p.efectos.map(celda)]));

// Arquetipos
const cadenaTxt = b => b.aristas.map(e => `${esc(nombre(e.de))} <b>(${e.pol === '+' ? '+' : '−'})</b>`).join(' → ') + ' → ' + esc(nombre(b.aristas[0].de));
for (const a of arquetipos) frag['arq_' + a.id] =
  `<p><b>Qué explica.</b> ${esc(a.explica)}</p><p><b>Qué lo pondría en duda.</b> ${esc(a.duda)}</p>` +
  tabla(['Papel', 'Tipo', 'Cadena', 'Confianza', 'Retardo acumulado'],
    a.bucles.map(b => [esc(b.rol), b.tipo === 'R' ? 'Refuerzo' : 'Equilibrio', cadenaTxt(b), `<span style="color:${colorConf[b.nConf]}"><b>${b.conf}</b></span>` + (b.disputadas.length ? ' <span style="color:#C05621">(pasa por una relación disputada)</span>' : ''), b.retardo === 0 ? 'inmediato' : `del orden de ${String(b.retardo).replace('.', ',')} años`]),
    ['16%', '9%', '50%', '14%', '11%']) +
  `<p class="pie"><b>Verificación estructural:</b> ${a.cumple ? 'cumple' : 'NO cumple'}. Regla: ${esc(a.regla)}</p>`;
frag.arquetipos = arquetipos.map(a =>
  `<h3>${esc(a.id)} · ${esc(a.nombre)} <span style="color:#52606D">(${esc(CLASES[a.clase] || a.clase)})</span></h3>` +
  `<p><b>Qué explica.</b> ${esc(a.explica)}</p><p><b>Qué lo pondría en duda.</b> ${esc(a.duda)}</p>` +
  tabla(['Papel', 'Tipo', 'Cadena', 'Confianza', 'Retardo acumulado'],
    a.bucles.map(b => [esc(b.rol), b.tipo === 'R' ? 'Refuerzo' : 'Equilibrio', cadenaTxt(b), `<span style="color:${colorConf[b.nConf]}"><b>${b.conf}</b></span>` + (b.disputadas.length ? ' <span style="color:#C05621">(pasa por una relación disputada)</span>' : ''), b.retardo === 0 ? 'inmediato' : `del orden de ${String(b.retardo).replace('.', ',')} años`]),
    ['16%', '9%', '50%', '14%', '11%']) +
  `<p class="pie"><b>Verificación estructural:</b> ${a.cumple ? 'cumple' : 'NO cumple'}. Regla: ${esc(a.regla)}</p>`).join('');
const colorApoyo = { 'Con apoyo': '#276749', 'Conjetura': '#B7791F', 'Hipótesis de trabajo': '#C05621' };
frag.arquetiposResumen = tabla(['ID', 'Arquetipo', 'Nombre en este sistema', 'Bucles', 'Apoyo', 'De qué depende', 'Regla estructural'],
  arquetipos.map(a => [a.id, esc(CLASES[a.clase] || a.clase), `<b>${esc(a.nombre)}</b>`, a.bucles.map(b => b.tipo).join(' + '),
    `<span style="color:${colorApoyo[a.apoyo]}"><b>${a.apoyo}</b></span>`,
    a.hip.length ? `Hipótesis del analista: ${a.hip.map(id => { const e = E.find(x => x.id === id); return esc(nombre(e.de)) + ' → ' + esc(nombre(e.a)); }).join('; ')}` + (a.conj.length ? `. Conjeturas: ${a.conj.join(', ')}` : '') : a.conj.length ? `Conjeturas: ${a.conj.join(', ')}` : `Todas sus relaciones tienen apoyo; la más débil es de confianza ${NIVELES[a.nConf].toLowerCase()}`,
    a.cumple ? 'Cumple' : 'No cumple']),
  ['5%', '13%', '17%', '7%', '10%', '41%', '7%']);
// Censo: en cuantos bucles de cada tipo esta cada variable de decision
frag.decisionesEnBucles = tabla(['Variable de decisión', 'Bucles de equilibrio', 'Bucles de refuerzo', 'Lectura'],
  decisiones.map(d => { const nB = buclesFirmes.filter(b => b.tipo === 'B' && b.nodos.includes(d)).length, nR = buclesFirmes.filter(b => b.tipo === 'R' && b.nodos.includes(d)).length;
    return [`<b>${esc(nombre(d))}</b>`, nB, nR, nB && nR ? 'Corrige y a la vez alimenta: candidata a «soluciones que fallan»' : nB ? 'Solo corrige' : nR ? 'Solo alimenta' : 'Fuera de todo bucle']; }));

frag.statements = tabla(['ID', 'Actor', 'Bloque', 'Fecha', 'Expresión', 'Qué afirma', 'Cotejada'],
  (caso.statements || []).map(s => [s.id, esc(s.actor) + `<br><i>${esc(caso.tiposActor[s.tipo] || s.tipo)}</i>`, s.bloque, esc(s.fecha), (s.literal ? '«' + esc(s.texto) + '»' : esc(s.texto) + ' <i>(paráfrasis)</i>'), esc(s.afirma), s.cotejada ? '<b style="color:#276749">Sí</b>' : 'No']),
  ['5%', '19%', '5%', '8%', '31%', '25%', '7%']);
resumenExtra = { afirmacionesCotejadas: (caso.statements || []).filter(s => s.cotejada).length };

const cuentaConf = NIVELES.map((n, i) => E.filter(e => e.nConf === i).length);
const resumen = {
  afirmacionesCotejadas: resumenExtra.afirmacionesCotejadas,
  variables: N, relaciones: E.length, statements: (caso.statements || []).length, clusters: C.length,
  porConfianza: Object.fromEntries(NIVELES.map((n, i) => [n, cuentaConf[i]])),
  disputadas: E.filter(e => e.disputada).length,
  porTipo: Object.fromEntries([...new Set(ids.map(id => V.get(id).tipo))].map(t => [t, ids.filter(id => V.get(id).tipo === t).length])),
  noMedidas: ids.filter(id => /^no medida/i.test(V.get(id).indicador)).length,
  buclesSinConjeturas: buclesFirmes.length, R: buclesFirmes.filter(b => b.tipo === 'R').length, B: buclesFirmes.filter(b => b.tipo === 'B').length,
  buclesConConjeturas: buclesTodos.length, buclesConHipotesis, conjuntoReducido: reducido.length, longitudMaxima: LONG_MAX,
  hipotesis: E.filter(e => e.hip).length, contables: E.filter(e => e.contable).length,
  conApoyo: E.filter(e => !e.hip && !e.contable && e.nConf >= 1).length,
  conjeturas: E.filter(e => !e.hip && e.nConf === 0).length,
  altaNoContable: E.filter(e => !e.contable && e.nConf === 3).length,
  mediaNoContable: E.filter(e => !e.contable && e.nConf === 2).length,
  bajaNoContable: E.filter(e => !e.contable && e.nConf === 1).length,
  sinCaminoASintoma: ids.filter((id, i) => distSint[i] === Infinity).map(nombre),
  aisladas: ids.filter((id, i) => ent[i].length + sal[i].length === 0).map(nombre),
  avisos
};
fs.writeFileSync(path.join(dirDatos, 'resumen.json'), JSON.stringify(resumen, null, 2), 'utf8');
fs.writeFileSync(path.join(dirDatos, 'fragmentos.json'), JSON.stringify(frag), 'utf8');

// ---------- 7. Mapa interactivo (HTML autonomo, sin dependencias) ----------
const paleta = ['#2B6CB0', '#C05621', '#276749', '#6B46C1', '#B7791F', '#2C7A7B', '#97266D', '#4A5568', '#9C4221', '#285E61', '#553C9A', '#744210', '#2A4365', '#702459'];
const datosMapa = {
  titulo: caso.titulo,
  clusters: C.map((c, i) => ({ id: c.id, nombre: c.nombre, color: paleta[i % paleta.length] })),
  nodos: ids.map((id, i) => { const v = V.get(id); return { id, n: v.nombre, d: v.definicion, t: v.tipo, c: v.cluster, ind: v.indicador, f: v.fuente || '', du: v.dueno || '', e: ent[i].length, s: sal[i].length, b: Math.round(100 * cb[i] / cbMax), l: partFirme[i] }; }),
  aristas: E.map(e => ({ id: e.id, de: e.de, a: e.a, p: e.pol, m: e.mecanismo, r: e.retardo || '', P: e.P, D: e.D, c: e.nConf, h: e.hip ? 1 : 0, k: e.contable ? 1 : 0, q: e.disputada ? 1 : 0, ev: e.evidencia || '', co: e.contra || '' })),
  bucles: reducido.map(b => ({ id: b.id, t: b.tipo, c: b.nConf, a: b.aristas.map(e => e.id) })),
  sintomas
};
const htmlMapa = fs.readFileSync(path.join(__dirname, 'plantilla_mapa.html'), 'utf8').replace('/*__DATOS__*/', 'const DATOS = ' + JSON.stringify(datosMapa) + ';');
fs.writeFileSync(path.join(dirCaso, 'Mapa_interactivo_N2.html'), htmlMapa, 'utf8');

// ---------- 8. Esquema del sistema con arquetipos (HTML autonomo) ----------
if (caso.esquema && arquetipos.length) {
  const pos = caso.esquema.pos;
  const enArq = new Set(arquetipos.flatMap(a => a.bucles.flatMap(b => b.aristas.map(e => e.id))));
  for (const id of new Set(arquetipos.flatMap(a => a.bucles.flatMap(b => b.cadena)))) if (!pos[id]) { console.error(`Esquema: falta la posicion de ${id}`); process.exit(1); }
  const datosEsq = {
    titulo: caso.titulo,
    clusters: datosMapa.clusters,
    nodos: Object.keys(pos).map(id => { const v = V.get(id); return { id, n: v.nombre, t: v.tipo, c: v.cluster, d: v.definicion, x: pos[id][0], y: pos[id][1], up: (caso.esquema.etiquetaArriba || []).includes(id) ? 1 : 0, sint: v.tipo === 'sintoma' ? 1 : 0, dec: v.tipo === 'decision' ? 1 : 0, du: v.dueno || '' }; }),
    aristas: E.filter(e => enArq.has(e.id)).map(e => ({ id: e.id, de: e.de, a: e.a, p: e.pol, c: e.nConf, h: e.hip ? 1 : 0, q: e.disputada ? 1 : 0, r: e.retardo || '', m: e.mecanismo, P: e.P, D: e.D, conf: e.conf })),
    arquetipos: arquetipos.map(a => ({ id: a.id, clase: CLASES[a.clase] || a.clase, nombre: a.nombre, explica: a.explica, duda: a.duda, cumple: a.cumple ? 1 : 0, c: a.nConf, apoyo: a.apoyo,
      dep: a.hip.map(id => { const e = E.find(x => x.id === id); return nombre(e.de) + ' → ' + nombre(e.a); }),
      bucles: a.bucles.map(b => ({ rol: b.rol, t: b.tipo, c: b.nConf, ret: b.retardo, n: b.cadena, a: b.aristas.map(e => e.id) })) }))
  };
  const htmlEsq = fs.readFileSync(path.join(__dirname, 'plantilla_esquema.html'), 'utf8').replace('/*__DATOS__*/', 'const DATOS = ' + JSON.stringify(datosEsq) + ';');
  fs.writeFileSync(path.join(dirCaso, 'Esquema_del_sistema.html'), htmlEsq, 'utf8');
}
// ---------- 9. Simulador de tendencias (HTML autonomo) ----------
// Tendencia observada: regla fija sobre el ultimo dato y el de referencia.
const UMBRAL = 0.02;
const observado = {};
for (const [id, x] of Object.entries(caso.datos || {})) {
  if (!V.has(id)) { console.error(`Datos: variable desconocida ${id}`); process.exit(1); }
  const varia = x.previo == null ? null : (x.valor - x.previo) / Math.abs(x.previo);
  observado[id] = Object.assign({}, x, { varia, tend: varia == null ? null : varia > UMBRAL ? 1 : varia < -UMBRAL ? -1 : 0 });
}
if (caso.resultados) {
  for (const g of caso.resultados) for (const [id] of g.variables) if (!V.has(id)) { console.error(`Resultados: variable desconocida ${id}`); process.exit(1); }
  for (const s of (caso.escenarios || [])) for (const id of Object.keys(s.fija)) if (!V.has(id)) { console.error(`Escenarios: variable desconocida ${id}`); process.exit(1); }
  const datosSim = {
    titulo: caso.titulo, umbral: UMBRAL,
    clusters: datosMapa.clusters,
    nodos: ids.map(id => { const v = V.get(id); return { id, n: v.nombre, t: v.tipo, c: v.cluster, d: v.definicion, du: v.dueno || '', o: observado[id] || null }; }),
    aristas: E.map(e => ({ id: e.id, de: e.de, a: e.a, p: e.pol, c: e.nConf, h: e.hip ? 1 : 0, q: e.disputada ? 1 : 0, r: RET[e.retardo] || 0, m: e.mecanismo })),
    resultados: caso.resultados, escenarios: caso.escenarios || [],
    pos: Object.assign({}, (caso.esquema || {}).pos || {}, (caso.esquema || {}).posExtra || {}), arriba: (caso.esquema || {}).etiquetaArriba || []
  };

  // ---- Evaluacion de escenarios: mismo calculo que el simulador, hecho aqui para dejarlo escrito.
  // Para cada escenario se fijan sus variables y se cuentan todos los caminos simples de hasta PROF relaciones
  // con apoyo (confianza baja o superior) hacia cada resultado, por signo y por plazo.
  function evaluar(fija, minimo) {
    const ady = {};
    for (const e of E) if (e.nConf >= (minimo || 1) && !e.hip) (ady[e.de] = ady[e.de] || []).push(e);
    const res = {};
    const celda = id => (res[id] = res[id] || [0, 1, 2].map(() => ({ pos: 0, neg: 0, cam: [] })));
    for (const [o, s0] of Object.entries(fija)) {
      if (!s0) continue;
      const vis = new Set([o]);
      (function dfs(v, signo, ret, conf, rastro) {
        for (const e of (ady[v] || [])) {
          if (e.a in fija || vis.has(e.a)) continue;
          const s = signo * (e.pol === '+' ? 1 : -1), r = ret + (RET[e.retardo] || 0), c = Math.min(conf, e.nConf), h = r < 1 ? 0 : r <= 4 ? 1 : 2;
          const k = celda(e.a)[h]; s > 0 ? k.pos++ : k.neg++;
          const ids = [...rastro, e.id];
          k.cam.push({ o, s0, s, r, c, ids, disp: ids.some(id => E.find(x => x.id === id).disputada) });
          if (ids.length < PROF) { vis.add(e.a); dfs(e.a, s, r, c, ids); vis.delete(e.a); }
        }
      })(o, s0, 0, 3, []);
    }
    return res;
  }
  const HOR = ['menos de 1 año', 'de 1 a 4 años', 'más de 4 años'];
  const juicio = (pos, neg, mejor) => !pos && !neg ? 'nada' : pos && neg ? 'contrario' : ((pos > 0) === (mejor === 'sube')) ? 'mejora' : 'empeora';
  let ICONO = { mejora: '<b style="color:#276749">Mejora</b>', empeora: '<b style="color:#C05621">Empeora</b>', contrario: '<b style="color:#6B46C1">Vías contrarias</b>', nada: '<span style="color:#9FB3C8">Sin vía</span>', fijada: '<span style="color:#52606D">Fijada</span>' };
  // Primera ronda de un resultado = los caminos causales mas cortos que llegan a el desde las variables fijadas.
  // Efectos de vuelta = el resto de caminos, mas largos: realimentaciones y rodeos.
  // Es una convencion declarada: la primera ronda llega antes, pero el mapa no dice si pesa mas.
  const VACIA = () => [0, 1, 2].map(() => ({ pos: 0, neg: 0, cam: [] }));
  function resumenFila(id, mejor, res) {
    const r = res[id] || VACIA();
    const cam = r.flatMap(k => k.cam);
    const base = { id, mejor, hor: r.map(k => juicio(k.pos, k.neg, mejor)), cam };
    if (!cam.length) return Object.assign(base, { prim: 'nada', post: 'nada', nPrim: 0, nFav: 0, nCon: 0, pasos: null, plazo: null, confPrim: null, camPrim: [], camVuelta: [] });
    const lmin = Math.min(...cam.map(c => c.ids.length));
    const P1 = cam.filter(c => c.ids.length === lmin), Q = cam.filter(c => c.ids.length > lmin);
    const fav = c => (c.s > 0) === (mejor === 'sube');
    const prim = juicio(P1.filter(c => c.s > 0).length, P1.filter(c => c.s < 0).length, mejor);
    const nFav = Q.filter(fav).length, nCon = Q.length - nFav;
    return Object.assign(base, { prim, nPrim: P1.length, nFav, nCon, pasos: lmin, plazo: Math.min(...P1.map(c => c.r)), confPrim: Math.max(...P1.map(c => c.c)), camPrim: P1, camVuelta: Q,
      // efectos de vuelta respecto a lo que le conviene al actor
      vuelta: !Q.length ? 'ninguno' : nCon && nFav ? 'en los dos sentidos' : nCon ? 'en contra' : 'a favor' });
  }
  const cuentaFilas = filas => {
    const f = filas.filter(x => !x.fijada);
    return { mejora: f.filter(x => x.prim === 'mejora').length, empeora: f.filter(x => x.prim === 'empeora').length, contrario: f.filter(x => x.prim === 'contrario').length, nada: f.filter(x => x.prim === 'nada').length,
      mejoraConVueltaEnContra: f.filter(x => x.prim === 'mejora' && x.nCon > 0).length, empeoraConVueltaAFavor: f.filter(x => x.prim === 'empeora' && x.nFav > 0).length };
  };
  const evaluados = (caso.escenarios || []).map(sc => {
    const res = evaluar(sc.fija), res2 = evaluar(sc.fija, 2);
    const monta = R0 => caso.resultados.map(g => ({ dimension: g.dimension, filas: g.variables.map(([id, mejor]) => (id in sc.fija) ? { id, mejor, fijada: true, prim: 'fijada', hor: ['fijada', 'fijada', 'fijada'], cam: [], camPrim: [], camVuelta: [], nFav: 0, nCon: 0 } : resumenFila(id, mejor, R0)) }));
    const grupos = monta(res), grupos2 = monta(res2);
    const f2 = grupos2.flatMap(g => g.filas).filter(f => !f.fijada);
    const lista = j => f2.filter(f => f.prim === j).map(f => nombre(f.id));
    return { sc, grupos, grupos2, cuenta: cuentaFilas(grupos.flatMap(g => g.filas)), cuenta2: cuentaFilas(f2), firme: { mejora: lista('mejora'), empeora: lista('empeora'), contrario: lista('contrario') } };
  });
  const cadena = c => { let s = c.s0, t = `${s > 0 ? '▲' : '▼'} ${esc(nombre(c.o))}`; for (const id of c.ids) { const e = E.find(x => x.id === id); s *= e.pol === '+' ? 1 : -1; t += ` →(${e.pol === '+' ? '+' : '−'}) ${s > 0 ? '▲' : '▼'} ${esc(nombre(e.a))}`; } return t; };
  const plazoTxt = r => r < 1 ? 'menos de 1 año' : `≈ ${String(r).replace('.', ',')} años`;
  ICONO.contrario = '<b style="color:#6B46C1">Señales contrarias</b>';
  // Matriz escenario x actor, por primera ronda
  frag.escenariosMatriz = tabla(['Escenario', ...caso.resultados.map(g => g.dimension)],
    evaluados.map(ev => [`<b>${esc(ev.sc.id)}</b> ${esc(ev.sc.nombre)}`, ...ev.grupos.map(g => {
      const c = cuentaFilas(g.filas), partes = [];
      if (c.mejora) partes.push(`<b style="color:#276749">${c.mejora} mejora${c.mejora > 1 ? 'n' : ''}</b>` + (c.mejoraConVueltaEnContra ? `<br><span style="color:#52606D">(${c.mejoraConVueltaEnContra} con vuelta en contra)</span>` : ''));
      if (c.empeora) partes.push(`<b style="color:#C05621">${c.empeora} empeora${c.empeora > 1 ? 'n' : ''}</b>` + (c.empeoraConVueltaAFavor ? `<br><span style="color:#52606D">(${c.empeoraConVueltaAFavor} con vuelta a favor)</span>` : ''));
      if (c.contrario) partes.push(`<b style="color:#6B46C1">${c.contrario} con señales contrarias</b>`);
      return partes.length ? partes.join('<br>') : '<span style="color:#9FB3C8">sin vía</span>';
    })]));
  frag.escenariosCuenta = tabla(['Escenario', 'Mejoran en primera ronda', 'De ellos, con efectos de vuelta en contra', 'Empeoran en primera ronda', 'De ellos, con efectos de vuelta a favor', 'Señales contrarias ya en la primera ronda', 'Sin vía con apoyo'],
    evaluados.map(ev => [`<b>${esc(ev.sc.id)}</b> ${esc(ev.sc.nombre)}`, ev.cuenta.mejora, ev.cuenta.mejoraConVueltaEnContra, ev.cuenta.empeora, ev.cuenta.empeoraConVueltaAFavor, ev.cuenta.contrario, ev.cuenta.nada]));
  const li = a => a.length ? a.map(esc).join('; ') : '<span style="color:#9FB3C8">ninguno</span>';
  frag.escenariosFirme = tabla(['Escenario', 'Mejora en primera ronda', 'Empeora en primera ronda', 'Señales contrarias'],
    evaluados.map(ev => [`<b>${esc(ev.sc.id)}</b> ${esc(ev.sc.nombre)}`, `<span style="color:#276749">${li(ev.firme.mejora)}</span>`, `<span style="color:#C05621">${li(ev.firme.empeora)}</span>`, `<span style="color:#6B46C1">${li(ev.firme.contrario)}</span>`]),
    ['25%', '32%', '25%', '18%']);
  const celdaPrim = f => f.fijada ? ICONO.fijada : f.prim === 'nada' ? ICONO.nada : `${ICONO[f.prim]}<br><span style="color:#52606D">${f.pasos} paso${f.pasos > 1 ? 's' : ''} · ${plazoTxt(f.plazo)} · confianza ${NIVELES[f.confPrim].toLowerCase()}</span>`;
  const celdaVuelta = f => f.fijada || f.prim === 'nada' ? '—' : !(f.nFav + f.nCon) ? 'ninguno' : `${f.nFav} a favor · <span style="color:${f.nCon ? '#C05621' : '#52606D'}">${f.nCon} en contra</span>`;
  const mejores = (cs, n) => [...cs].sort((a, b) => b.c - a.c || a.ids.length - b.ids.length || a.r - b.r).slice(0, n);
  for (const ev of evaluados) {
    const filas = ev.grupos.flatMap(g => g.filas), filas2 = ev.grupos2.flatMap(g => g.filas);
    const advPrim = filas.filter(f => !f.fijada && (f.prim === 'empeora' || f.prim === 'contrario'));
    const rebote = filas.filter(f => !f.fijada && f.prim === 'mejora' && f.nCon > 0);
    const noFav = f => c => (c.s > 0) !== (f.mejor === 'sube');
    frag['esc_' + ev.sc.id] =
      `<p><b>Cómo se representa.</b> ${esc(ev.sc.lectura)}</p><p><b>Supuesto que añade.</b> ${esc(ev.sc.supuesto || '')}</p>` + (ev.sc.magnitud ? `<p><b>Lo que se sabe de su tamaño.</b> ${esc(ev.sc.magnitud)}</p>` : '') +
      tabla(['Actor', 'Resultado', 'Le conviene que…', 'Primera ronda', 'Efectos de vuelta', 'Primera ronda, solo con confianza media o alta'],
        ev.grupos.flatMap((g, gi) => g.filas.map((f, i) => [i === 0 ? `<b>${esc(g.dimension)}</b>` : '', esc(nombre(f.id)), f.mejor, celdaPrim(f), celdaVuelta(f), (() => { const x = ev.grupos2[gi].filas[i]; return x.fijada ? ICONO.fijada : ICONO[x.prim]; })()])),
        ['15%', '22%', '9%', '22%', '16%', '16%']) +
      (advPrim.length ? '<p><b>Perjuicios de primera ronda</b> (el camino más firme de cada uno):</p>' + tabla(['Resultado', 'Vía', 'Plazo', 'Confianza'],
        advPrim.flatMap(f => mejores(f.camPrim.filter(noFav(f)), 1).map(c => [esc(nombre(f.id)), cadena(c), plazoTxt(c.r), NIVELES[c.c] + (c.disp ? ' <span style="color:#C05621">(pasa por una relación disputada)</span>' : '')])), ['20%', '56%', '11%', '13%'])
        : '<p><b>Perjuicios de primera ronda:</b> ninguno con las relaciones que tienen apoyo.</p>') +
      (rebote.length ? '<p><b>Efectos de vuelta en contra de lo que mejora</b> (el más firme y corto de cada resultado):</p>' + tabla(['Resultado', 'Vía', 'Plazo', 'Confianza'],
        rebote.flatMap(f => mejores(f.camVuelta.filter(noFav(f)), 1).map(c => [esc(nombre(f.id)), cadena(c), plazoTxt(c.r), NIVELES[c.c] + (c.disp ? ' <span style="color:#C05621">(pasa por una relación disputada)</span>' : '')])), ['20%', '56%', '11%', '13%']) : '');
  }
  csv('escenarios.csv', ['Escenario', 'Actor', 'Resultado', 'Mejora si', 'Primera ronda', 'Pasos', 'Plazo (años)', 'Confianza', 'Vuelta a favor', 'Vuelta en contra', 'Primera ronda (media o alta)'],
    evaluados.flatMap(ev => ev.grupos.flatMap((g, gi) => g.filas.map((f, i) => [ev.sc.id + ' ' + ev.sc.nombre, g.dimension, nombre(f.id), f.mejor, f.prim, f.pasos == null ? '' : f.pasos, f.plazo == null ? '' : f.plazo, f.confPrim == null ? '' : NIVELES[f.confPrim], f.nFav, f.nCon, ev.grupos2[gi].filas[i].prim]))));
  resumen.escenarios = evaluados.map(ev => Object.assign({ id: ev.sc.id }, ev.cuenta));

  // ---- Busqueda de paquetes: se prueban TODAS las combinaciones de palancas y se ordenan con criterios escritos.
  // No se optimiza ninguna cantidad: se cuenta, por primera ronda, que resultados mejoran, empeoran o reciben senales contrarias.
  if (caso.palancas && caso.palancas.length) {
    for (const p of caso.palancas) if (!V.has(p.id)) { console.error(`Palancas: variable desconocida ${p.id}`); process.exit(1); }
    const outs = caso.resultados.flatMap((g, gi) => g.variables.map(([id, mejor]) => ({ id, mejor, gi })));
    const adyN = [1, 2].map(min => { const a = {}; for (const e of E) if (e.nConf >= min && !e.hip) (a[e.de] = a[e.de] || []).push({ a: e.a, s: e.pol === '+' ? 1 : -1 }); return a; });
    // Nivel 3 = calculo base (nivel 1) modificado por las premisas del decisor: relaciones que se dan por ciertas o que se retiran
    if (caso.premisas) {
      const clave = (a, b) => a + '>' + b, act = new Set(caso.premisas.activa.map(p => clave(p[0], p[1]))), des = new Set(caso.premisas.desactiva.map(p => clave(p[0], p[1])));
      for (const k of [...act, ...des]) if (!E.some(e => clave(e.de, e.a) === k)) { console.error('Premisas: no existe la relacion ' + k); process.exit(1); }
      const a = {}; for (const e of E) { const k = clave(e.de, e.a); if (des.has(k)) continue; if (act.has(k) || (e.nConf >= 1 && !e.hip)) (a[e.de] = a[e.de] || []).push({ a: e.a, s: e.pol === '+' ? 1 : -1 }); }
      adyN.push(a);
    }
    const esOut = new Set(outs.map(o => o.id));
    // Criterio de coste social: solo cuentan los resultados que describen como viven las personas (caso.criterioSocial.resultados)
    const SOC = new Set((caso.criterioSocial && caso.criterioSocial.resultados) || []);
    const GP = (caso.gruposPersonas || []).map(g => Object.assign({}, g, { set: new Set(g.resultados) }));
    for (const g of GP) for (const id of g.set) if (!SOC.has(id)) { console.error('Grupos de personas: ' + id + ' no es un resultado social'); process.exit(1); }
    for (const id of SOC) if (!esOut.has(id)) { console.error('Criterio social: ' + id + ' no es un resultado de ningun actor'); process.exit(1); }
    function cuenta(fija, nivel) {   // por resultado: [pasos minimos, vias + y - de la primera ronda, vias + y - posteriores]
      const ady = typeof nivel === 'object' ? nivel : adyN[nivel - 1], r = {};
      for (const o in fija) {
        const vis = new Set([o]);
        (function dfs(v, s, largo) {
          const L = ady[v]; if (!L) return;
          for (const e of L) {
            if (e.a in fija || vis.has(e.a)) continue;
            const s2 = s * e.s, l = largo + 1;
            if (esOut.has(e.a)) {
              const k = (r[e.a] = r[e.a] || { l: Infinity, p: 0, n: 0, P: 0, N: 0 });
              if (l < k.l) { k.P += k.p; k.N += k.n; k.l = l; k.p = 0; k.n = 0; }
              if (l === k.l) { s2 > 0 ? k.p++ : k.n++; } else { s2 > 0 ? k.P++ : k.N++; }
            }
            if (l < PROF) { vis.add(e.a); dfs(e.a, s2, l); vis.delete(e.a); }
          }
        })(o, fija[o], 0);
      }
      return r;
    }
    function valora(fija, nivel) {
      const r = cuenta(fija, nivel);
      let mej = 0, emp = 0, con = 0, reb = 0; const gEmp = new Set(), gMej = new Set(), gCon = new Set(), det = [], vuelta = [];
      for (const o of outs) {
        if (o.id in fija) { det.push('fijada'); vuelta.push(null); continue; }
        const k = r[o.id]; const j = !k ? 'nada' : juicio(k.p, k.n, o.mejor); det.push(j);
        const fav = !k ? 0 : (o.mejor === 'sube' ? k.P : k.N), contra = !k ? 0 : (o.mejor === 'sube' ? k.N : k.P);
        vuelta.push(k ? [fav, contra] : null);
        if (j === 'mejora') { mej++; gMej.add(o.gi); if (contra) reb++; } else if (j === 'empeora') { emp++; gEmp.add(o.gi); } else if (j === 'contrario') { con++; gCon.add(o.gi); }
      }
      let sMej = 0, sEmp = 0, sCon = 0, sReb = 0;
      outs.forEach((o, i) => { if (!SOC.has(o.id)) return; const j = det[i]; if (j === 'mejora') { sMej++; if (vuelta[i] && vuelta[i][1]) sReb++; } else if (j === 'empeora') sEmp++; else if (j === 'contrario') sCon++; });
      let pNum = 0, pDen = 0; const pG = [];
      for (const g of GP) { let gm = 0, ge = 0, gn = 0; outs.forEach((o, i) => { if (!g.set.has(o.id)) return; gn++; if (det[i] === 'mejora') gm++; else if (det[i] === 'empeora') ge++; }); pNum += g.personas * (gm - ge) / gn; pDen += g.personas; pG.push([gm, ge, gn]); }
      const pIdx = pDen ? Math.round(1000 * pNum / pDen) / 10 : 0;
      const limpios = [...gMej].filter(g => !gEmp.has(g) && !gCon.has(g)).length;
      return { mej, emp, con, reb, gEmp: gEmp.size, gCon: gCon.size, gMej: gMej.size, limpios, det, vuelta, sMej, sEmp, sCon, sReb, sBal: sMej - sEmp, pIdx, pG };
    }
    const MAXK = caso.maxMedidasPaquete || 5;
    const todos = [];
    (function gen(i, fija, k) {
      if (i === caso.palancas.length) { if (k) { const a = valora(fija, 1), b = valora(fija, 2); todos.push({ fija: Object.assign({}, fija), k, a, b }); } return; }
      gen(i + 1, fija, k);
      if (k >= MAXK) return;
      const p = caso.palancas[i];
      for (const v of [...(p.sube ? [1] : []), ...(p.baja ? [-1] : [])]) { fija[p.id] = v; gen(i + 1, fija, k + 1); delete fija[p.id]; }
    })(0, {}, 0);
    const orden = (claves) => (x, y) => { for (const f of claves) { const d = f(x) - f(y); if (d) return d; } return 0; };
    const CRIT = [
      { id: 'P1', nombre: 'Sin perdedores', filtro: x => x.a.mej >= 1,
        regla: 'Entre los paquetes que mejoran al menos un resultado: primero, el menor número de actores con algún resultado que empeora en primera ronda; después, menos resultados que empeoran; menos con señales contrarias; menos mejoras con efectos de vuelta en contra; más resultados que mejoran; menos medidas; y, si aún hay empate, mejor saldo con evidencia media o alta. Con todas las relaciones que tienen apoyo.',
        f: orden([x => x.a.gEmp, x => x.a.emp, x => x.a.con, x => x.a.reb, x => -x.a.mej, x => x.k, x => -(x.b.mej - x.b.emp)]) },
      { id: 'P2', nombre: 'Solo evidencia firme', filtro: x => x.b.mej >= 1,
        regla: 'Usando solo relaciones de confianza media o alta: ningún resultado que empeore ni con señales contrarias en primera ronda; después, el mayor número de resultados que mejoran y menos efectos de vuelta en contra; para desempatar, menos perjuicios al añadir la evidencia débil y menos medidas.',
        f: orden([x => x.b.emp + x.b.con, x => -x.b.mej, x => x.b.reb, x => x.a.emp, x => x.a.con, x => x.k]) },
      { id: 'P3', nombre: 'Más actores beneficiados', filtro: x => x.a.mej >= 1,
        regla: 'El mayor número de actores con algún resultado que mejora en primera ronda, aunque otros empeoren; después, menos actores con resultados que empeoran; menos resultados que empeoran; menos con señales contrarias; más resultados que mejoran; menos efectos de vuelta en contra; menos medidas. Con todas las relaciones que tienen apoyo.',
        f: orden([x => -x.a.gMej, x => x.a.gEmp, x => x.a.emp, x => x.a.con, x => -x.a.mej, x => x.a.reb, x => x.k]) }
    ];
    const familia = x => { const s = new Set(Object.entries(x.fija).map(([id, v]) => { const p = caso.palancas.find(q => q.id === id); return (v > 0 ? p.familiaSube : p.familiaBaja) || 'sin clasificar'; })); return s.size === 1 ? [...s][0] : 'mixto'; };
    if (SOC.size) {
      const reglaSoc = 'Solo cuentan los resultados que describen cómo viven las personas; la rentabilidad de quien ofrece no puntúa ni penaliza. Primero, el mayor saldo entre resultados sociales que mejoran y que empeoran en primera ronda; después, menos resultados sociales que empeoran; menos con señales contrarias; menos mejoras con efectos de vuelta en contra; mayor saldo usando solo evidencia media o alta; menos medidas.';
      const fSoc = orden([x => -x.a.sBal, x => x.a.sEmp, x => x.a.sCon, x => x.a.sReb, x => -x.b.sBal, x => x.k]);
      CRIT.push({ id: 'P4', nombre: 'Menor coste social', filtro: x => x.a.sMej >= 1, regla: reglaSoc, f: fSoc });
      if (GP.length) CRIT.push({ id: 'P5', nombre: 'Más personas beneficiadas', filtro: x => x.a.pIdx > 0,
        regla: 'Se pondera por personas: cada grupo de población recibe una nota entre −1 y +1 según cuántos de sus resultados mejoran y empeoran en primera ronda, y se promedia con el número de personas de cada grupo. Gana el índice más alto; después, el más alto con evidencia media o alta; menos resultados sociales que empeoran; menos medidas. Es una simulación con una convención declarada.',
        f: orden([x => -x.a.pIdx, x => -x.b.pIdx, x => x.a.sEmp, x => x.k]) });
      CRIT.push({ id: 'P4I', nombre: 'Menor coste social, solo intervención', filtro: x => x.a.sMej >= 1 && familia(x) === 'intervencion', regla: 'La misma regla, eligiendo solo entre medidas que intervienen el mercado. ' + reglaSoc, f: fSoc });
      CRIT.push({ id: 'P4M', nombre: 'Menor coste social, solo mercado', filtro: x => x.a.sMej >= 1 && familia(x) === 'mercado', regla: 'La misma regla, eligiendo solo entre medidas que dejan actuar a la oferta y la demanda. ' + reglaSoc, f: fSoc });
    }
    const texto = (fija) => Object.entries(fija).map(([id, v]) => { const p = caso.palancas.find(q => q.id === id); return v > 0 ? p.sube : p.baja; });
    const pal = id => caso.palancas.find(q => q.id === id);
    const paquetes = CRIT.map(c => { const s = todos.filter(c.filtro).sort(c.f); return { c, mejor: s[0], top: s.slice(0, 8), empate: s.filter(x => c.f(x, s[0]) === 0) }; }).filter(p => p.mejor);
    const SIM = { mejora: '<b style="color:#276749">Mejora</b>', empeora: '<b style="color:#C05621">Empeora</b>', contrario: '<b style="color:#6B46C1">Señales contrarias</b>', nada: '<span style="color:#9FB3C8">Sin vía</span>', fijada: '<span style="color:#52606D">Fijada</span>' };
    frag.paquetesResumen = tabla(['Criterio', 'Medidas del paquete', 'Mejoran', 'De ellos, con vuelta en contra', 'Empeoran', 'Señales contrarias', 'Actores con algún perjuicio', 'Con evidencia media o alta: mejoran / empeoran / contrarias'],
      paquetes.map(p => [`<b>${p.c.id} · ${esc(p.c.nombre)}</b>`, '<ul style="margin:0;padding-left:14pt">' + texto(p.mejor.fija).map(t => `<li>${esc(t.charAt(0).toUpperCase() + t.slice(1))}</li>`).join('') + '</ul>', p.mejor.a.mej, p.mejor.a.reb, p.mejor.a.emp, p.mejor.a.con, p.mejor.a.gEmp, `${p.mejor.b.mej} / ${p.mejor.b.emp} / ${p.mejor.b.con}`]),
      ['12%', '36%', '7%', '9%', '7%', '8%', '9%', '12%']);
    for (const p of paquetes) {
      const m = p.mejor;
      const ciego = Object.keys(m.fija).flatMap(id => E.filter(e => e.de === id && (e.hip || e.nConf === 0)).map(e => [esc(nombre(id)), `→(${e.pol === '+' ? '+' : '−'}) ${esc(nombre(e.a))}`, e.hip ? 'Hipótesis del analista' : 'Conjetura: lo afirma un solo actor o está disputada sin datos', esc(e.mecanismo)]));
      frag['paq_' + p.c.id] =
        `<p><b>Regla de selección.</b> ${esc(p.c.regla)}</p>` +
        tabla(['Medida', 'Variable del mapa y sentido', 'Supuesto que añade'], Object.entries(m.fija).map(([id, v]) => [esc((v > 0 ? pal(id).sube : pal(id).baja).replace(/^./, c => c.toUpperCase())), `${v > 0 ? '▲' : '▼'} ${esc(nombre(id))}`, esc(pal(id).supuesto ? 'Supone ' + pal(id).supuesto + '.' : 'Ninguno: es una variable de decisión del mapa.')]), ['45%', '27%', '28%']) +
        tabla(['Actor', 'Resultado', 'Le conviene que…', 'Primera ronda', 'Efectos de vuelta (a favor · en contra)', 'Primera ronda, solo con confianza media o alta'],
          outs.map((o, i) => [i === 0 || outs[i - 1].gi !== o.gi ? `<b>${esc(caso.resultados[o.gi].dimension)}</b>` : '', esc(nombre(o.id)), o.mejor, SIM[m.a.det[i]], m.a.vuelta[i] ? `${m.a.vuelta[i][0]} · <span style="color:${m.a.vuelta[i][1] ? '#C05621' : '#52606D'}">${m.a.vuelta[i][1]}</span>` : '—', SIM[m.b.det[i]]]), ['18%', '28%', '11%', '14%', '15%', '14%']) +
        (ciego.length ? '<p><b>Lo que el cálculo no ve.</b> Efectos de estas medidas que solo constan como conjetura o como hipótesis y que, por tanto, no cuentan:</p>' + tabla(['Variable', 'Efecto no contado', 'Por qué no cuenta', 'Mecanismo'], ciego, ['20%', '25%', '20%', '35%']) : '<p><b>Lo que el cálculo no ve.</b> Ninguna relación sin apoyo sale de las variables de este paquete.</p>') +
        (p.empate.length > 1 ? `<p><b>Empate.</b> ${p.empate.length} paquetes obtienen exactamente la misma puntuación con esta regla y el mismo número de medidas; se muestra el primero en el orden de la lista de palancas. Los empatados: ${p.empate.slice(0, 12).map(x => esc(texto(x.fija).join(' + '))).join('; ')}${p.empate.length > 12 ? '; …' : ''}.</p>` : '<p><b>Empate.</b> Ninguno: es el único paquete con esa puntuación.</p>') +
        '<p><b>Paquetes que le siguen con el mismo criterio:</b></p>' +
        tabla(['Puesto', 'Medidas', 'Mejoran', 'Con vuelta en contra', 'Empeoran', 'Señales contrarias', 'Actores con perjuicio'], p.top.map((x, i) => [i + 1, esc(texto(x.fija).join('; ')), x.a.mej, x.a.reb, x.a.emp, x.a.con, x.a.gEmp]), ['6%', '52%', '8%', '9%', '8%', '9%', '8%']);
    }
    frag.palancasSueltas = tabla(['Medida aislada', 'Mejoran', 'De ellos, con vuelta en contra', 'Empeoran', 'Señales contrarias', 'Actores con perjuicio', 'Con evidencia media o alta: mejoran / empeoran / contrarias'],
      todos.filter(x => x.k === 1).sort(orden([x => x.a.gEmp, x => x.a.emp, x => x.a.con, x => -x.a.mej])).map(x => [esc(texto(x.fija)[0].replace(/^./, c => c.toUpperCase())), x.a.mej, x.a.reb, x.a.emp, x.a.con, x.a.gEmp, `${x.b.mej} / ${x.b.emp} / ${x.b.con}`]), ['40%', '8%', '10%', '8%', '9%', '10%', '15%']);
    if (SOC.size) {
      const nSoc = outs.filter(o => SOC.has(o.id)).length;
      const noSoc = outs.map((o, i) => [o, i]).filter(([o]) => !SOC.has(o.id));
      const fuera = m => noSoc.filter(([o, i]) => m.a.det[i] === 'empeora').map(([o]) => esc(nombre(o.id))).join('; ') || '<span style="color:#9FB3C8">ninguno</span>';
      const socTxt = (m, j) => outs.map((o, i) => [o, i]).filter(([o, i]) => SOC.has(o.id) && m.a.det[i] === j).map(([o]) => esc(nombre(o.id))).join('; ') || '<span style="color:#9FB3C8">ninguno</span>';
      frag.costeSocial = tabla(['Paquete', 'Medidas', 'Resultados sociales que mejoran', 'Que empeoran', 'Señales contrarias', 'Saldo', 'Saldo con evidencia media o alta', 'Empeora fuera del objetivo (se informa, no puntúa)'],
        paquetes.map(p => ['<b>' + p.c.id + ' · ' + esc(p.c.nombre) + '</b>', esc(texto(p.mejor.fija).join('; ')), p.mejor.a.sMej + ' de ' + nSoc, p.mejor.a.sEmp, p.mejor.a.sCon, '<b>' + (p.mejor.a.sBal > 0 ? '+' : '') + p.mejor.a.sBal + '</b>', (p.mejor.b.sBal > 0 ? '+' : '') + p.mejor.b.sBal + ' (' + p.mejor.b.sMej + ' / ' + p.mejor.b.sEmp + ')', fuera(p.mejor)]),
        ['13%', '27%', '9%', '8%', '8%', '6%', '11%', '18%']);
      const tes = paquetes.filter(p => ['P4', 'P4I', 'P4M'].includes(p.c.id));
      frag.tesis = tabla(['Familia de medidas', 'Mejor paquete de la familia', 'Mejoran', 'Empeoran', 'Señales contrarias', 'Saldo', 'Saldo con evidencia media o alta', 'Qué resultados sociales empeoran'],
        tes.map(p => ['<b>' + ({ P4: 'Cualquiera (se pueden mezclar)', P4I: 'Solo intervención', P4M: 'Solo mercado' })[p.c.id] + '</b>', esc(texto(p.mejor.fija).join('; ')), p.mejor.a.sMej, p.mejor.a.sEmp, p.mejor.a.sCon, '<b>' + (p.mejor.a.sBal > 0 ? '+' : '') + p.mejor.a.sBal + '</b>', (p.mejor.b.sBal > 0 ? '+' : '') + p.mejor.b.sBal, socTxt(p.mejor, 'empeora')]),
        ['14%', '34%', '7%', '7%', '8%', '6%', '9%', '15%']);
      frag.socialSueltas = tabla(['Medida aislada', 'Familia', 'Resultados sociales que mejoran', 'Que empeoran', 'Señales contrarias', 'Saldo', 'Saldo con evidencia media o alta'],
        todos.filter(x => x.k === 1).sort(orden([x => -x.a.sBal, x => x.a.sEmp, x => -x.b.sBal])).map(x => [esc(texto(x.fija)[0].replace(/^./, c => c.toUpperCase())), esc(familia(x)), x.a.sMej, x.a.sEmp, x.a.sCon, '<b>' + (x.a.sBal > 0 ? '+' : '') + x.a.sBal + '</b>', (x.b.sBal > 0 ? '+' : '') + x.b.sBal]), ['40%', '12%', '11%', '9%', '9%', '8%', '11%']);
    }
    if (SOC.size) {
      const socL = (m, j) => outs.map((o, i) => [o, i]).filter(([o, i]) => SOC.has(o.id) && m.det[i] === j).map(([o]) => esc(nombre(o.id))).join('; ') || '<span style="color:#9FB3C8">ninguno</span>';
      const sg = n => (n > 0 ? '+' : '') + n;
      const filasSoc = (caso.escenarios || []).map(sc => { const a = valora(sc.fija, 1), b = valora(sc.fija, 2); return { sc, a, b }; });
      frag.socialEscenarios = tabla(['Escenario', 'Resultados sociales que mejoran', 'Que empeoran', 'Señales contrarias', 'Saldo', 'Saldo con evidencia media o alta', 'Qué resultados sociales empeoran'],
        filasSoc.sort((p, q) => q.a.sBal - p.a.sBal || q.b.sBal - p.b.sBal).map(r => ['<b>' + esc(r.sc.id) + '</b> ' + esc(r.sc.nombre), r.a.sMej, r.a.sEmp, r.a.sCon, '<b>' + sg(r.a.sBal) + '</b>', sg(r.b.sBal) + ' (' + r.b.sMej + ' / ' + r.b.sEmp + ')', socL(r.a, 'empeora')]), ['30%', '10%', '8%', '8%', '6%', '11%', '27%']);
      resumen.socialEscenarios = Object.fromEntries(filasSoc.map(r => [r.sc.id, { mejoran: r.a.sMej, empeoran: r.a.sEmp, contrarias: r.a.sCon, saldo: r.a.sBal, saldoFirme: r.b.sBal, mejoranFirme: r.b.sMej, empeoranFirme: r.b.sEmp }]));
      resumen.resultadosSociales = SOC.size;
    }
    if (SOC.size) {
      // ---- Hipotesis a contrastar (el autor, 12/10/2026): cuentan en un nivel aparte, con fiabilidad «por confirmar»
      const sg = n => (n > 0 ? '+' : '') + n;
      const sgn = e => e.pol === '+' ? 1 : -1;
      const sinApoyo = E.filter(e => e.hip || (e.nConf === 0 && !e.contable));
      const adyTodo = {}; for (const e of E) (adyTodo[e.de] = adyTodo[e.de] || []).push({ a: e.a, s: sgn(e) });
      const clase = e => e.hip ? 'Hipótesis' : 'Conjetura';
      const sueltas = todos.filter(x => x.k === 1);
      const hS = sueltas.map(x => ({ x, h: valora(x.fija, adyTodo) }));
      frag.hipSueltas = tabla(['Medida aislada', 'Familia', 'Saldo con evidencia media o alta', 'Saldo con toda la evidencia', 'Saldo si además todas las hipótesis fueran ciertas', 'Cambio'],
        hS.sort((u, w) => w.h.sBal - u.h.sBal || w.x.a.sBal - u.x.a.sBal).map(r => [esc(texto(r.x.fija)[0].replace(/^./, c => c.toUpperCase())), esc(familia(r.x)), sg(r.x.b.sBal), sg(r.x.a.sBal), '<b>' + sg(r.h.sBal) + '</b>', r.h.sBal === r.x.a.sBal ? '—' : sg(r.h.sBal - r.x.a.sBal)]), ['40%', '11%', '12%', '12%', '15%', '10%']);
      const hE = (caso.escenarios || []).map(sc => ({ sc, a: valora(sc.fija, 1), b: valora(sc.fija, 2), h: valora(sc.fija, adyTodo) }));
      frag.hipEscenarios = tabla(['Escenario', 'Saldo con evidencia media o alta', 'Saldo con toda la evidencia', 'Saldo si además todas las hipótesis fueran ciertas'],
        hE.sort((u, w) => w.h.sBal - u.h.sBal).map(r => ['<b>' + esc(r.sc.id) + '</b> ' + esc(r.sc.nombre), sg(r.b.sBal), sg(r.a.sBal), '<b>' + sg(r.h.sBal) + '</b>']), ['52%', '16%', '16%', '16%']);
      // mejor paquete de cada familia si todas las hipotesis fueran ciertas
      const fH = orden([x => -x.h.sBal, x => x.h.sEmp, x => x.h.sCon, x => x.k]);
      const todosH = todos.map(x => ({ fija: x.fija, k: x.k, a: x.a, h: valora(x.fija, adyTodo) })).filter(x => x.h.sMej >= 1);
      const filasH = [['Cualquiera (se pueden mezclar)', null], ['Solo intervención', 'intervencion'], ['Solo mercado', 'mercado']].map(([n, fam]) => [n, todosH.filter(x => !fam || familia(x) === fam).sort(fH)[0]]).filter(r => r[1]);
      frag.hipTesis = tabla(['Familia de medidas', 'Mejor paquete si todas las hipótesis fueran ciertas', 'Mejoran', 'Empeoran', 'Señales contrarias', 'Saldo', 'Saldo del mismo paquete con la evidencia'],
        filasH.map(([n, x]) => ['<b>' + n + '</b>', esc(texto(x.fija).join('; ')), x.h.sMej, x.h.sEmp, x.h.sCon, '<b>' + sg(x.h.sBal) + '</b>', sg(x.a.sBal)]), ['15%', '43%', '8%', '8%', '9%', '7%', '10%']);
      // sensibilidad: cada hipotesis o conjetura, una a una, sobre el calculo base
      const A1 = adyN[0];
      const sens = sinApoyo.map(e => {
        const ady = Object.assign({}, A1); ady[e.de] = (A1[e.de] || []).concat({ a: e.a, s: sgn(e) });
        let n = 0, suma = 0, mayor = null;
        for (const x of sueltas) { const v = valora(x.fija, ady), d = v.sBal - x.a.sBal; if (d) { n++; suma += Math.abs(d); if (!mayor || Math.abs(d) > Math.abs(mayor.d)) mayor = { d, x, de: x.a.sBal, a: v.sBal }; } }
        return { e, n, suma, mayor };
      }).sort((u, w) => w.suma - u.suma || w.n - u.n);
      const conEfecto = sens.filter(s => s.n > 0);
      frag.hipSensibilidad = tabla(['Nº', 'Relación por confirmar', 'Clase', 'Medidas cuyo saldo cambiaría, de ' + sueltas.length, 'Cambio total', 'Mayor cambio'],
        conEfecto.slice(0, 20).map((s, i) => [i + 1, esc(nombre(s.e.de)) + ' →(' + (s.e.pol === '+' ? '+' : '−') + ') ' + esc(nombre(s.e.a)) + '<br><span style="color:#52606D">' + esc(s.e.mecanismo) + '</span>', clase(s.e), s.n, s.suma, esc(texto(s.mayor.x.fija)[0]) + ': de ' + sg(s.mayor.de) + ' a ' + sg(s.mayor.a)]), ['4%', '44%', '9%', '10%', '8%', '25%']);
      csv('hipotesis_a_contrastar.csv', ['Origen', 'Destino', 'Signo', 'Mecanismo', 'Clase', 'Medidas cuyo saldo cambiaría', 'Cambio total', 'Medida más afectada', 'Saldo antes', 'Saldo después', 'Qué se sabe'],
        sens.map(s => [nombre(s.e.de), nombre(s.e.a), s.e.pol, s.e.mecanismo, clase(s.e), s.n, s.suma, s.mayor ? texto(s.mayor.x.fija)[0] : '', s.mayor ? s.mayor.de : '', s.mayor ? s.mayor.a : '', s.e.contra || '']));
      resumen.hipotesisCalc = { total: sinApoyo.length, hipotesis: sinApoyo.filter(e => e.hip).length, conjeturas: sinApoyo.filter(e => !e.hip).length, conEfecto: conEfecto.length, sinEfecto: sens.length - conEfecto.length,
        paquetes: filasH.map(([n, x]) => ({ familia: n, medidas: texto(x.fija), saldo: x.h.sBal, saldoBase: x.a.sBal })),
        escenarios: Object.fromEntries(hE.map(r => [r.sc.id, { firme: r.b.sBal, apoyo: r.a.sBal, hipotesis: r.h.sBal }])),
        primeras: conEfecto.slice(0, 8).map(s => ({ de: nombre(s.e.de), a: nombre(s.e.a), signo: s.e.pol, clase: clase(s.e), medidas: s.n, cambio: s.suma })) };
    }
    if (SOC.size && caso.premisas) {
      const sg = n => (n > 0 ? '+' : '') + n;
      const socL = (m, j) => outs.map((o, i) => [o, i]).filter(([o, i]) => SOC.has(o.id) && m.det[i] === j).map(([o]) => esc(nombre(o.id))).join('; ') || '<span style="color:#9FB3C8">ninguno</span>';
      const fP = orden([x => -x.p.sBal, x => x.p.sEmp, x => x.p.sCon, x => x.p.sReb, x => x.k]);
      const todosP = todos.map(x => ({ fija: x.fija, k: x.k, a: x.a, p: valora(x.fija, 3) })).filter(x => x.p.sMej >= 1);
      const mejorP = fam => todosP.filter(x => !fam || familia(x) === fam).sort(fP)[0];
      const filasT = [['Cualquiera (se pueden mezclar)', null], ['Solo intervención', 'intervencion'], ['Solo mercado', 'mercado']].map(([n, fam]) => [n, mejorP(fam)]).filter(r => r[1]);
      frag.premisasLista = tabla(['Nº', 'Lo que sostiene el autor', 'Qué cambia en el cálculo', 'Lo que dice lo localizado'], caso.premisas.lista.map(p => [p.n, esc(p.dice), esc(p.cambia), esc(p.frente)]), ['4%', '30%', '28%', '38%']);
      frag.premisasTesis = tabla(['Familia de medidas', 'Mejor paquete si las premisas son ciertas', 'Mejoran', 'Empeoran', 'Señales contrarias', 'Saldo con premisas', 'Saldo del mismo paquete solo con evidencia', 'Qué resultados sociales empeoran'],
        filasT.map(([n, x]) => ['<b>' + n + '</b>', esc(texto(x.fija).join('; ')), x.p.sMej, x.p.sEmp, x.p.sCon, '<b>' + sg(x.p.sBal) + '</b>', sg(x.a.sBal), socL(x.p, 'empeora')]), ['13%', '33%', '7%', '7%', '8%', '8%', '9%', '15%']);
      const esc2 = (caso.escenarios || []).map(sc => ({ sc, a: valora(sc.fija, 1), p: valora(sc.fija, 3) }));
      frag.premisasEscenarios = tabla(['Escenario', 'Saldo solo con evidencia', 'Saldo si las premisas son ciertas', 'Mejoran / empeoran / contrarias con premisas', 'Qué empeora con premisas'],
        esc2.sort((u, w) => w.p.sBal - u.p.sBal || w.a.sBal - u.a.sBal).map(r => ['<b>' + esc(r.sc.id) + '</b> ' + esc(r.sc.nombre), sg(r.a.sBal), '<b>' + sg(r.p.sBal) + '</b>', r.p.sMej + ' / ' + r.p.sEmp + ' / ' + r.p.sCon, socL(r.p, 'empeora')]), ['34%', '10%', '11%', '13%', '32%']);
      frag.premisasSueltas = tabla(['Medida aislada', 'Familia', 'Saldo solo con evidencia', 'Saldo si las premisas son ciertas', 'Cambio'],
        todos.filter(x => x.k === 1).map(x => ({ x, p: valora(x.fija, 3) })).sort((u, w) => w.p.sBal - u.p.sBal || w.x.a.sBal - u.x.a.sBal).map(r => [esc(texto(r.x.fija)[0].replace(/^./, c => c.toUpperCase())), esc(familia(r.x)), sg(r.x.a.sBal), '<b>' + sg(r.p.sBal) + '</b>', r.p.sBal === r.x.a.sBal ? '—' : sg(r.p.sBal - r.x.a.sBal)]), ['46%', '14%', '13%', '15%', '12%']);
      resumen.premisas = { paquetes: filasT.map(([n, x]) => ({ familia: n, medidas: texto(x.fija), saldo: x.p.sBal, saldoBase: x.a.sBal })), escenarios: Object.fromEntries(esc2.map(r => [r.sc.id, { base: r.a.sBal, premisas: r.p.sBal, mejoran: r.p.sMej, empeoran: r.p.sEmp, contrarias: r.p.sCon }])) };
    }
    if (GP.length) {
      const sg = n => (n > 0 ? '+' : '') + String(n).replace('.', ',');
      const mil = n => n.toLocaleString('es-ES');
      const tot = GP.reduce((a, g) => a + g.personas, 0);
      frag.personasGrupos = tabla(['Grupo', 'Personas', 'Cómo se obtiene', 'Resultados que le atañen'], [
        ...GP.map(g => ['<b>' + esc(g.nombre) + '</b>', mil(g.personas), esc(g.calculo), g.resultados.map(id => esc(nombre(id))).join('; ')]),
        ['<b>Total</b>', '<b>' + mil(tot) + '</b>', '', '']], ['24%', '11%', '30%', '35%']);
      const celda = (v, i) => { const [gm, ge, gn] = v.pG[i]; return gm + ' mejoran y ' + ge + ' empeoran de ' + gn; };
      const fila = (rot, medidas, a, b) => [rot, medidas, ...GP.map((g, i) => celda(a, i)), '<b>' + sg(a.pIdx) + '</b>', sg(b.pIdx), sg(a.sBal)];
      const cab = ['', 'Medidas', ...GP.map(g => g.nombre), 'Índice por personas (−100 a +100)', 'Con evidencia media o alta', 'Saldo sin ponderar'];
      const anc = ['11%', '25%', '13%', '13%', '13%', '9%', '8%', '8%'];
      frag.personasPaquetes = tabla(cab, paquetes.map(p => fila('<b>' + p.c.id + ' · ' + esc(p.c.nombre) + '</b>', esc(texto(p.mejor.fija).join('; ')), p.mejor.a, p.mejor.b)), anc);
      const escP = (caso.escenarios || []).map(sc => ({ sc, a: valora(sc.fija, 1), b: valora(sc.fija, 2) })).sort((u, w) => w.a.pIdx - u.a.pIdx);
      frag.personasEscenarios = tabla(cab.map((x, i) => i === 1 ? 'Escenario' : x), escP.map(r => fila('<b>' + esc(r.sc.id) + '</b>', esc(r.sc.nombre), r.a, r.b)), anc);
      frag.personasSueltas = tabla(['Medida aislada', 'Familia', ...GP.map(g => g.nombre), 'Índice por personas', 'Con evidencia media o alta', 'Saldo sin ponderar'],
        todos.filter(x => x.k === 1).sort((u, w) => w.a.pIdx - u.a.pIdx || w.b.pIdx - u.b.pIdx).map(x => [esc(texto(x.fija)[0].replace(/^./, c => c.toUpperCase())), esc(familia(x)), ...GP.map((g, i) => x.a.pG[i][0] + ' / ' + x.a.pG[i][1]), '<b>' + sg(x.a.pIdx) + '</b>', sg(x.b.pIdx), sg(x.a.sBal)]), ['30%', '10%', '11%', '11%', '11%', '9%', '9%', '9%']);
      resumen.personas = { total: tot, grupos: GP.map(g => ({ id: g.id, nombre: g.nombre, personas: g.personas })),
        paquetes: Object.fromEntries(paquetes.map(p => [p.c.id, { indice: p.mejor.a.pIdx, firme: p.mejor.b.pIdx, medidas: texto(p.mejor.fija) }])),
        escenarios: Object.fromEntries(escP.map(r => [r.sc.id, { indice: r.a.pIdx, firme: r.b.pIdx }])) };
    }
    resumen.busqueda = { maxMedidas: MAXK, familias: Object.fromEntries(['intervencion', 'mercado', 'mixto', 'sin clasificar'].map(k => [k, todos.filter(x => familia(x) === k).length])), combinaciones: todos.length, palancas: caso.palancas.length, paquetes: paquetes.map(p => ({ criterio: p.c.id, nombre: p.c.nombre, medidas: texto(p.mejor.fija), fija: p.mejor.fija, todo: { mejoran: p.mejor.a.mej, conVueltaEnContra: p.mejor.a.reb, empeoran: p.mejor.a.emp, contrarias: p.mejor.a.con, actoresConPerjuicio: p.mejor.a.gEmp, actoresLimpios: p.mejor.a.limpios, actoresConMejora: p.mejor.a.gMej, social: { mejoran: p.mejor.a.sMej, empeoran: p.mejor.a.sEmp, contrarias: p.mejor.a.sCon, saldo: p.mejor.a.sBal, saldoFirme: p.mejor.b.sBal } }, empatados: p.empate.map(x => texto(x.fija)), firme: { mejoran: p.mejor.b.mej, empeoran: p.mejor.b.emp, contrarias: p.mejor.b.con } })) };
    paquetes.forEach(p => datosSim.escenarios.push({ id: p.c.id, nombre: `Paquete ${p.c.id}: ${p.c.nombre}`, fija: p.mejor.fija, lectura: 'Paquete elegido por cálculo entre todas las combinaciones de palancas. ' + p.c.regla, supuesto: Object.keys(p.mejor.fija).map(id => pal(id).supuesto).filter(Boolean).join('; ') || 'Ninguno.' }));
  }

  const htmlSim = fs.readFileSync(path.join(__dirname, 'plantilla_simulador.html'), 'utf8').replace('/*__DATOS__*/', 'const DATOS = ' + JSON.stringify(datosSim) + ';');
  fs.writeFileSync(path.join(dirCaso, 'Simulador_de_tendencias.html'), htmlSim, 'utf8');
}
frag.observado = tabla(['Variable', 'Último dato', 'Referencia', 'Variación', 'Tendencia calculada', 'Fuente y nota'],
  Object.entries(observado).map(([id, x]) => [`<b>${esc(nombre(id))}</b>`, `${x.valor.toLocaleString('es-ES')} ${esc(x.unidad)} (${esc(x.anio)})`, x.previo == null ? '—' : `${x.previo.toLocaleString('es-ES')} (${esc(x.anioPrevio)})`, x.varia == null ? '—' : (x.varia > 0 ? '+' : '') + (100 * x.varia).toFixed(1).replace('.', ',') + ' %', x.tend == null ? 'sin calcular' : x.tend > 0 ? '▲ sube' : x.tend < 0 ? '▼ baja' : '● estable', esc(x.fuente) + (x.nota ? '. ' + esc(x.nota) : '')]));
// ---- Tabla de datos de referencia (datos/inventario.js, opcional): cada cifra con su fecha, su fuente y su estado
const fInv = path.join(dirDatos, 'inventario.js');
if (fs.existsSync(fInv)) {
  const inv = require(fInv);
  const COL = { 'Contrastado': '#276749', 'Estimación oficial': '#2B6CB0', 'Calculado': '#6B46C1', 'Estudio académico': '#2C7A7B', 'De parte': '#B7791F', 'Sin verificar': '#C05621', 'No existe': '#9B2C2C' };
  for (const x of inv.filas) {
    if (!inv.estados.includes(x.estado)) { console.error('Inventario: estado desconocido en «' + x.concepto + '»'); process.exit(1); }
    if (!inv.bloques.some(b => b.id === x.b)) { console.error('Inventario: bloque desconocido en «' + x.concepto + '»'); process.exit(1); }
    if (x.estado === 'Calculado' && !x.nota) { console.error('Inventario: dato calculado sin operandos en «' + x.concepto + '»'); process.exit(1); }
    if (x.estado !== 'No existe' && (!x.fuente || !x.fecha)) { console.error('Inventario: falta fuente o fecha en «' + x.concepto + '»'); process.exit(1); }
  }
  const est = e => '<b style="color:' + COL[e] + '">' + esc(e) + '</b>';
  for (const b of inv.bloques)
    frag['inv_' + b.id] = tabla(['Dato', 'Valor', 'Unidad', 'Fecha', 'Ámbito', 'Fuente', 'Estado', 'Nota'],
      inv.filas.filter(x => x.b === b.id).map(x => [esc(x.concepto), '<b>' + esc(x.valor) + '</b>', esc(x.unidad), esc(x.fecha), esc(x.ambito), esc(x.fuente), est(x.estado), esc(x.nota)]),
      ['17%', '13%', '8%', '7%', '9%', '14%', '8%', '24%']);
  const cuenta = Object.fromEntries(inv.estados.map(e => [e, inv.filas.filter(x => x.estado === e).length]));
  frag.invResumen = tabla(['Estado', 'Qué significa', 'Datos'], [
    ['Contrastado', 'Leído en la fuente oficial primaria: censo, registro administrativo, encuesta oficial o norma.'],
    ['Estimación oficial', 'Cifra que un organismo oficial presenta como estimación o aproximación.'],
    ['Calculado', 'Operación propia sobre datos contrastados; los operandos van en la nota.'],
    ['Estudio académico', 'Artículo revisado por pares, tesis o documento de trabajo; se indica si es un estudio de caso o de otro país.'],
    ['De parte', 'Portal, consultora, patronal, sindicato o entidad con interés en el asunto.'],
    ['Sin verificar', 'Dato oficial o de prensa leído a través de un tercero, pendiente de comprobar en origen.'],
    ['No existe', 'Buscado y no localizado en ninguna fuente.']].map(r => [est(r[0]), esc(r[1]), cuenta[r[0]]]), ['18%', '70%', '12%']);
  frag.invNoExiste = '<ul>' + inv.filas.filter(x => x.estado === 'No existe').map(x => '<li><b>' + esc(x.concepto) + '.</b> ' + esc(x.fuente) + '.' + (x.nota ? ' ' + esc(x.nota) : '') + '</li>').join('') + '</ul>';
  csv('tabla_datos.csv', ['Bloque', 'Dato', 'Valor', 'Unidad', 'Fecha', 'Ámbito', 'Fuente', 'Estado', 'Nota'], inv.filas.map(x => [inv.bloques.find(b => b.id === x.b).nombre, x.concepto, x.valor, x.unidad, x.fecha, x.ambito, x.fuente, x.estado, x.nota]));
  resumen.inventario = { filas: inv.filas.length, porEstado: cuenta };
}
// ---- Indice de sostenibilidad social (datos/indice.js, opcional)
const fInd = path.join(dirDatos, 'indice.js');
if (fs.existsSync(fInd)) {
  const ind = require(fInd), n = ind.anios.length;
  const r1 = x => (Math.round(x * 10) / 10).toFixed(1).replace('.', ',');
  for (const s of ind.subindices) for (const c of s.componentes) if (c.valores.length !== n || c.valores.some(v => typeof v !== 'number') || !c.fuente) { console.error('Indice: serie incompleta o sin fuente en «' + c.nombre + '»'); process.exit(1); }
  if (Math.abs(ind.subindices.reduce((a, s) => a + s.peso, 0) - 1) > 1e-9) { console.error('Indice: los pesos no suman 1'); process.exit(1); }
  const base = c => c.valores.map(v => 100 * v / c.valores[0]);
  const sub = ind.subindices.map(s => { const b = s.componentes.map(base); return { s, comp: b, val: ind.anios.map((_, k) => b.reduce((a, x) => a + x[k], 0) / b.length) }; });
  const total = pesos => ind.anios.map((_, k) => sub.reduce((a, x, j) => a + pesos[j] * x.val[k], 0));
  const tot = total(ind.subindices.map(s => s.peso));
  const col = v => v > 105 ? '#C05621' : v < 95 ? '#276749' : '#52606D';
  const cel = v => '<b style="color:' + col(v) + '">' + r1(v) + '</b>';
  frag.indComponentes = tabla(['Subíndice', 'Componente', 'Fuente', ...ind.anios, 'Índice ' + ind.anios[n - 1] + ' (' + ind.anios[0] + ' = 100)'],
    sub.flatMap(x => x.s.componentes.map((c, j) => [j === 0 ? '<b>' + esc(x.s.id + '. ' + x.s.nombre) + '</b>' : '', esc(c.nombre), esc(c.fuente), ...c.valores.map(v => String(v).replace('.', ',')), cel(x.comp[j][n - 1])])),
    ['17%', '27%', '13%', '6%', '6%', '6%', '6%', '6%', '13%']);
  frag.indResumen = tabla(['', ...ind.anios], [
    ...sub.map(x => ['<b>' + esc(x.s.id + '. ' + x.s.nombre) + '</b>', ...x.val.map(cel)]),
    ['<b>Índice de sostenibilidad social</b> (media de los tres)', ...tot.map(cel)]], ['40%', '12%', '12%', '12%', '12%', '12%']);
  frag.indSensibilidad = tabla(['Ponderación', 'Pesos (I · II · III)', ...ind.anios], [
    ['Igual peso a los tres', ind.subindices.map(s => Math.round(s.peso * 100) + ' %').join(' · '), ...tot.map(cel)],
    ...ind.pesosAlternativos.map(p => [esc(p.nombre), p.pesos.map(w => Math.round(w * 100) + ' %').join(' · '), ...total(p.pesos).map(cel)])], ['28%', '22%', '10%', '10%', '10%', '10%', '10%']);
  resumen.indice = {};
  // Simulacion de pesos: (1) segun personas; (2) barrido de todas las ponderaciones posibles
  if (ind.pesosPersonas) {
    const totP = ind.pesosPersonas.reduce((a, p) => a + p.personas, 0), wP = ind.subindices.map(s => ind.pesosPersonas.find(p => p.subindice === s.id).personas / totP), vP = total(wP);
    frag.indPesosPersonas = tabla(['Subíndice', 'Personas a las que describe', 'Cómo se obtiene', 'Peso resultante'],
      ind.subindices.map((s, j) => { const p = ind.pesosPersonas.find(q => q.subindice === s.id); return ['<b>' + esc(s.id + '. ' + s.nombre) + '</b>', p.personas.toLocaleString('es-ES'), esc(p.calculo), r1(100 * wP[j]) + ' %']; }), ['30%', '16%', '42%', '12%']) +
      tabla(['', ...ind.anios], [['<b>Índice con pesos según personas</b>', ...vP.map(cel)]], ['40%', '12%', '12%', '12%', '12%', '12%']);
    resumen.indice.personas = { pesos: wP.map(w => Math.round(w * 1000) / 10), valores: vP.map(v => Math.round(v * 10) / 10), ultimo: r1(vP[n - 1]) };
  }
  if (ind.pasoBarrido) {
    const K = Math.round(1 / ind.pasoBarrido), res = [];
    for (let a = 0; a <= K; a++) for (let b = 0; b <= K - a; b++) { const w = [a / K, b / K, (K - a - b) / K]; res.push({ w, v: total(w)[n - 1] }); }
    const peor = res.filter(x => x.v > 105).length, igual = res.filter(x => x.v >= 95 && x.v <= 105).length, mejor = res.filter(x => x.v < 95).length;
    const min = res.reduce((a, x) => x.v < a.v ? x : a), max = res.reduce((a, x) => x.v > a.v ? x : a), pc = k => r1(100 * k / res.length) + ' %';
    const wt = w => w.map(x => Math.round(x * 100) + ' %').join(' · ');
    // peso minimo del subindice II a partir del cual el conjunto supera 100, con el resto repartido a partes iguales
    let umbral = null; for (let k = 0; k <= 100; k++) { const w2 = k / 100, w = [(1 - w2) / 2, w2, (1 - w2) / 2]; if (total(w)[n - 1] > 100) { umbral = k; break; } }
    frag.indBarrido = tabla(['Resultado del índice en ' + ind.anios[n - 1], 'Ponderaciones', 'Parte del total'], [
      ['<b style="color:#C05621">Empeora</b> (más de 105)', peor, pc(peor)], ['<b style="color:#52606D">Parecido</b> (entre 95 y 105)', igual, pc(igual)], ['<b style="color:#276749">Mejora</b> (menos de 95)', mejor, pc(mejor)],
      ['<b>Total de ponderaciones probadas</b>', res.length, '100,0 %']], ['50%', '25%', '25%']) +
      tabla(['', 'Pesos (I · II · III)', 'Índice ' + ind.anios[n - 1]], [['Valor más bajo posible', wt(min.w), cel(min.v)], ['Valor más alto posible', wt(max.w), cel(max.v)]], ['40%', '35%', '25%']);
    resumen.indice.barrido = { total: res.length, empeora: peor, parecido: igual, mejora: mejor, pctEmpeora: r1(100 * peor / res.length), pctParecido: r1(100 * igual / res.length), pctMejora: r1(100 * mejor / res.length), min: r1(min.v), max: r1(max.v), umbralII: umbral };
  }
  if (ind.edades) {
    frag.indEdades = tabla(ind.edades.cab, ind.edades.filas.map(f => f.map((x, j) => j === 0 ? '<b>' + esc(x) + '</b>' : esc(x))), ['12%', '16%', '12%', '12%', '12%', '12%', '12%', '12%']) + '<p class="pie">' + esc(ind.edades.nota) + '</p>' +
      tabla(['', '2015', '2024', 'Variación', 'Descontada la inflación'], ind.edades.salarios.map(f => f.map((x, j) => j === 0 ? '<b>' + esc(x) + '</b>' : esc(x))), ['40%', '15%', '15%', '15%', '15%']) + '<p class="pie">' + esc(ind.edades.notaSalarios) + '</p>';
  }
  const aP = [...new Set(ind.presiones.flatMap(p => Object.keys(p.valores)))].sort();
  frag.indPresiones = tabla(['Presión', 'Unidad', 'Fuente', ...aP], ind.presiones.map(p => [esc(p.nombre), esc(p.unidad), esc(p.fuente), ...aP.map(a => esc(p.valores[a] || '—'))]), ['24%', '14%', '17%', '15%', '15%', '15%']);
  const cd = ind.ciudades, orden2 = [...cd.filas].sort((a, b) => b.danio - a.danio);
  frag.indCiudades = tabla(['Ámbito', esc(cd.danio.nombre) + ' (' + cd.danio.anio + ')', esc(cd.presion.nombre) + ' (' + cd.presion.anio + ')'],
    orden2.map(x => ['<b>' + esc(x.ciudad) + '</b>', String(x.danio).replace('.', ',') + ' %', String(x.presion).replace('.', ',') + ' %']), ['30%', '40%', '30%']);
  csv('indice_sostenibilidad.csv', ['Subíndice', 'Componente', 'Fuente', ...ind.anios, ...ind.anios.map(a => 'Índice ' + a)],
    [...sub.flatMap(x => x.s.componentes.map((c, j) => [x.s.id + '. ' + x.s.nombre, c.nombre, c.fuente, ...c.valores, ...x.comp[j].map(v => Math.round(v * 10) / 10)])),
     ...sub.map(x => [x.s.id + '. ' + x.s.nombre, 'SUBÍNDICE', '', ...ind.anios.map(() => ''), ...x.val.map(v => Math.round(v * 10) / 10)]),
     ['', 'ÍNDICE', '', ...ind.anios.map(() => ''), ...tot.map(v => Math.round(v * 10) / 10)]]);
  Object.assign(resumen.indice, { anios: ind.anios, total: tot.map(v => Math.round(v * 10) / 10), subindices: Object.fromEntries(sub.map(x => [x.s.id, x.val.map(v => Math.round(v * 10) / 10)])),
    ultimo: r1(tot[n - 1]), ultimoI: r1(sub[0].val[n - 1]), ultimoII: r1(sub[1].val[n - 1]), ultimoIII: r1(sub[2].val[n - 1]),
    alternativas: ind.pesosAlternativos.map(p => ({ nombre: p.nombre, valores: total(p.pesos).map(v => Math.round(v * 10) / 10) })) });
}
// ---- Fuentes (datos/fuentes.js, opcional): de donde procede la informacion y hasta donde se leyo cada documento
const fFue = path.join(dirDatos, 'fuentes.js');
if (fs.existsSync(fFue)) {
  const fu = require(fFue);
  const LEC = { F: 'Fichero de datos descargado y procesado', C: 'Texto leído en las partes citadas', R: 'Solo resumen o ficha', T: 'Visto a través de un tercero' };
  const COLF = { F: '#276749', C: '#276749', R: '#B7791F', T: '#C05621' };
  for (const x of fu.lista) { if (!LEC[x.lectura]) { console.error('Fuentes: lectura desconocida en «' + x.ref.slice(0, 40) + '»'); process.exit(1); } if (!fu.grupos.some(g => g.id === x.g)) { console.error('Fuentes: grupo desconocido en «' + x.ref.slice(0, 40) + '»'); process.exit(1); } }
  const enlace = u => u ? '<span style="font-size:8pt;color:#1F5A8A">' + esc(u) + '</span>' : '<span style="color:#9FB3C8">sin enlace conservado</span>';
  for (const g of fu.grupos)
    frag['fue_' + g.id] = tabla(['Fuente', 'Para qué se ha usado', 'Cómo se leyó'], fu.lista.filter(x => x.g === g.id).map(x => [esc(x.ref) + '<br>' + enlace(x.url), esc(x.uso), '<b style="color:' + COLF[x.lectura] + '">' + LEC[x.lectura] + '</b>']), ['56%', '26%', '18%']);
  const cu = Object.fromEntries(Object.keys(LEC).map(k => [k, fu.lista.filter(x => x.lectura === k).length]));
  frag.fueResumen = tabla(['Cómo se leyó', 'Fuentes'], Object.keys(LEC).map(k => ['<b style="color:' + COLF[k] + '">' + LEC[k] + '</b>', cu[k]]), ['75%', '25%']);
  // declaraciones publicas de actores: salen de caso.js
  const act = caso.statements.filter(s => s.url).map(s => [esc(s.actor), esc(s.fecha), enlace(s.url)]);
  frag.fueActores = tabla(['Quién lo dice', 'Fecha', 'Dónde'], act, ['34%', '12%', '54%']);
  csv('fuentes.csv', ['Grupo', 'Fuente', 'Enlace', 'Para qué se ha usado', 'Cómo se leyó'], fu.lista.map(x => [fu.grupos.find(g => g.id === x.g).nombre, x.ref, x.url, x.uso, LEC[x.lectura]]));
  resumen.fuentes = { total: fu.lista.length, porLectura: cu, actores: act.length };
}
fs.writeFileSync(path.join(dirDatos, 'fragmentos.json'), JSON.stringify(frag), 'utf8');

resumen.arquetipos = arquetipos.map(a => ({ id: a.id, nombre: a.nombre, cumple: a.cumple, confianza: NIVELES[a.nConf] }));
fs.writeFileSync(path.join(dirDatos, 'resumen.json'), JSON.stringify(resumen, null, 2), 'utf8');

console.log(JSON.stringify(resumen, null, 2));
