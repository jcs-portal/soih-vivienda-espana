// SOIH - Caso: el sistema de la vivienda en Espana (2000-2025)
// Fuente unica del caso. Todo lo demas (CSV, mapa, tablas del documento) se genera con soih_engine.js.
// Recogida de posiciones y evidencia: 11/10/2026, modo documental.
'use strict';

// ---------------------------------------------------------------- Fuentes de las expresiones
const F = {
  F1: 'https://www.hosteltur.com/167760_pedro-sanchez-en-espana-sobran-airbnb-y-faltan-viviendas.html',
  F2: 'https://www.elespanol.com/invertia/observatorios/vivienda/20241014/isabel-rodriguez-defiende-ley-vivienda-afirma-cataluna-precio-alquiler-reducido/893410699_0.html',
  F3: 'https://www.ejeprime.com/residencial/suelo-elevada-fiscalidad-y-falta-de-mano-de-obra-impiden-construir-vivienda-asequible',
  F4: 'https://www.boe.es/buscar/act.php?id=BOE-A-2023-12203',
  F5: 'https://www.elnacional.cat/oneconomia/es/entrevista/leire-iglesias-vivienda-publica-debe-ser-todos-como-es-sanidad_1600292_102.html',
  F6: 'https://www.elsaltodiario.com/alquiler/61-viviendas-estan-manos-multipropietarios-personas-juridicas',
  F7: 'https://www.eldiario.es/madrid/politica/ayuso-culpa-ley-vivienda-gobierno-subida-precio-alquiler-vivienda-madrid_1_10624592.html',
  F8: 'https://theobjective.com/economia/2026-10-10/jorge-rodrigo-mercado-alquiler-muerto-gobierna-sanchez/',
  F9: 'https://www.infobae.com/espana/2024/10/08/illa-promete-50000-viviendas-publicas-en-cataluna-hasta-2030-con-1100-millones-de-inversion-anual/',
  F10: 'https://www.eldiario.es/catalunya/collboni-anuncia-eliminara-10-000-pisos-turisticos-barcelona-cuatro-anos_1_11467392.html',
  F11: 'https://www.eldiariodemadrid.es/articulo/vivienda/almeida-hiperregulacion-vivienda-codigo-tecnico-edificacion-oferta-madrid/20260708161712136676.html',
  F12: 'https://www.elespanol.com/malaga/malaga-ciudad/20260917/torre-sugiere-compradores-extranjeros-tensionan-vivienda-compensen-economicamente/1003744386118_0.html',
  F13: 'https://www.euskadi.eus/noticia/2025/donostia-san-sebastian-se-convierte-primera-capital-vasca-declarada-como-zona-mercado-residencial-tensionado/web01-ejeduki/es/',
  F14: 'https://www.bde.es/f/webbe/GAP/Secciones/SalaPrensa/IntervencionesPublicas/Gobernador/Arc/Fic/IIPP-2024-04-29-hdc-es-or.pdf',
  F15: 'https://www.telecinco.es/noticias/economia/20260320/fmi-receta-medidas-espana-afrontar-crisis-vivienda_18_018680166.html',
  F16: 'https://www.infobae.com/espana/2025/11/27/la-ocde-advierte-los-actuales-programas-de-vivienda-social-y-el-tope-al-alquiler-no-bastan-para-frenar-los-precios/',
  F17: 'https://www.euronews.com/my-europe/2025/11/28/eu-commissioner-housing-crisis-needs-holistic-approach',
  F18: 'https://www.eldiario.es/economia/madrid-estalla-crisis-vivienda-desobediencia-accion-directa-son-camino-seguir_1_13246131.html',
  F19: 'https://beteve.cat/economia/sindicat-llogateres-assenyalen-lloguers-temporada/',
  F20: 'https://directa.cat/la-patronal-immobiliaria-intenta-tombar-la-llei-de-regulacio-dels-lloguers-perque-funciona/',
  F21: 'https://www.eldiario.es/economia/miles-personas-salen-calle-espana-exigir-bajen-alquileres-vivienda-deje-negocio_1_12195344.html',
  F22: 'https://laenzina.es/bancos-y-fondos-buitre-mantienen-millones-de-viviendas-vacias-en-espana-para-subir-artificialmente-los-precios/',
  F23: 'https://kaosenlared.net/declaraciones-de-la-pah-ante-la-desaparicion-de-los-desahucios-de-la-agenda-politica/',
  F24: 'https://www.idealista.com/news/inmobiliario/vivienda/2026/10/07/917877-carolina-roca-los-inversores-han-dicho-stop-a-la-vivienda-de-alquiler-asequible-en',
  F25: 'https://economistas.es/cust_notas/05-de-marzo-de-2025-los-expertos-advierten-que-la-falta-de-suelo-la-carga-fiscal-y-la-inseguridad-juridica-dificultan-el-acceso-a-la-vivienda-y-proponen-reformar-la-ley-de-suelo-para-aumentar-la-o/',
  F26: 'https://www.prefieres.es/faltan-700-000-trabajadores-en-el-sector-de-la-construccion-alertan-desde-la-cnc/',
  F27: 'https://economia3.com/cnc-y-seopan-avisan-de-que-el-deficit-de-vivienda-tardaria-47-anos-en-resolverse/',
  F28: 'https://www.pressdigital.es/articulo/economia/2026-10-07/6043018-asval-critica-decreto-vivienda-penalice-propietarios-advierte-reducira-oferta',
  F29: 'https://www.ejeprime.com/mercado/la-incertidumbre-tributaria-en-las-socimi-frena-la-inversion-en-vivienda-en-2025',
  F30: 'https://www.idealista.com/news/inmobiliario/vivienda/2026/06/26/903671-montserrat-junyent-el-propietario-ahora-hace-un-casting-de-inquilinos',
  F31: 'https://www.infobae.com/america/agencias/2026/05/22/tres-anos-de-la-ley-de-vivienda-alquiler-un-31-mas-caro-y-una-caida-de-la-oferta-del-30-segun-idealista/',
  F32: 'https://www.xataka.com/magnet/maria-matos-fotocasa-mercado-alquiler-precio-ha-alcanzado-limite-capacidad-pago-inquilinos',
  F33: 'https://www.infobae.com/espana/agencias/2026/03/12/la-vivienda-nueva-se-enfoca-a-la-demanda-de-alto-nivel-y-no-a-paliar-escasez-segun-tinsa/',
  F34: 'https://www.tinsa.es/sala-de-prensa/notas-de-prensa/informe-vivienda-vacia-2023/',
  F35: 'https://elinmobiliariomesames.com/vivienda/el-precio-de-la-vivienda-nueva-crece-un-75-interanual-en-junio-segun-sociedad-de-tasacion/',
  F36: 'https://www.elespanol.com/invertia/empresas/banca/20240412/banca-cree-no-problema-oferta-credito-reunion-moncloa-sector-vivienda/847165387_0.html',
  F37: 'https://www.elindependiente.com/economia/2025/09/08/caixabank-avisa-de-una-nueva-subida-de-precios-de-la-vivienda-por-la-falta-de-oferta-y-la-presion-de-los-extranjeros/',
  F38: 'https://www.funcas.es/prensa/el-problema-de-la-vivienda-en-espana-requiere-medidas-que-incentiven-la-oferta/',
  F39: 'https://www.vilapress.cat/articulo/baix-llobregat/2024-04-15/4794246-ignacio-ezquiaga-no-hace-vivienda-proteccion-oficial-porque-ayuntamientos-no-quieren',
  F40: 'https://www.telecinco.es/noticias/economia/20240905/ignacio-ezquiaga-economista-precio-vivienda_18_013381708.html',
  F41: 'https://fedea.net/el-acceso-a-la-vivienda/',
  F42: 'https://www.elespanol.com/invertia/observatorios/vivienda/20240212/control-precios-ineficiente-mercado-alquiler-sobrerregulado-asegura-iee/832166866_0.html',
  F43: 'https://nadaesgratis.es/admin/los-efectos-de-la-limitacion-de-precios-de-los-alquileres-en-cataluna',
  F44: 'https://www.cope.es/programas/herrera-en-cope/noticias/jose-garcia-montalvo-experto-vivienda-hay-casos-rentable-subir-alquiler-sea-20-depende-tipo-marginal-paga-persona-20260115_3287101.html',
  F45: 'https://nadaesgratis.es/admin/el-impacto-de-airbnb-en-el-mercado-de-vivienda-de-barcelona',
  F46: 'https://www.elsaltodiario.com/vivienda/entrevista-jaime-palomera-vivienda-secuestro-alquileres-necesita-una-revolucion',
  F47: 'https://www.elnacional.cat/oneconomia/es/entrevista/javier-gil-vivienda-puede-costarle-elecciones-pedro-sanchez_1614126_102.html',
  F48: 'https://www.infobae.com/espana/2026/03/09/javier-gil-autor-de-generacion-inquilina-antes-tenia-casa-quien-se-esforzaba-para-comprarla-pero-hoy-importa-mucho-mas-la-capacidad-de-heredar-que-de-trabajar/',
  F49: 'https://www.publico.es/economia/manuel-gabarre-mentira-precio-vivienda-sea-cuestion-oferta-demanda.html',
  F50: 'https://observatoridesca.org/es/el-capital-no-discrimina/habitatge',
  F51: 'https://www.publico.es/politica/pp-agarra-mantra-okupacion-explicar-problema-vivienda-pese-datos-desmienten.html',
  F52: 'https://www.hosteltur.com/167914_airbnb-responde-a-sanchez-y-propone-un-nuevo-modelo-regulatorio.html',
  F53: 'https://www.elindependiente.com/economia/2022/11/22/exceltur-pide-al-gobierno-un-decreto-para-frenar-la-eclosion-descontrolada-de-viviendas-turisticas/',
  F54: 'https://alicanteplaza.es/alicanteplaza/espana/silvia-blasco-fevitur-nos-han-utilizado-algunos-como-chivo-expiatorio-es-facil-decir-que-somos-los-culpables-de-la-falta-de-vivienda',
  F55: 'https://www.cje.org/en/observatorio_2025/',
  F56: 'https://www.foessa.es/blog/ix-informe-foessa-advierte-proceso-inedito-fragmentacion-social-espana-se-contrae-clase-media/',
  F57: 'https://provivienda.org/informe-racismo-alquiler/',
  F58: 'https://theconversation.com/cada-vez-mas-solos-en-casa-el-auge-silencioso-de-los-hogares-unipersonales-267937',
  F59: 'https://www.infobae.com/america/agencias/2026/03/24/la-plataforma-de-afectados-por-la-ocupacion-lleva-al-pe-la-inaccion-ante-inquiokupas/',
  F60: 'https://www.pp.es/actualidad/articulos/el-pp-exige-a-sanchez-la-puesta-en-marcha-urgente-del-plan-de-vivienda-de-feijoo-para-enterrar-las-politicas-fracasadas-del-gobierno-la-situacion-es-insostenible/',
  F61: 'https://www.andaluciainformacion.es/articulo/elecciones-andalucia-17-mayo/abascal-mijas-vincula-problema-vivienda-aumento-invasion-migratoria/202605131808533386325.html',
  F62: 'https://publico.es/politica/sumar-piden-prohibir-compra-vivienda-especular-senalan-psoe-basta-parches.html',
  F63: 'https://www.democrata.es/economia/el-pnv-estudiara-en-detalle-los-decretos-de-vivienda-antes-de-fijar-su-voto-en-la-diputacion-permanente/',
  F64: 'https://www.vozpopuli.com/espana/politica/junts-responde-al-ordago-de-sanchez-con-su-propio-decreto-de-vivienda-y-le-emplaza-a-romper-el-pacto-con-sumar.html',
  F65: 'https://www.infobae.com/espana/agencias/2026/10/04/matute-bildu-dice-que-los-que-defienden-a-los-especuladores-estan-perdiendo-en-la-calle/',
  F66: 'https://www.diariodeteruel.es/teruel/casas-cerradas-o-para-turistas-lastran-en-los-pueblos-el-acceso-a-la-vivienda-residencial',
  F67: 'https://www.diariodeteruel.es/teruel/dar-salida-a-las-viviendas-rurales-vacias-es-la-clave-para-resolver-la-falta-de-alojamientos',
  F68: 'https://www.eldiario.es/economia/marta-vall-llossera-arquitecta-necesario-blindar-viviendas-protegidas-hay-dinero-publico_1_12654182.html',
  F69: 'https://www.elespanol.com/invertia/observatorios/vivienda/20260325/vivienda-industrializada-no-despega-pese-gran-apuesta-pedro-sanchez-combatir-crisis-habitacional/1003744181747_0.html',
  F70: 'https://www.bde.es/f/webbe/SES/Secciones/Publicaciones/PublicacionesAnuales/InformesAnuales/23/Fich/InfAnual_2023_Cap4.pdf',
  F71: 'https://www.bde.es/f/webbe/GAP/Secciones/SalaPrensa/IntervencionesPublicas/DirectoresGenerales/economia/Arc/IIPP-2024-11-18-gavilan-es-or.pdf',
  F72: 'https://www.bde.es/f/webbe/SES/Secciones/Publicaciones/PublicacionesAnuales/InformesAnuales/25/Fich/IIPP-2026-06-18-lopez-salido-es-or.pdf',
  F73: 'https://www.revistasice.com/index.php/ICE/article/view/7963',
  F74: 'https://www.bde.es/f/webbe/SES/Secciones/Publicaciones/PublicacionesAnuales/InformesAnuales/25/InfAnual_2025.pdf',
  F75: 'https://www.ohb.cat/wp-content/uploads/2024/07/O24010_LAB-Lloguer-Temporada_1T2019-2024.pdf',
  F76: 'https://www.cnmc.es/sites/default/files/6653020.pdf',
  F77: 'https://www.funcas.es/wp-content/uploads/Migracion/Articulos/FUNCAS_PEE/109art05.pdf',
  F78: 'https://www.ieemadrid.es/en/node/1729'
};

// ---------------------------------------------------------------- Tipos de actor y bloques de interes
// Bloque: R = prioriza regulacion y derecho a la vivienda; M = prioriza mercado y oferta;
//         I = institucional, tecnico o academico sin posicion de parte declarada.
// La triangulacion (P3) exige expresiones de al menos dos bloques distintos.
const tiposActor = {
  GOB: 'Gobierno central', TERR: 'Comunidades y ayuntamientos', INST: 'Banco de España y organismos internacionales',
  MOV: 'Inquilinos y movimientos de vivienda', PROM: 'Promotores y constructores', PROP: 'Propietarios, gestores y agentes',
  PORT: 'Portales y tasadoras', BANC: 'Banca y servicios de estudios', ECOM: 'Economistas pro-oferta', ECOC: 'Economistas críticos',
  ACAD: 'Académicos', TUR: 'Sector turístico', SOC: 'Jóvenes y tercer sector', PART: 'Partidos', RUR: 'Medio rural', TEC: 'Arquitectos y técnicos'
};

const statements = [];
let ns = 0;
// s(actor, tipo, bloque, fecha, literal, texto, afirma, fuente)
function s(actor, tipo, bloque, fecha, literal, texto, afirma, f) {
  ns++; const id = 'S' + String(ns).padStart(3, '0');
  statements.push({ id, actor, tipo, bloque, fecha, literal, texto, afirma, url: F[f] });
  return id;
}
const L = true, P = false;   // L = devuelta como cita literal; P = parafrasis
s('Pedro Sánchez, presidente del Gobierno', 'GOB', 'R', '2025-01-13', L, 'lo que sobran son Airbnb y faltan viviendas', 'Uso turístico de viviendas → menos vivienda residencial', 'F1');                                   // S001
s('Pedro Sánchez', 'GOB', 'R', '2024-10-14', L, 'la oferta es escasa y a menudo esa calidad es deplorable', 'Oferta escasa → jóvenes y familias no se emancipan', 'F2');                                                         // S002
s('Isabel Rodríguez, ministra de Vivienda', 'GOB', 'R', '2024-10-14', L, 'deficiencia que tiene nuestro país que es la construcción de un parque público de vivienda', 'Parque público insuficiente → sin alternativa asequible', 'F2'); // S003
s('Isabel Rodríguez', 'GOB', 'R', '2024-10-14', L, 'allí donde se esté aplicando la ley se esté reduciendo el precio del alquiler entorno 100 euros', 'Regulación de zonas tensionadas → baja el alquiler', 'F2');                 // S004
s('David Lucas, secretario de Estado de Vivienda', 'GOB', 'R', '2025-07-09', L, 'Las viviendas no son un negocio, son para vivir', 'Vivienda tratada como negocio → inaccesibilidad', 'F3');                                     // S005
s('Ley 12/2023, preámbulo', 'GOB', 'R', '2023-05-24', L, 'Dichos parques públicos, casi inexistentes en España si se comparan con la media de la Unión Europea', 'Ausencia de parque público → acceso inasequible', 'F4');     // S006
s('Ley 12/2023, preámbulo', 'GOB', 'R', '2023-05-24', L, 'han dejado de estar sujetas, en plazos relativamente cortos, a ningún tipo de límite de venta o alquiler', 'Descalificación de vivienda protegida → se pierde el parque asequible', 'F4'); // S007
s('Leire Iglesias, Casa 47 (antes SEPES)', 'GOB', 'R', 's/f (2025-26)', L, 'falso miedo que hay a la ocupación', 'Miedo a la ocupación → particulares retienen vivienda vacía', 'F5');                                           // S008
s('Leire Iglesias', 'GOB', 'R', 's/f (2025-26)', L, 'Los fondos han exprimido ya tanto la vivienda que dejan de querer utilizar esas viviendas que nosotros necesitamos', 'Extracción de rentas por fondos → vivienda inasequible; infrainversión pública histórica → parque público del 3-4 %', 'F5'); // S009
s('Ministerio de Consumo y CSIC', 'GOB', 'R', '2026-04-22', P, 'Alrededor del 61 % del alquiler está en manos de propietarios con dos o más viviendas alquiladas, personas jurídicas y parque público; solo el 4,9 % de la población cobra rentas de alquiler', 'Concentración de la propiedad → poder de mercado del arrendador', 'F6'); // S010
s('Isabel Díaz Ayuso, Comunidad de Madrid', 'TERR', 'M', '2023-10-24', L, 'prefiere no alquilarla y, por tanto, no la saca y baja la oferta y se disparan nuevamente los precios', 'Intervención de precios → retirada de oferta → subida', 'F7'); // S011
s('Jorge Rodrigo, consejero de Vivienda de Madrid', 'TERR', 'M', '2026-10-10', L, 'El problema de la vivienda se soluciona construyendo', 'Falta de construcción y de suelo, más inseguridad jurídica → escasez', 'F8');          // S012
s('Salvador Illa, Generalitat', 'TERR', 'R', '2024-10-08', P, 'Espiral de precios «intolerable» y falta de vivienda pública frente a la media europea', 'Déficit de vivienda pública → alquiler disparado', 'F9');                 // S013
s('Jaume Collboni, alcalde de Barcelona', 'TERR', 'R', '2024-06-21', L, 'Hemos decidido ir a fondo para que se conviertan en viviendas residenciales', 'Pisos turísticos → restan oferta residencial y encarecen', 'F10');         // S014
s('Damià Calvet, Junts (Barcelona)', 'TERR', 'M', '2024-06-21', L, 'Creer que todos estos pisos entrarán en usos residenciales no se corresponde con la realidad', 'Retirar licencias turísticas no aumenta la oferta residencial', 'F10'); // S015
s('José Luis Martínez-Almeida, alcalde de Madrid', 'TERR', 'M', '2026-07-08', L, 'la hiperregulación es un «impuesto a la vivienda»', 'Exigencias técnicas → coste de construcción → precio', 'F11');                            // S016
s('Francisco de la Torre, alcalde de Málaga', 'TERR', 'M', '2026-09-17', L, 'Los noruegos que tensionan y los suecos y los holandeses, que compensen económicamente', 'Compradores extranjeros de renta alta → la oferta se desplaza al segmento caro', 'F12'); // S017
s('Francisco de la Torre', 'TERR', 'M', '2026-09-17', L, 'no hay oferta y se premia no al que más lo necesita, sino a quienes tienen más renta', 'Zonas tensionadas → menos oferta y selección por renta', 'F12');                 // S018
s('Eneko Goia, alcalde de San Sebastián', 'TERR', 'I', '2025-05-14', L, 'un instrumento más para hacer frente al problema', 'La regulación ayuda pero no basta', 'F13');                                                         // S019
s('Denis Itxaso, consejero vasco de Vivienda', 'TERR', 'I', '2025-05-14', P, 'Suelo disponible limitado y gestión compleja', 'Escasez física de suelo → tensionamiento', 'F13');                                                 // S020
s('Banco de España (gobernador)', 'INST', 'I', '2024-04-29', L, 'Los flujos migratorios del exterior impulsan la demanda de vivienda residencial que tiende a concentrarse en las principales áreas urbanas', 'Inmigración y concentración urbana → demanda → precios', 'F14'); // S021
s('Banco de España', 'INST', 'I', '2024-04-29', L, 'La rigidez de oferta se debe a la reducida rehabilitación, la aparición de usos alternativos y las limitaciones a la producción de vivienda', 'Poca rehabilitación, usos alternativos, falta de mano de obra, costes y falta de suelo → oferta rígida', 'F14'); // S022
s('Banco de España', 'INST', 'I', '2024-04-29', L, 'un déficit actual de unas 375 mil y que alcanzará unas 600 mil viviendas en 2025', 'Creación de hogares mayor que la obra nueva → déficit', 'F14');                           // S023
s('Banco de España', 'INST', 'I', '2024-04-29', L, 'en un contexto de reducido peso del alquiler social y de los agentes profesionales', 'Poco alquiler social y pocos arrendadores profesionales → escasez de alquiler', 'F14');   // S024
s('Banco de España', 'INST', 'I', '2024-04-29', L, 'en parte explicados por su situación en el mercado laboral', 'Paro, parcialidad y salarios bajos de los jóvenes → no emancipación', 'F14');                                   // S025
s('Banco de España', 'INST', 'I', '2024-04-29', L, 'La demanda de vivienda también se ve impulsada por los no residentes', 'Compras de no residentes y alquiler turístico → demanda adicional', 'F14');                           // S026
s('Banco de España', 'INST', 'I', '2024-04-29', L, 'No se detectan señales de alerta en los estándares de concesión hipotecaria', 'El crédito no es causa del encarecimiento', 'F14');                                           // S027
s('FMI (Artículo IV)', 'INST', 'I', '2026-03-20', P, 'Demanda fuerte por población, inmigración neta y tipos bajos, junto a rigidez de la oferta', 'Demanda demográfica y financiera frente a oferta rígida → crisis', 'F15');       // S028
s('FMI', 'INST', 'I', '2026-03-20', L, 'deberían suspenderse tras su período inicial de tres años', 'Control de alquileres → menos oferta; relajación del crédito → riesgo', 'F15');                                              // S029
s('OCDE (Estudio Económico de España)', 'INST', 'I', '2025-11-27', P, 'Los topes, si se aplican de forma estricta y aislada, pueden reducir la oferta disponible (redacción de la agencia, no cita de la OCDE)', 'Topes → retirada o desvío a turístico', 'F16');                           // S030
s('OCDE', 'INST', 'I', '2025-11-27', P, 'Vivienda social en el 3 % del parque, déficit de 1,5 M de unidades, bloqueos administrativos', 'Falta de alquiler social y trabas administrativas → inasequibilidad', 'F16');              // S031
s('Dan Jørgensen, comisario europeo de Vivienda', 'INST', 'I', '2025-11-28', L, "There's a lot of speculation, and housing is considered by many investors as a commodity", 'Vivienda como activo de inversión → precios', 'F17'); // S032
s('Dan Jørgensen', 'INST', 'I', '2025-11-28', L, "it's not good if it actually feels like it's ruining the lives of the people who live in these cities", 'Alquiler de corta estancia → precios al alza en ciudades', 'F17');       // S033
s('Alicia del Río, Sindicato de Inquilinas de Madrid', 'MOV', 'R', '2026-05-24', L, 'Los rentistas, los que acaparan vivienda para especular y maximizar beneficios', 'Rentismo y acaparamiento → crisis', 'F18');                // S034
s('Rodrigo Polanco, manifestante', 'MOV', 'R', '2026-05-24', L, 'No viene de la nada, sino de la concentración en manos de fondos', 'Concentración en fondos → precios', 'F18');                                                 // S035
s('Enric Aragonès, Sindicat de Llogateres', 'MOV', 'R', '2024-10-08', L, "són contractes escombraria que ja vam avisar que servirien per esquivar la regulació de preus", 'La caída de contratos es desvío a temporada, no efecto de la regulación', 'F19'); // S036
s('Carme Arcarazo, Sindicat de Llogateres', 'MOV', 'R', '2021-09-29', L, "ha baixat molt més en els municipis on no s'ha regulat, un 7%, que allà on sí que preval la regulació, un 1%", 'La regulación no reduce la oferta', 'F20'); // S037
s('Carme Arcarazo', 'MOV', 'R', '2021-09-29', L, 'Els pocs que fa deu anys que inflen la bombolla dels lloguers i extorsionen famílies', 'Una minoría de arrendadores infla los precios en cada renovación', 'F20');               // S038
s('Enric Aragonès', 'MOV', 'R', '2025-04', L, 'Si dejamos de pagar, a los rentistas se les cae el negocio', 'El problema es de poder del arrendador, no de escasez', 'F21');                                                      // S039
s('Carla Pisano, Sindicato Socialista de Vivienda de Euskal Herria', 'MOV', 'R', '2025-04', L, 'financiar aún más el negocio inmobiliario', 'Las políticas públicas subvencionan al sector → agravan el problema', 'F21');          // S040
s('Paco Morote, PAH', 'MOV', 'R', '2021-06-09', L, 'Bancos y fondos buitre mantienen millones de viviendas vacías', 'Retención deliberada de vivienda vacía → precios altos; régimen fiscal de las socimis → acaparamiento', 'F22'); // S041
s('Juanjo Ramón, PAH', 'MOV', 'R', '2026-05-08', L, 'Mientras se negocian equilibrios parlamentarios, hay familias siendo desahuciadas hoy', 'Fin de la moratoria → desahucios', 'F23');                                         // S042
s('Jaime Fernández, gerente de Asprima', 'PROM', 'M', '2025-07-09', P, 'El factor suelo es el mayor de los problemas para iniciar una construcción; en el peor de los casos la tramitación alcanza hasta los 15 años', 'Plazos urbanísticos → falta de suelo finalista → poca obra', 'F3');       // S043
s('Carolina Roca, presidenta de Asprima', 'PROM', 'M', '2026-10-07', L, "los inversores han dicho 'stop' a invertir en 'real estate' en España, especialmente en lo que se refiere a la producción de vivienda asequible en alquiler", 'Inseguridad jurídica → huida de inversión → no se hace alquiler asequible', 'F24'); // S044
s('Carolina Roca', 'PROM', 'M', '2026-10-07', L, 'Los promotores no tenemos el capital necesario', 'Falta de capital propio del promotor → dependencia del inversor externo', 'F24');                                            // S045
s('Juan Casares, Concovi (cooperativas)', 'PROM', 'M', '2025-07-09', L, 'No se hace vivienda protegida porque no salen los números', 'Módulos de vivienda protegida por debajo de costes → no se promueve', 'F3');                 // S046
s('Juan Casares', 'PROM', 'M', '2025-07-09', L, 'una insoportable carga fiscal que ronda el 25%', 'Fiscalidad → precio final', 'F3');                                                                                           // S047
s('Xavier Vilajoana, APCE', 'PROM', 'M', '2025-03-05', P, 'Se produce por debajo de las necesidades, lo que aumenta el déficit y los precios', 'Infraproducción → déficit acumulado → precios', 'F25');                           // S048
s('Pedro Fernández Alén, CNC', 'PROM', 'M', '2025-01-21', L, 'cualquier política destinada a resolver el acuciante problema de la vivienda en España está destinada al fracaso si no se aborda la falta de mano de obra cualificada', 'Faltan trabajadores → no se puede construir', 'F26'); // S049
s('Pedro Fernández Alén', 'PROM', 'M', '2026-03-10', L, 'origen de todos los males', 'Bloqueo de la reforma de la Ley del Suelo → inseguridad del planeamiento', 'F27');                                                         // S050
s('Julián Núñez, Seopan', 'PROM', 'M', '2026-03-10', L, 'barrera administrativa', 'Contratación pública rígida → no se ejecuta vivienda pública', 'F27');                                                                       // S051
s('ASVAL (propietarios de vivienda en alquiler)', 'PROP', 'M', '2026-10-07', P, 'Las nuevas restricciones, prórrogas y límites sobre el alquiler pueden reducir aún más la oferta (redacción de la agencia)', 'Regulación y penalización del arrendador → retirada de oferta', 'F28'); // S052
s('Ana de Luis, asesora de socimis', 'PROP', 'M', '2025-04-10', P, 'La seguridad jurídica es crítica para la inversión extranjera', 'Anuncio de subir la tributación de las socimis → freno a la inversión en vivienda', 'F29');    // S053
s('Montserrat Junyent, Colegio API de Barcelona', 'PROP', 'M', '2026-06-26', L, 'El propietario ahora hace un casting de inquilinos', 'Regulación → menos oferta → selección extrema de inquilinos', 'F30');                      // S054
s('Montserrat Junyent', 'PROP', 'M', '2026-06-26', P, 'Al regularse el alquiler de temporada los anuncios desaparecieron, pero los pisos quedaron vacíos o se vendieron', 'Regular la temporada no aumenta el alquiler residencial', 'F30'); // S055
s('Francisco Iñareta, Idealista', 'PORT', 'M', '2026-05-22', L, 'a costa de drenar la ya entonces escasa oferta disponible', 'Topes → cae la oferta', 'F31');                                                                   // S056
s('Francisco Iñareta', 'PORT', 'M', '2026-05-22', L, 'accesible sólo a aquellas familias mejor posicionadas', 'Precio regulado con escasez → selección de los inquilinos más solventes', 'F31');                                  // S057
s('María Matos, Fotocasa', 'PORT', 'M', '2026-07-30', L, 'Si no resolvemos el déficit de mano de obra es imposible aliviar la tensión en los precios', 'Falta de mano de obra → no hay obra nueva', 'F32');                       // S058
s('María Matos', 'PORT', 'M', '2026-07-30', L, 'El precio ha alcanzado el límite de la capacidad de pago de los inquilinos', 'El techo de renta de los hogares frena ya las subidas', 'F32');                                    // S059
s('Tinsa (informe anual)', 'PORT', 'I', '2026-03-12', P, 'La obra nueva consolida su enfoque hacia un perfil de comprador de alto poder adquisitivo (redacción de la agencia sobre el informe)', 'Costes y escasez → se construye para rentas altas → la obra nueva no palia la escasez', 'F33');      // S060
s('Tinsa (informe de vivienda vacía)', 'PORT', 'I', '2023-09-20', L, 'Las mayores cuotas de vivienda vacía sobre el total de viviendas se dan en provincias del interior y noroeste peninsular', 'La vivienda vacía está donde no hay demanda', 'F34');                             // S061
s('Consuelo Villanueva, Sociedad de Tasación', 'PORT', 'I', '2025-06-30', L, 'la oferta de vivienda nueva, aunque muestra leves signos de reactivación, sigue siendo insuficiente', 'Sin suelo, poca protegida y poca mano de obra → stock reducido → precios', 'F35'); // S062
s('Alejandra Kindelán, AEB', 'BANC', 'M', '2024-04-12', L, 'hoy no hay ninguna restricción de oferta por la financiación', 'El crédito no es la causa; el problema es de oferta física', 'F36');                                 // S063
s('CaixaBank Research', 'BANC', 'M', '2025-09-05', P, 'Tipos más bajos, mejora de renta y creación de unos 180.000 hogares al año frente a una oferta corta; el déficit acumulado podría explicar hasta el 39 % de la subida de precios', 'Tipos bajos, demografía y extranjeros frente a oferta corta → precios', 'F37'); // S064
s('Funcas', 'BANC', 'I', '2024-09-09', L, 'la falta de suelo disponible para la edificación es uno de los principales problemas', 'Escasez de suelo y lentitud administrativa → producción insuficiente', 'F38');                  // S065
s('Funcas', 'BANC', 'I', '2024-09', P, 'Hay una demanda de vivienda como segunda residencia de al menos 60.000 viviendas por año; las ayudas a la demanda pueden inflar precios', 'Demanda vacacional y subsidios a la demanda → presión sin más oferta', 'F38'); // S066
s('Ignacio Ezquiaga, economista', 'BANC', 'I', '2024-04-15', L, 'No se hace Vivienda de Protección Oficial porque los ayuntamientos no quieren', 'Los ayuntamientos no generan suelo para vivienda protegida → no hay protegida', 'F39'); // S067
s('Ignacio Ezquiaga', 'BANC', 'I', '2024-09-05', L, 'Cada vez hay más terrenos urbanizables que no terminan de ejecutarse', 'El suelo existe pero no se desarrolla', 'F40');                                                     // S068
s('Ángel de la Fuente, Fedea', 'ECOM', 'M', '2025-03-05', P, 'La escasez tiene origen fundamentalmente de oferta y de una legislación que paraliza la construcción', 'Regulación urbanística → oferta insuficiente', 'F25');        // S069
s('Fedea y Consejo General de Economistas', 'ECOM', 'M', '2025-03-05', L, 'los propietarios han optado por retirar inmuebles del mercado', 'Topes al alquiler → retirada de oferta', 'F41');                                     // S070
s('Instituto de Estudios Económicos (CEOE)', 'ECOM', 'M', '2024-02-12', P, 'Control de precios «ineficiente»; afecta a cientos de miles de propietarios individuales', 'Sobrerregulación y control de precios → retirada de oferta', 'F42'); // S071
s('García-Montalvo, Monràs y Raya (EsadeEcPol)', 'ACAD', 'I', '2023-02-17', L, 'un descenso en la oferta de alquiler de alrededor del 10%', 'Tope catalán de 2020 → baja lo caro, sube lo barato, menos contratos', 'F43');         // S072
s('José García Montalvo, UPF', 'ACAD', 'I', '2026-01-15', L, 'El problema fundamental es un problema del riesgo percibido por los propietarios y la inestabilidad jurídica y legislativa', 'Riesgo percibido → no se alquila, ni con incentivos fiscales', 'F44'); // S073
s('Mariona Segú y Rodrigo Martínez-Mazza', 'ACAD', 'I', '2019-10-23', L, 'un aumento en los alquileres de un 1,9%', 'Airbnb → alquileres: efecto medio pequeño, local grande', 'F45');                                           // S074
s('Jaime Palomera, IDRA', 'ECOC', 'R', '2025-06-13', L, 'una parte muy importante de la oferta está siendo desviada', 'No falta oferta: se desvía a usos de inversión', 'F46');                                                  // S075
s('Javier Gil, CSIC', 'ECOC', 'R', '2026-03-22', L, 'Hay una política deliberada para que unas élites y fondos tengan beneficios', 'Regulación diseñada a favor del rentismo → precios; construir más no los baja', 'F47');        // S076
s('Javier Gil', 'ECOC', 'R', '2026-03-09', L, 'hoy importa mucho más la capacidad de heredar que de trabajar', 'La herencia decide el acceso → la vivienda reproduce desigualdad', 'F48');                                       // S077
s('Manuel Gabarre, Observatorio CODE', 'ECOC', 'R', '2022-06-06', L, 'Es mentira que el precio de la vivienda sea una cuestión de oferta y demanda', 'El precio lo fijan decisiones políticas: vivienda social, regulación, hipoteca y urbanismo', 'F49'); // S078
s('Observatori DESCA', 'ECOC', 'R', 's/f (vigente 2025)', L, 'la creciente desigualdad, la falta de una tasación progresiva suficiente, el exceso de capital mundial', 'Exceso de capital global y fiscalidad débil → vivienda como activo', 'F50'); // S079
s('Alejandra Jacinto, abogada (CAES)', 'ECOC', 'R', '2025', L, 'El problema no es la oferta, es de desvío fraudulento de la oferta', 'Desvío a temporada y turístico → falsa escasez; el miedo a la ocupación es inducido', 'F51'); // S080
s('Jaime Rodríguez de Santiago, Airbnb España', 'TUR', 'M', '2025-01', L, 'un enorme desequilibrio entre el crecimiento de hogares y la construcción de vivienda nueva', 'La causa es la falta de construcción, no las viviendas turísticas', 'F52'); // S081
s('Airbnb, con datos de Oxford Economics', 'TUR', 'M', '2025-01', P, 'Si todos los anuncios volvieran al mercado residencial, los precios bajarían menos del 0,4 % en Barcelona y del 0,3 % en Madrid', 'El alquiler turístico tiene un efecto marginal sobre los precios', 'F52'); // S082
s('Exceltur (patronal hotelera y turística)', 'TUR', 'M', '2022-11-22', L, 'deterioro de la convivencia de las comunidades de vecinos y la expulsión de sus residentes', 'Crecimiento de viviendas turísticas → encarece y expulsa residentes', 'F53'); // S083
s('Silvia Blasco, FEVITUR', 'TUR', 'M', '2025-06-07', L, 'Nos han utilizado, algunos, como chivo expiatorio', 'Las viviendas turísticas no son la causa; lo es la inmigración', 'F54');                                          // S084
s('Apartur (pisos turísticos de Barcelona)', 'TUR', 'M', '2024-06-21', L, 'una llamada a que toda la ciudad se llene de alojamientos turísticos ilegales', 'Prohibir licencias → oferta ilegal, no vivienda residencial', 'F10');   // S085
s('Andrea González Henry, Consejo de la Juventud', 'SOC', 'R', '2026-05-26', L, 'El acceso a la vivienda se ha convertido en el principal eje de desigualdad entre las personas jóvenes', 'El alquiler ronda el 99 % del salario joven → emanciparse empobrece', 'F55'); // S086
s('Raúl Flores, FOESSA/Cáritas', 'SOC', 'R', '2025-11-05', P, 'La vivienda reconfigura la estructura social y expulsa a uno de cada cuatro hogares de una vida digna', 'Alquiler frente a ingresos y empleo precario → exclusión; el alquiler como trampa de pobreza', 'F56'); // S087
s('Provivienda', 'SOC', 'R', '2025-03-25', L, 'La discriminación inmobiliaria promueve la exclusión residencial y la segregación urbana en España', 'Discriminación en agencias → la población migrante accede a menos oferta', 'F57'); // S088
s('Elisa Brey, socióloga', 'ACAD', 'I', '2025-12-18', L, 'El coste de la vivienda, que sube por encima de los ingresos desde hace varios años', 'El precio reprime la formación de hogares → demanda latente', 'F58');              // S089
s('Ricardo Bravo, Plataforma de Afectados por la Ocupación', 'PROP', 'M', '2026-03-24', P, 'La suspensión de desahucios deja colarse a «falsos vulnerables» y traslada al particular una obligación del Estado', 'Paralización de desahucios → inseguridad → retirada de pisos del alquiler', 'F59'); // S090
s('Partido Popular', 'PART', 'M', '2026-01-10', L, 'Si intervienes en el mercado del alquiler, la oferta se desploma y la inversión huye', 'Falta de oferta, agravada por el intervencionismo', 'F60');                           // S091
s('Cuca Gamarra, PP', 'PART', 'M', '2025', L, 'no la pone en el mercado por miedo', 'Miedo al impago y a la ocupación → vivienda retenida', 'F51');                                                                              // S092
s('Alberto Núñez Feijóo, PP', 'PART', 'M', '2025', L, 'la inquiokupación. Si no acabamos con eso, no habrá viviendas en alquiler', 'Impago tolerado → desaparece la oferta de alquiler', 'F51');                                 // S093
s('Santiago Abascal, Vox', 'PART', 'M', '2026-05-13', P, 'Vincula el problema al aumento de la inmigración sin oferta proporcional', 'Inmigración → demanda → escasez', 'F61');                                                  // S094
s('Podemos y Sumar', 'PART', 'R', '2024-10-14', P, 'El Gobierno no tiene intención de frenar la especulación; hay que intervenir el mercado', 'Compra especulativa → precios', 'F62');                                           // S095
s('PNV (Maribel Vaquero)', 'PART', 'M', '2026-10-05', L, 'defensa del pequeño propietario, bajo el principio de seguridad jurídica', 'Cargar la protección social sobre el propietario → retraimiento de la oferta', 'F63');       // S096
s('Junts', 'PART', 'M', '2026-10-02', P, 'La escasez de oferta es el principal problema y la protección del vulnerable debe pagarla la Administración', 'Escasez de oferta → precios; protección a cargo del propietario → retraimiento', 'F64'); // S097
s('EH Bildu (Oskar Matute)', 'PART', 'R', '2026-10-04', L, 'el negocio y la especulación de unos pocos', 'Especulación de una minoría → crisis', 'F65');                                                                        // S098
s('Cecilia Falo, asociación Reviviendo (Teruel)', 'RUR', 'I', '2026-10-08', L, 'Vendieron caras sus casas y ahora ven cómo no hay vivienda disponible para los trabajadores', 'Venta a segunda residencia y turismo → sin vivienda para quien trabaja en el pueblo', 'F66'); // S099
s('Daniel Úbeda, alcalde de Albarracín', 'RUR', 'I', '2026-10-08', L, 'cada uno con su propiedad hace lo que le da la gana, pero hay que regularlo porque genera problemas', 'Casas cerradas o turísticas → falta alquiler residencial rural', 'F66'); // S100
s('Diario de Teruel (síntesis de estudios)', 'RUR', 'I', '2023-09-24', L, 'sus propietarios fallecieron y la titularidad es múltiple al existir varios herederos', 'Herencias indivisas y mal estado → casas vacías que no salen al alquiler', 'F67'); // S101
s('Marta Vall-llossera, CSCAE', 'TEC', 'I', 's/f (2025)', L, 'Si no se hubieran descalificado las viviendas protegidas, hoy lo serían el 38% del total', 'Descalificación histórica → hoy no hay parque asequible', 'F68');        // S102
s('Marta Vall-llossera', 'TEC', 'I', 's/f (2025)', P, 'Hacen falta nuevos formatos de vivienda; el 58 % del parque se construyó sin normativa de eficiencia', 'Desajuste entre tipologías y hogares, y parque obsoleto → oferta útil menor que la nominal', 'F68'); // S103
s('Roberto Silguero, Somacyl', 'TEC', 'I', '2026-03-25', P, 'No hay suficientes fábricas y se tarda más en empezar que en construir', 'Falta de capacidad industrial y plazos de licencia → la industrialización no acelera la oferta', 'F69'); // S104

// ---------------------------------------------------------------- Clusters (dominios)
s('Banco de España, Informe Anual 2023', 'INST', 'I', '2024-04', L, 'como resultado de la mayor protección para los inquilinos más vulnerables, se eleva el riesgo de impago para los propietarios', 'Más protección del inquilino vulnerable → más riesgo para el propietario → menos oferta o más precio', 'F70');   // S105
s('Banco de España (director general de Economía)', 'INST', 'I', '2024-11-18', L, 'Evitar modificaciones periódicas de las normativas que afectan a las condiciones de los contratos de alquiler vigentes', 'Incertidumbre regulatoria → menos oferta de alquiler', 'F71');   // S106
s('Banco de España, presentación del Informe Anual 2025', 'INST', 'I', '2026-06-18', L, 'Las dificultades de comprar una vivienda desplazan la demanda al alquiler residencial', 'Comprar es inalcanzable → más demanda de alquiler', 'F72');   // S107
s('Cagigas y Beraza (ICE 942)', 'ACAD', 'I', '2026', L, 'obliga a muchos a permanecer de alquiler, aumentando la demanda de este régimen', 'No poder comprar → más demanda de alquiler', 'F73');   // S108
s('Cagigas y Beraza (ICE 942)', 'ACAD', 'I', '2026', L, 'reforzando una suerte de "trampa del alquiler"', 'Esfuerzo en el alquiler → no se puede ahorrar para comprar', 'F73');   // S109
s('Banco de España, Informe Anual 2025', 'INST', 'I', '2026-06', L, 'estarían reduciendo su capacidad de ahorro y su acumulación de activos', 'Esfuerzo en el alquiler → menos ahorro para comprar', 'F74');   // S110
s('Banco de España, Informe Anual 2025', 'INST', 'I', '2026-06', L, 'retrasarían la formación de hogares', 'Esfuerzo de alquiler que afrontarían los jóvenes → se retrasa la formación de hogares', 'F74');   // S111
s('Banco de España, Informe Anual 2025', 'INST', 'I', '2026-06', L, 'reducirían tanto la restricción de ahorro necesario como la restricción de renta', 'Donaciones familiares → acceso a la compra', 'F74');   // S112
s('Observatori Metropolità de l’Habitatge de Barcelona', 'INST', 'I', '2024-06', L, "coincidint amb l'anunci o aplicació de legislacions de control de rendes", 'Control de rentas → crece el alquiler de temporada', 'F75');   // S113
s('Banco de España, Informe Anual 2023', 'INST', 'I', '2024-04', L, 'un mayor desarrollo del mercado de seguros del alquiler de vivienda que ampliara su limitado alcance actual', 'Seguros de alquiler → menos riesgo para el propietario', 'F70');   // S114
s('CNMC, estudio sobre el mercado del suelo', 'INST', 'I', '2026-06-09', P, 'Los incentivos a retener suelo pueden intensificarse cuando se esperan subidas de precios', 'Expectativas alcistas → retención de suelo', 'F76');   // S115
s('CNMC, estudio sobre el mercado del suelo', 'INST', 'I', '2026-06-09', P, 'La nulidad de los planes y la dificultad de modificarlos pueden retrasar o bloquear desarrollos', 'Inestabilidad del planeamiento → plazos más largos', 'F76');   // S116
s('José García Montalvo', 'ACAD', 'I', '2006', L, 'el precio del suelo se fija en función del precio de la vivienda', 'Precio de la vivienda → precio del suelo', 'F77');   // S117
s('Banco de España, Informe Anual 2025', 'INST', 'I', '2026-06', P, 'La baja rentabilidad y el poco crédito del sector promotor limitan la producción de vivienda', 'Poca capacidad financiera del promotor → menos viviendas iniciadas', 'F74');   // S118
s('Banco de España, Informe Anual 2023', 'INST', 'I', '2024-04', L, 'la no actualización periódica del precio del módulo, en un contexto de aumento de los costes de producción, presiona a la baja la rentabilidad esperada de los inversores privados', 'Módulo sin actualizar y costes al alza → no se promueve vivienda protegida', 'F70');   // S119
s('Banco de España, Informe Anual 2025', 'INST', 'I', '2026-06', L, 'la complejidad del modelo de gobernanza institucional y la existencia de cuellos de botella en el sector público', 'Poca capacidad de ejecución → la inversión no se convierte en viviendas', 'F74');   // S120
s('Instituto de Estudios Económicos y REAF', 'ECOM', 'M', '2025-05-13', P, 'La carga fiscal puede suponer en los casos más extremos un sobrecoste de hasta el 25 % en la vivienda nueva', 'Fiscalidad → precio final', 'F78');   // S121

// Afirmaciones cotejadas con su fuente (verificacion del 13/10/2026). Las demas no se han podido cotejar.
const cotejadas = new Set([1, 2, 3, 4, 6, 7, 11, 14, 21, 22, 23, 24, 25, 26, 27, 36, 37, 38, 39, 41, 42, 44, 45, 49, 50, 56, 57, 61, 65, 67, 72, 73, 74, 86, 91, 93, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120].map(n => 'S' + String(n).padStart(3, '0')));
statements.forEach(x => { x.cotejada = cotejadas.has(x.id); });

const clusters = [
  { id: 'C01', nombre: 'Demografía y territorio', descripcion: 'Cuántos hogares se forman y dónde quieren vivir.' },
  { id: 'C02', nombre: 'Renta y empleo', descripcion: 'Con qué ingresos y patrimonio cuentan los hogares.' },
  { id: 'C03', nombre: 'Financiación e inversión', descripcion: 'Crédito, expectativas y demanda de vivienda como activo.' },
  { id: 'C04', nombre: 'Suelo y urbanismo', descripcion: 'Disponibilidad de suelo y reglas para transformarlo.' },
  { id: 'C05', nombre: 'Producción de vivienda', descripcion: 'Capacidad y rentabilidad de construir y rehabilitar.' },
  { id: 'C06', nombre: 'Parque y usos', descripcion: 'A qué se destina el parque existente.' },
  { id: 'C07', nombre: 'Mercado de alquiler', descripcion: 'Oferta, precio, riesgo y poder en el alquiler habitual.' },
  { id: 'C08', nombre: 'Mercado de compraventa', descripcion: 'Precio y demanda de compra.' },
  { id: 'C09', nombre: 'Vivienda pública y protegida', descripcion: 'Parque asequible fuera del mercado.' },
  { id: 'C10', nombre: 'Regulación y fiscalidad', descripcion: 'Variables que deciden las administraciones.' },
  { id: 'C11', nombre: 'Resultados sociales', descripcion: 'Los síntomas: lo que el sistema produce en la vida de los hogares.' },
  { id: 'C12', nombre: 'Política y percepción', descripcion: 'Cómo la presión social y el reparto de la propiedad condicionan las decisiones.' }
];

// ---------------------------------------------------------------- Variables
const variables = [];
// v(id, nombre, definicion, tipo, unidad, escala, indicador, fuente, cluster, extra)
function v(id, nombre, definicion, tipo, unidad, escala, indicador, fuente, cluster, extra) {
  variables.push(Object.assign({ id, nombre, definicion, tipo, unidad, escala, indicador, fuente, cluster, frontera: tipo === 'exogena' ? 'exogena' : 'endogena' }, extra || {}));
}
const NM = 'no medida';
// C01 Demografia y territorio
v('D01', 'Población residente', 'Personas que residen en España. Aumenta con nacimientos e inmigración.', 'stock', 'personas', 'país', 'Cifras de población', 'INE', 'C01');
v('D02', 'Saldo migratorio exterior', 'Entradas menos salidas de residentes desde y hacia el extranjero en un año.', 'flujo', 'personas/año', 'país', 'Estadística de migraciones', 'INE', 'C01');
v('D03', 'Creación neta de hogares', 'Hogares nuevos menos hogares que desaparecen en un año.', 'flujo', 'hogares/año', 'país', 'Encuesta Continua de Hogares; proyección de hogares', 'INE', 'C01');
v('D04', 'Tamaño medio del hogar', 'Personas por hogar. Si baja, la misma población necesita más viviendas.', 'exogena', 'personas/hogar', 'país', 'Encuesta Continua de Hogares', 'INE', 'C01');
v('D05', 'Concentración del empleo en grandes áreas urbanas', 'Proporción del empleo nuevo que se crea en las grandes áreas urbanas, costa e islas.', 'exogena', '% del empleo nuevo', 'área urbana', 'EPA por provincias; afiliación por municipios', 'INE; Seguridad Social', 'C01');
v('D07', 'Hogares latentes no formados', 'Personas en edad de emanciparse que querrían formar un hogar y no lo hacen por coste.', 'stock', 'personas', 'país', 'Proxy: jóvenes de 25 a 34 años que viven con sus padres', 'Eurostat; INE', 'C01');
v('D08', 'Población en municipios en declive', 'Personas que residen en municipios que pierden población de forma sostenida.', 'stock', 'personas', 'municipio', 'Padrón municipal', 'INE', 'C01');
// C02 Renta y empleo
v('R01', 'Renta disponible de los hogares', 'Ingresos netos anuales del hogar medio.', 'auxiliar', '€/hogar/año', 'país', 'Renta neta media por hogar (ECV)', 'INE', 'C02');
v('R02', 'Salario de los jóvenes', 'Ingreso salarial neto de las personas de 16 a 29 años ocupadas.', 'auxiliar', '€/año', 'país', 'Encuesta de Estructura Salarial; Observatorio de Emancipación', 'INE; CJE', 'C02');
v('R03', 'Crecimiento del empleo', 'Variación anual del número de ocupados.', 'exogena', 'ocupados/año', 'país', 'EPA', 'INE', 'C02');
v('R05', 'Estabilidad contractual de los jóvenes', 'Proporción de jóvenes ocupados con contrato indefinido.', 'exogena', '% de ocupados', 'país', 'EPA', 'INE', 'C02');
v('R04', 'Patrimonio familiar disponible para la compra', 'Ahorro, herencias y ayudas de la familia que un hogar puede aportar para comprar.', 'stock', '€', 'hogar', 'Proxy: Encuesta Financiera de las Familias', 'Banco de España', 'C02');
// C03 Financiacion e inversion
v('F01', 'Tipo de interés hipotecario', 'Coste del crédito para comprar vivienda. Depende sobre todo de la política del BCE.', 'exogena', '%', 'zona euro', 'Tipo medio de hipotecas nuevas; euríbor a 12 meses', 'Banco de España', 'C03');
v('F02', 'Crédito hipotecario nuevo', 'Importe de las hipotecas sobre vivienda concedidas en un año.', 'flujo', '€/año', 'país', 'Estadística de hipotecas', 'INE; Banco de España', 'C03');
v('F03', 'Exigencia de los criterios hipotecarios', 'Dureza de las condiciones que pide la banca para conceder una hipoteca.', 'decision', 'índice', 'país', 'Encuesta sobre Préstamos Bancarios; relación préstamo-valor', 'Banco de España', 'C03', { dueno: 'Entidades de crédito, dentro de los límites del Banco de España' });
v('F04', 'Expectativas de revalorización', 'Subida de precios que compradores e inversores esperan para los próximos años.', 'auxiliar', '% anual esperado', 'área urbana', 'Expectativa de subida a 12 meses (entre 4,4 % y 5,3 % en 2025)', 'Funcas; encuesta del BCE', 'C03');
v('F05', 'Demanda de compra como inversión', 'Compras de vivienda hechas para obtener renta o plusvalía, no para residir.', 'flujo', 'viviendas/año', 'área urbana', 'Proxy: compras sin hipoteca; compradores con más de una vivienda', 'Registradores; Notariado', 'C03');
v('F06', 'Compras de no residentes', 'Viviendas compradas en un año por personas que no residen en España.', 'flujo', 'viviendas/año', 'costa e islas', 'Estadística registral inmobiliaria', 'Registradores', 'C03');
v('F07', 'Capital institucional que promueve vivienda de alquiler', 'Capital de fondos, socimis, aseguradoras y otros inversores profesionales destinado a promover y gestionar vivienda nueva de alquiler.', 'stock', 'viviendas', 'país', 'Estimación de la consultora CBRE (unas 110.000 viviendas, cerca del 5 % de la oferta); Civio cuenta 178.000 de grandes caseros con fianza', 'CBRE (parte interesada); Civio', 'C03');
v('F08', 'Rentabilidad bruta del alquiler', 'Renta anual del alquiler dividida por el precio de compra.', 'auxiliar', '%', 'área urbana', 'Rentabilidad bruta por alquiler', 'Banco de España', 'C03');
v('F09', 'Liquidez global en busca de activos', 'Capital internacional que busca activos reales donde invertir.', 'exogena', '€', 'mundo', NM, '', 'C03');
// C04 Suelo y urbanismo
v('S01', 'Suelo finalista disponible', 'Suelo listo para edificar vivienda, con el planeamiento y la urbanización terminados.', 'stock', 'viviendas edificables', 'municipio', 'Viviendas pendientes en sectores con suelo urbanizado (489.186 en 2025)', 'Ministerio de Vivienda, Sectores Residenciales 2025', 'C04');
v('S02', 'Plazo de tramitación urbanística', 'Años que pasan desde que se inicia la transformación de un suelo hasta que se puede edificar.', 'auxiliar', 'años', 'municipio', NM + ' sobre una muestra amplia; el sector cita de 10 a 15 años con cuatro casos', '', 'C04');
v('S03', 'Suelo urbanizable sin desarrollar', 'Suelo clasificado para crecer que no se ha transformado.', 'stock', 'hectáreas', 'municipio', 'Sistema de Información Urbana', 'Ministerio de Vivienda', 'C04');
v('S04', 'Precio del suelo urbano', 'Precio medio de las transacciones de suelo urbano.', 'auxiliar', '€/m²', 'municipio', 'Estadística de precios del suelo urbano', 'Ministerio de Vivienda', 'C04');
v('S05', 'Suelo municipal destinado a vivienda protegida', 'Suelo que los ayuntamientos reservan o ceden para vivienda protegida.', 'decision', 'viviendas edificables/año', 'municipio', NM, '', 'C04', { dueno: 'Ayuntamientos' });
v('S06', 'Estabilidad del marco urbanístico', 'Grado en que un plan aprobado se mantiene sin anulaciones ni cambios de regla.', 'auxiliar', 'índice', 'país', NM + '; proxy: planes anulados por sentencia', '', 'C04');
// C05 Produccion de vivienda
v('P01', 'Viviendas iniciadas al año', 'Viviendas cuya construcción empieza en un año.', 'flujo', 'viviendas/año', 'país', 'Visados de obra nueva', 'Ministerio de Vivienda; Colegios de Aparejadores', 'C05');
v('P02', 'Viviendas terminadas al año', 'Viviendas cuya construcción acaba en un año.', 'flujo', 'viviendas/año', 'país', 'Certificados de fin de obra', 'Ministerio de Vivienda', 'C05');
v('P03', 'Coste de construcción', 'Coste de materiales y mano de obra por metro cuadrado edificado.', 'auxiliar', 'índice', 'país', 'Índice de costes de construcción', 'Ministerio de Transportes; INE', 'C05');
v('P04', 'Mano de obra disponible en construcción', 'Trabajadores cualificados que el sector puede emplear.', 'stock', 'ocupados', 'país', 'Ocupados en construcción (EPA)', 'INE', 'C05');
v('P05', 'Productividad de la construcción', 'Producción por hora trabajada en el sector.', 'auxiliar', 'índice', 'país', 'Contabilidad nacional', 'INE', 'C05');
v('P06', 'Exigencias técnicas de la edificación', 'Requisitos de calidad, eficiencia y seguridad que la norma impone a la obra nueva.', 'decision', 'índice', 'país', NM, '', 'C05', { dueno: 'Estado (Código Técnico de la Edificación)' });
v('P08', 'Viviendas rehabilitadas al año', 'Viviendas que se reforman en profundidad en un año.', 'flujo', 'viviendas/año', 'país', 'Visados de rehabilitación', 'Ministerio de Vivienda', 'C05');
v('P09', 'Capacidad financiera del sector promotor', 'Capital propio y financiación con que cuentan los promotores para iniciar obra.', 'stock', '€', 'país', NM, '', 'C05');
v('P10', 'Peso de la obra nueva dirigida a rentas altas', 'Proporción de la vivienda nueva cuyo precio solo alcanzan los hogares de mayor renta.', 'auxiliar', '% de la obra nueva', 'área urbana', 'Proxy: precio medio de obra nueva frente a renta del hogar', 'Tasadoras; INE', 'C05');
// C06 Parque y usos
v('Q03', 'Viviendas vacías en municipios con demanda', 'Viviendas sin uso situadas donde hay hogares buscando vivienda.', 'stock', 'viviendas', 'municipio', 'Censo de 2021 (consumo eléctrico), por tamaño de municipio', 'INE', 'C06');
v('Q04', 'Viviendas vacías en municipios sin demanda', 'Viviendas sin uso situadas en municipios que pierden población.', 'stock', 'viviendas', 'municipio', 'Censo de 2021', 'INE', 'C06');
v('Q05', 'Viviendas de uso turístico', 'Viviendas dedicadas al alquiler de corta estancia para visitantes.', 'stock', 'viviendas', 'municipio', 'Estadística experimental de viviendas turísticas', 'INE', 'C06');
v('Q06', 'Viviendas en alquiler no habitual', 'Viviendas alquiladas por temporada o por habitaciones, fuera de la regulación de la vivienda habitual.', 'stock', 'viviendas', 'municipio', 'Proxy: cuota en portales; fianzas de temporada', 'Portales; Incasòl', 'C06');
v('Q07', 'Viviendas de segunda residencia', 'Viviendas usadas solo parte del año por sus propietarios.', 'stock', 'viviendas', 'municipio', 'Censo de 2021', 'INE', 'C06');
v('Q11', 'Precio del alojamiento turístico', 'Lo que paga un visitante por noche de alojamiento.', 'auxiliar', '€/noche', 'municipio', 'Tarifa media diaria hotelera (127,7 € en 2025)', 'INE, Coyuntura Turística Hotelera', 'C06');
v('Q08', 'Déficit acumulado de viviendas', 'Hogares creados menos viviendas terminadas, acumulado desde 2021.', 'stock', 'viviendas', 'país', 'Estimación del Banco de España', 'Banco de España', 'C06');
v('Q09', 'Adecuación del parque a los hogares', 'Grado en que el tamaño, el estado y la tipología de las viviendas existentes sirven a los hogares actuales.', 'auxiliar', 'índice', 'país', NM + '; proxy: antigüedad y eficiencia del parque', '', 'C06');
// C07 Mercado de alquiler
v('A01', 'Oferta de alquiler habitual', 'Viviendas disponibles o alquiladas como residencia habitual a precio de mercado.', 'stock', 'viviendas', 'municipio', 'Proxy: fianzas depositadas; anuncios en portales', 'Comunidades autónomas; portales', 'C07');
v('A02', 'Precio del alquiler', 'Renta mensual de los contratos de vivienda habitual.', 'auxiliar', '€/m²/mes', 'municipio', 'Índice de Precios de Vivienda en Alquiler; portales', 'INE; portales', 'C07');
v('A03', 'Demanda de alquiler habitual', 'Hogares que buscan una vivienda de alquiler para residir.', 'auxiliar', 'hogares', 'municipio', 'Proxy: contactos por anuncio', 'Portales', 'C07');
v('A04', 'Riesgo percibido por el arrendador', 'Probabilidad que el propietario atribuye a no cobrar o a no recuperar su vivienda.', 'auxiliar', 'índice', 'país', 'Proxy: encuestas a propietarios', 'OCU', 'C07');
v('A05', 'Duración de los desahucios', 'Meses que tarda un propietario en recuperar la vivienda por vía judicial.', 'auxiliar', 'meses', 'partido judicial', 'Estadística judicial', 'CGPJ', 'C07');
v('A06', 'Impagos del alquiler', 'Contratos en los que el inquilino deja de pagar, en un año.', 'flujo', 'casos/año', 'país', 'Proxy: lanzamientos por impago de alquiler', 'CGPJ', 'C07');
v('A07', 'Ocupaciones ilegales de vivienda', 'Viviendas ocupadas sin título, en un año.', 'flujo', 'casos/año', 'país', 'Denuncias por usurpación y allanamiento', 'Ministerio del Interior', 'C07');
v('A08', 'Concentración de la propiedad del alquiler', 'Proporción de la oferta de alquiler en manos de arrendadores con varias viviendas.', 'auxiliar', '% de la oferta', 'área urbana', 'Tres mediciones que no coinciden: 52,8 % entre particulares con dos o más viviendas; un máximo del 7 % con más de diez', 'Consumo y CSIC; Banco de España', 'C07');
v('A09', 'Exigencia en la selección de inquilinos', 'Requisitos de renta, garantías y perfil que el arrendador pide para alquilar.', 'auxiliar', 'índice', 'municipio', NM + '; proxy: contactos por anuncio', 'Portales', 'C07');
v('A11', 'Discriminación en el acceso al alquiler', 'Proporción de la oferta a la que no acceden personas por su origen u otra condición.', 'auxiliar', '% de la oferta', 'área urbana', 'Pruebas de discriminación en agencias', 'Provivienda', 'C07');
// C08 Mercado de compraventa
v('B01', 'Precio de compra de la vivienda', 'Precio por metro cuadrado de las viviendas vendidas.', 'auxiliar', '€/m²', 'municipio', 'Índice de Precios de Vivienda; valor tasado', 'INE; Ministerio de Vivienda', 'C08');
v('B03', 'Demanda de compra para residir', 'Hogares que compran para vivir en la vivienda.', 'flujo', 'viviendas/año', 'municipio', 'Proxy: hipotecas sobre vivienda', 'INE', 'C08');
v('B04', 'Ahorro inicial exigido para comprar', 'Entrada y gastos que el comprador debe aportar de su bolsillo.', 'auxiliar', '€', 'municipio', 'Calculado a partir del precio de compra', 'Calculado', 'C08');
// C09 Vivienda publica y protegida
v('G01', 'Parque de alquiler social', 'Viviendas de titularidad pública o protegida alquiladas por debajo del mercado.', 'stock', 'viviendas', 'país', 'Peso del alquiler social sobre el parque', 'Ministerio de Vivienda; OCDE', 'C09');
v('G02', 'Viviendas protegidas calificadas al año', 'Viviendas que obtienen la calificación definitiva de protegidas en un año.', 'flujo', 'viviendas/año', 'país', 'Calificaciones definitivas', 'Ministerio de Vivienda', 'C09');
v('G03', 'Descalificación de vivienda protegida', 'Viviendas protegidas que pasan a ser libres en un año al vencer su régimen.', 'flujo', 'viviendas/año', 'país', NM + ' de forma sistemática', '', 'C09');
v('G04', 'Inversión pública en vivienda', 'Gasto público anual en promover y adquirir vivienda.', 'decision', '% del PIB', 'país', 'Gasto público en promoción de vivienda (0,2 % del PIB en 2024)', 'Eurostat, COFOG', 'C09', { dueno: 'Estado, comunidades autónomas y ayuntamientos' });
v('G05', 'Rentabilidad de promover vivienda protegida', 'Diferencia entre el precio máximo de venta o renta fijado por la norma y el coste de construir.', 'auxiliar', '% de margen', 'comunidad autónoma', NM, '', 'C09');
v('G06', 'Capacidad de ejecución de la Administración', 'Viviendas que las administraciones son capaces de licitar y terminar con su presupuesto.', 'auxiliar', '% ejecutado', 'país', 'Proxy: fondos europeos de rehabilitación formalizados (54 % a finales de 2025)', 'AIReF, vía Banco de España', 'C09');
// C10 Regulacion y fiscalidad
v('L01', 'Intensidad de la regulación del precio del alquiler', 'Alcance y dureza de los topes al precio del alquiler habitual.', 'decision', 'municipios declarados', 'municipio', 'Zonas de mercado residencial tensionado declaradas', 'Ministerio de Vivienda', 'C10', { dueno: 'Estado y comunidades autónomas' });
v('L02', 'Protección legal del inquilino', 'Duración mínima de los contratos y límites al desahucio.', 'decision', 'índice', 'país', NM, '', 'C10', { dueno: 'Estado' });
v('L03', 'Restricción al alquiler turístico', 'Límites al número y a la localización de las viviendas turísticas.', 'decision', 'índice', 'municipio', NM + '; proxy: licencias vigentes', '', 'C10', { dueno: 'Ayuntamientos y comunidades autónomas' });
v('L04', 'Incentivos fiscales al arrendador', 'Reducción de impuestos por alquilar como vivienda habitual.', 'decision', '% de reducción en IRPF', 'país', 'Normativa del IRPF', 'Agencia Tributaria', 'C10', { dueno: 'Estado' });
v('L05', 'Ayudas públicas a la demanda', 'Subvenciones y avales a inquilinos y compradores.', 'decision', '€/año', 'país', 'Presupuesto del bono joven y de los avales', 'Ministerio de Vivienda; ICO', 'C10', { dueno: 'Estado y comunidades autónomas' });
v('L06', 'Carga fiscal sobre la vivienda nueva', 'Impuestos y tasas que soporta una vivienda desde el suelo hasta la venta.', 'decision', '% del precio', 'país', NM + ' oficialmente; el sector cita cerca del 25 %', '', 'C10', { dueno: 'Estado, comunidades autónomas y ayuntamientos' });
v('L07', 'Ventajas fiscales de los vehículos de inversión', 'Trato fiscal favorable a socimis y fondos que invierten en vivienda.', 'decision', 'tipo efectivo', 'país', 'Normativa del impuesto de sociedades', 'Agencia Tributaria', 'C10', { dueno: 'Estado' });
v('L08', 'Recargo fiscal a la vivienda vacía', 'Recargo en el IBI u otros impuestos a las viviendas desocupadas.', 'decision', '% de recargo', 'municipio', 'Ordenanzas fiscales', 'Ayuntamientos', 'C10', { dueno: 'Ayuntamientos' });
v('L09', 'Regulación del alquiler de temporada', 'Límites al uso de contratos de temporada o por habitaciones.', 'decision', 'índice', 'comunidad autónoma', NM, '', 'C10', { dueno: 'Estado y comunidades autónomas' });
v('L13', 'Garantía pública de cobro al arrendador', 'Programas en que la Administración paga o asegura la renta al propietario que cede o alquila su vivienda.', 'decision', 'viviendas acogidas', 'comunidad autónoma', 'Viviendas en programas de cesión (Bizigune: 7.375 en 2024)', 'Gobierno Vasco; Generalitat; Nasuvinsa', 'C10', { dueno: 'Estado y comunidades autónomas' });
v('L10', 'Frecuencia de cambios normativos', 'Número de cambios de regla relevantes para arrendadores e inversores por legislatura.', 'auxiliar', 'cambios/año', 'país', NM + '; proxy: normas estatales y autonómicas de vivienda', '', 'C10');
// C11 Resultados sociales (sintomas)
v('O01', 'Esfuerzo de los hogares para pagar el alquiler', 'Parte de la renta del hogar que se va en el alquiler.', 'sintoma', '% de la renta', 'hogar', 'Sobrecarga por coste de vivienda de inquilinos a precio de mercado', 'Eurostat; INE', 'C11');
v('O02', 'Esfuerzo de los hogares para comprar', 'Años de renta o parte de la renta que exige comprar una vivienda.', 'sintoma', 'años de renta; % de la renta', 'hogar', 'Precio sobre renta bruta disponible; esfuerzo teórico anual', 'Banco de España', 'C11');
v('O03', 'Edad de emancipación', 'Edad media a la que los jóvenes dejan el hogar familiar.', 'sintoma', 'años', 'país', 'Edad media de emancipación', 'Eurostat', 'C11');
v('O04', 'Exclusión residencial', 'Hogares sin vivienda adecuada y estable: desahucios, hacinamiento, infravivienda, sinhogarismo.', 'sintoma', 'hogares', 'país', 'Informe FOESSA; lanzamientos', 'FOESSA; CGPJ', 'C11');
v('O05', 'Brecha de riqueza entre propietarios e inquilinos', 'Diferencia de patrimonio entre hogares con vivienda en propiedad y hogares sin ella.', 'sintoma', 'ratio', 'país', 'Encuesta Financiera de las Familias', 'Banco de España', 'C11');
v('O06', 'Natalidad', 'Nacimientos por mujer.', 'auxiliar', 'hijos por mujer', 'país', 'Indicador coyuntural de fecundidad', 'INE', 'C11');
v('O07', 'Movilidad laboral hacia áreas con empleo', 'Trabajadores que se trasladan a vivir donde hay empleo.', 'auxiliar', 'personas/año', 'país', 'Proxy: variaciones residenciales', 'INE', 'C11');
v('O08', 'Desplazamiento de residentes de los centros urbanos', 'Hogares que dejan un barrio céntrico por coste o por cambio de uso de las viviendas.', 'auxiliar', 'hogares/año', 'barrio', NM + '; proxy: variación de empadronados por barrio', 'Ayuntamientos', 'C11');
// C12 Politica y percepcion
v('M01', 'Presión social por la vivienda', 'Peso de la vivienda entre las preocupaciones ciudadanas y movilización en la calle.', 'auxiliar', '% que la cita como problema', 'país', 'Barómetro', 'CIS', 'C12');
v('M02', 'Polarización del diagnóstico político', 'Distancia entre las explicaciones del problema que defienden los bloques políticos.', 'auxiliar', 'índice', 'país', NM, '', 'C12');
v('M03', 'Proporción de hogares propietarios', 'Parte de los hogares que posee la vivienda en que reside.', 'stock', '% de hogares', 'país', 'Régimen de tenencia (ECV)', 'INE', 'C12');

// ---------------------------------------------------------------- Relaciones
// REGLAS DE REGISTRO (revision del 12/10/2026, a peticion de JC: «elimina las invenciones»)
//  1. Una afirmacion se enlaza a una relacion solo si afirma ESE vinculo: mismo origen, mismo destino, mismo sentido.
//  2. El nivel de datos (D1 o superior) exige una fuente localizada, escrita en «evidencia». Nada de memoria.
//  3. La evidencia de otro pais cuenta como D1 (compatible) y se marca «Referencia de otro país».
//  4. Una relacion sin afirmacion y sin fuente es una HIPOTESIS DEL ANALISTA: se conserva aqui marcada con H(),
//     no entra en ningun calculo y los documentos la listan aparte.
//  5. Las identidades contables (una variable se define a partir de otra) se marcan como tales.
// Segunda revision (13/10/2026): incorporadas seis busquedas de evidencia y una verificacion de los veinte
// estudios principales contra su texto. Cuando la cifra se ha leido en el documento original se dice
// «leído en la fuente»; si no, se indica de donde sale.
const edges = [];
let ne = 0;
// e(de, a, pol, mecanismo, retardo, D, statements, evidencia, contra, extra)
function e(de, a, pol, mecanismo, retardo, D, st, evidencia, contra, extra) {
  ne++;
  edges.push(Object.assign({ id: 'E' + String(ne).padStart(3, '0'), de, a, pol, mecanismo, retardo, D, statements: st || [], evidencia: evidencia || '', contra: contra || '' }, extra || {}));
}
// H(...) = hipotesis del analista: sin afirmacion, sin fuente
function H(de, a, pol, mecanismo, retardo, contra) { e(de, a, pol, mecanismo, retardo, 'D0', [], '', contra || '', { hipotesis: true }); }
// C(...) = identidad contable
function C(de, a, pol, mecanismo, retardo, st, evidencia) { e(de, a, pol, mecanismo, retardo, 'D3', st || [], evidencia || 'Identidad contable.', '', { contable: true }); }
const S = n => 'S' + String(n).padStart(3, '0');
const ss = (...n) => n.map(S);
const REF = 'Referencia de otro país: ';

// --- Demografia y territorio
C('D02', 'D01', '+', 'Quien llega se suma a la población.', 'inmediato');
C('D04', 'D03', '-', 'Con hogares más pequeños, la misma población forma más hogares.', '>3 años', [], 'Identidad contable (hogares = población / tamaño). INE, Proyección de hogares 2024-2039: el tamaño medio pasa de 2,50 a 2,32 y los hogares crecen un 19,1 % con un 10,6 % más de población.');
e('D02', 'B01', '+', 'La inmigración aumenta la demanda de vivienda donde se asienta, y con ella el precio.', '1-3 años', 'D3', ss(21, 28, 84, 94), 'Gonzalez y Ortega (Journal of Regional Science, 2013), provincias 2000-2010, variable instrumental: la inmigración fue responsable de una cuarta parte de la subida de precios. Sanchis-Guarner (2023), provincias 2001-2012: +1 pp de inmigración → precios +3,3 % (efecto total, leído en el documento de trabajo).', 'Evidencia de 2000-2012, cuando la oferta respondía construyendo. Sin réplica localizada para 2015-2025.', { ambito: 'Provincias, 2000-2012' });
e('D02', 'A02', '+', 'La inmigración aumenta la demanda de alquiler donde se asienta.', '1-3 años', 'D3', [], 'Sanchis-Guarner (2023), provincias 2001-2012, variable instrumental: +1 pp de inmigración → alquileres +1 %.', 'Mismo límite temporal que la relación anterior.', { ambito: 'Provincias, 2001-2012' });
e('A02', 'D02', '-', 'Cuando el alquiler sube donde hay empleo, llega menos gente de fuera.', '1-3 años', 'D2', [], 'Banco de España, Informe Anual 2025, recuadro 2.4 (leído en la fuente): un aumento del 1 % del alquiler real en las provincias de destino reduce un 5 % los flujos migratorios hacia España. Provincias, 2014-2024, modelo de gravedad.', 'El propio recuadro lo llama «una primera estimación»; el documento de trabajo aún no se ha publicado.', { ambito: 'Cierra un bucle de equilibrio con la relación anterior.' });
e('D05', 'B01', '+', 'El empleo se concentra en pocas áreas y la demanda de vivienda le sigue.', '>3 años', 'D1', ss(21), 'Banco de España (2023), «El desajuste entre la oferta y la demanda de vivienda»: desajuste territorial entre parque y demanda.', '', { ambito: 'Grandes áreas urbanas' });
e('D08', 'Q04', '+', 'Donde la población disminuye, las viviendas se quedan sin uso.', '>3 años', 'D1', ss(61), 'INE, Censo de 2021 (leído en la fuente): el 45,0 % de la vivienda vacía está en municipios de menos de 10.000 habitantes, donde vive el 20,3 % de la población.', 'Tinsa, en la misma nota: en volumen, la mitad de la vivienda vacía está en 14 provincias, que tienden a ser de costa.');
e('D03', 'Q08', '+', 'Cada hogar nuevo sin vivienda nueva agranda el déficit.', 'inmediato', 'D2', ss(23, 81), 'Banco de España, Informe Anual 2025, cap. 2 (leído en la fuente): el diferencial acumulado desde 2021 entre creación neta de hogares y viviendas terminadas asciende a unas 750.000 viviendas, el 3,7 % de los hogares; el 52,5 % se concentra en seis provincias.', 'Es un déficit de flujo: no descuenta viviendas vacías; el mismo informe cuenta unas 450.000 viviendas del boom sin vender, mal localizadas.');
e('P02', 'Q08', '-', 'Cada vivienda terminada reduce el déficit.', 'inmediato', 'D2', ss(23, 48, 81), 'Mismo cálculo del Banco de España.', '');
e('Q08', 'B01', '+', 'Más hogares que viviendas: los compradores compiten y el precio sube.', '1-3 años', 'D1', ss(48, 62, 64, 91, 97), 'CaixaBank Research, Informe Sectorial Inmobiliario 2S 2025 (leído en la fuente): una regresión simple entre provincias da +0,6 pp de precio al año por cada punto de déficit; con la medida más amplia de déficit explicaría hasta el 39 % de la subida. Es una correlación.', 'Palomera, Gil, Gabarre y Jacinto niegan que falte vivienda: sostienen que está desviada o acaparada (S075, S076, S078, S080).', { disputada: true });
e('Q07', 'Q08', '+', 'La vivienda que se destina a segunda residencia no aloja hogares.', 'inmediato', 'D0', ss(66), '', 'Solo lo afirma un actor. El dato que da (60.000 al año) son compraventas de no residentes, incluida segunda mano.');
// R03 -> D02: ver la sexta revision
// D02 -> D03: ver la sexta revision
H('D05', 'D08', '+', 'El empleo se va de los municipios pequeños y su población disminuye.', '>3 años');
H('Q08', 'A02', '+', 'Más hogares que viviendas: los inquilinos compiten y la renta sube.', '1-3 años', 'Las afirmaciones recogidas hablan de «precios» o de la oferta de alquiler, no de este vínculo.');
// --- Renta, esfuerzo y emancipacion
C('R01', 'O01', '-', 'El esfuerzo es renta de alquiler dividida por ingresos.', 'inmediato');
C('A02', 'O01', '+', 'El esfuerzo es renta de alquiler dividida por ingresos.', 'inmediato', ss(86));
C('R01', 'O02', '-', 'El esfuerzo de compra es precio dividido por ingresos.', 'inmediato');
C('B01', 'O02', '+', 'El esfuerzo de compra es precio dividido por ingresos.', 'inmediato');
C('F01', 'O02', '+', 'Con tipos más altos la misma hipoteca cuesta más cada mes.', 'inmediato', [], 'Identidad contable en el esfuerzo teórico que calcula el Banco de España.');
C('B01', 'B04', '+', 'La entrada es un porcentaje del precio.', 'inmediato');
C('O03', 'D07', '+', 'Cada año de retraso suma jóvenes que siguen en casa de sus padres.', '1-3 años', [], 'Casi una identidad. Eurostat: los jóvenes de 25 a 34 años que viven con sus padres pasan del 38,9 % en 2007 al 50,2 % en 2025.');
e('R02', 'O03', '-', 'Con mejores salarios los jóvenes pueden irse antes.', '1-3 años', 'D0', ss(25), '', 'Solo lo afirma un actor. Consejo de la Juventud (1S 2024): la emancipación bajó 1,47 pp pese a una subida del 4,0 % del salario mediano joven.');
e('R05', 'D03', '+', 'Con un contrato estable se forma un hogar antes.', '1-3 años', 'D2', ss(25), 'Barceló y Villanueva (Banco de España, DT 1849, 2018; solo leído el resumen): +1 % de trabajadores con contrato indefinido aumenta la probabilidad de formar un hogar nuevo en una magnitud similar, sobre todo alquilando.', 'Ahn y Sánchez-Marcos (2015): la emancipación subió en plena recesión; no sigue mecánicamente al ciclo.');
e('O01', 'O03', '+', 'Si el alquiler se lleva casi todo el salario, emanciparse se retrasa.', '1-3 años', 'D3', ss(86), 'Aparicio-Fenoll y Oppedisano (IZA DP 6651, leído completo): la Renta Básica de Emancipación de 2008 elevó la emancipación entre 0,9 y 2,3 pp y la convivencia en pareja entre 1,2 y 2,4 pp, comparando jóvenes de 22 años con los de 21.', 'Identificado con una ayuda, no con una subida de precios; el efecto puede no ser simétrico.');
e('O01', 'D03', '-', 'El coste reprime la formación de hogares: se comparte piso o no se sale de casa.', '1-3 años', 'D2', ss(89, 111), 'Cagigas y Beraza (ICE 942, 2026, leído en la fuente): el déficit de hogares jóvenes no formados respecto a la tendencia de 2014 supera los 311.000 en 2024. Aparicio-Fenoll y Oppedisano: una ayuda al alquiler aumenta la salida del hogar familiar.', 'No existe una elasticidad española de la formación de hogares respecto al alquiler. La proyección de hogares del INE no depende del coste de la vivienda.', { ambito: 'De esta relación depende el «efecto rebote» de los escenarios.' });
e('O01', 'O06', '-', 'Quien no puede pagar una vivienda propia retrasa o reduce los hijos.', '>3 años', 'D2', [], 'Aparicio-Fenoll y Oppedisano: entre los jóvenes de 22 años ya emancipados, la ayuda al alquiler elevó entre 4,8 y 8,1 pp la probabilidad de tener al menos un hijo.', 'El estudio mide el efecto de una ayuda sobre quienes ya se han emancipado. No se ha localizado ningún estudio español de precio o alquiler sobre fecundidad.');
e('O01', 'O04', '+', 'Cuando el alquiler no se puede pagar, llegan el impago, el desahucio o el hacinamiento.', '1-3 años', 'D1', ss(87), 'IX Informe FOESSA (2025).', '');
e('O01', 'B03', '-', 'Quien paga mucho de alquiler no puede ahorrar la entrada: la «trampa del alquiler».', '>3 años', 'D1', ss(109, 110), 'Banco de España, Informe Anual 2023, recuadro 4.2 (modelo de ciclo vital calibrado a España): con menos esfuerzo en el alquiler, la proporción de propietarios mayores de 35 años sube 3,4 pp.', 'Es un modelo; no hay estimación con datos de panel.');
e('O02', 'A03', '+', 'Quien no puede comprar se queda en el alquiler.', '1-3 años', 'D1', ss(107, 108), 'INE, Encuesta de Condiciones de Vida: los hogares de 30 a 44 años en alquiler a precio de mercado pasan del 15,8 % en 2007 al 32,1 % en 2025.', 'Dato compatible, no estimación.');
e('O02', 'O03', '+', 'Si comprar es inalcanzable, se sigue en casa de los padres.', '1-3 años', 'D1', [], 'Banco de España, Informe Anual 2025 (leído en la fuente): los jóvenes no emancipados con ingresos necesitarían unos 8,3 años de renta neta para comprar; la cuota de compras de 18 a 35 años cayó cerca de 20 pp entre 2007 y 2025.', 'Dato compatible; ningún estudio español separa con identificación causal el efecto de la vivienda del laboral.');
e('B04', 'B03', '-', 'Sin ahorro para la entrada no hay compra, aunque la cuota fuese asumible.', 'meses', 'D2', [], 'Banco de España, Informe Anual 2023, cap. 4 (leído en la fuente): en 2021 el 61 % de los hogares en alquiler o cesión no tenía el ahorro necesario para comprar en su municipio. ICE 942 (2026): cerca del 50 % de los hogares en alquiler tardaría más de 30 años en reunirlo.', 'Son simulaciones con microdatos; renta y riqueza están muy correlacionadas.');
e('R04', 'B03', '+', 'Con ayuda o herencia familiar se salva la barrera de la entrada.', 'meses', 'D1', ss(77, 112), 'Banco de España, Informe Anual 2025 (leído en la fuente): en 2025 hubo 30.500 donaciones de vivienda de padres a hijos (+61 % sobre 2019) y unos 5.500 millones de euros en donaciones dinerarias, el triple que en 2019.', 'No estima cuántas compras dependen de ellas.');
e('B01', 'R04', '+', 'La revalorización enriquece a las familias que ya son propietarias.', '>3 años', 'D1', [], 'Fedea, «Evolución de la riqueza de las familias en España (2002-2022)»: los activos reales medios del grupo de 55 a 64 años subieron un 67,9 % entre 2002 y 2008.', 'Dato compatible; nada mide cuánta revalorización se convierte en ayuda a los hijos.');
e('B01', 'O05', '+', 'Quien tiene vivienda gana patrimonio; quien no, lo pierde en términos relativos.', '>3 años', 'D1', ss(77, 86), 'Fedea (EFF 2002-2022): la riqueza mediana de los menores de 35 años pasó de 101.040 € en 2008 a 23.500 € en 2022; la media de 65 a 74 años era de 425.838 €.', '');
e('O02', 'M03', '-', 'Si comprar es inalcanzable, cada generación tiene menos propietarios.', '>3 años', 'D1', [], 'INE, Encuesta de Condiciones de Vida: los hogares en propiedad pasan del 80,1 % en 2007 al 73,3 % en 2025; entre los de 30 a 44 años, del 74,3 % al 53,1 %.', 'Dato compatible, no estimación.');
e('A02', 'O07', '-', 'Si alquilar donde hay empleo es inasequible, no compensa mudarse.', '1-3 años', 'D2', [], 'Banco de España, Informe Anual 2025, recuadro 2.4 (leído en la fuente): un aumento del 1 % del alquiler real de una provincia reduce un 0,6 % los flujos de migración interna hacia ella.', 'Primera estimación; mide flujos de residentes, no de trabajadores.');
H('R03', 'R01', '+', 'Más empleo, más ingresos en los hogares.', 'meses');
// --- Financiacion e inversion
e('F01', 'B01', '-', 'Con crédito más barato se puede pagar más por la misma vivienda.', '1-3 años', 'D2', ss(28, 64), 'Jordà, Schularick y Taylor (2015), con España en la muestra; Aspachs-Bracons y Rabanal (2009).', 'Banco de España (2025): con la subida de tipos de 2022 cayeron las compras financiadas, pero los precios no bajaron.');
e('F01', 'F02', '-', 'Crédito más barato, más hipotecas.', 'meses', 'D3', [], 'Jordà, Schularick y Taylor (2015); Jiménez, Mian, Peydró y Saurina para España 2001-2009.', '');
e('F03', 'F02', '-', 'Criterios más duros, menos hipotecas concedidas.', 'meses', 'D2', ss(29), 'Akin et al. (2014): criterios laxos y tasaciones infladas durante la burbuja.', 'Banco de España y AEB sostienen que hoy el crédito no es causa (S027, S063).');
e('F02', 'B03', '+', 'El crédito convierte la intención de comprar en compra efectiva.', 'meses', 'D2', [], 'Aspachs-Bracons y Rabanal (FMI, 2009): la caída de tipos al entrar en el euro, motor del auge.', '');
e('B03', 'B01', '+', 'Más compradores para las mismas viviendas.', '1-3 años', 'D2', ss(21, 28, 64), 'Jordà, Schularick y Taylor (2015); Aspachs-Bracons y Rabanal (2009).', 'Sólido para 2000-2007; el Banco de España lo ve más débil en 2015-2025.');
e('F05', 'B01', '+', 'Los inversores pujan junto a quienes compran para vivir.', '1-3 años', 'D1', ss(32, 34, 95, 98), REF + 'Sá (2025), Inglaterra y Gales: +1 pp en la cuota de compras de sociedades extranjeras → precios +2,1 a 2,3 %.', 'Sin estudio español localizado.');
e('F06', 'B01', '+', 'Compradores con rentas de otros países pagan más por la misma vivienda.', '1-3 años', 'D1', ss(17, 26), 'CaixaBank Research (leído en la fuente): los no residentes pagan 3.063 €/m² frente a 1.713 €/m² de los nacionales (2S 2024). ' + REF + 'Hartley et al. (2022): los impuestos altos a compradores extranjeros en Toronto y Vancouver frenaron el crecimiento de los precios.', 'Banco de España (Álvarez, Blanco y García-Posada, 2020, leído en la fuente): con 50 provincias, 2013-2019, no hay evidencia estadística de que la inversión de no residentes haya contribuido de forma significativa a la subida de precios.', { disputada: true, ambito: 'Costa mediterránea e islas' });
e('B01', 'F04', '+', 'Las subidas recientes se proyectan hacia el futuro.', 'meses', 'D1', [], 'García Montalvo (Funcas, 2026), encuesta de 2025: las expectativas siguen «patrones extrapolativos» y son superiores a las de 2005; el incremento de precios percibido (26,1 %) dobla el oficial (12,8 %). ' + REF + 'Armona, Fuster y Zafar (2019), experimento en EE. UU.', 'Es una encuesta descriptiva, no una estimación.');
e('F04', 'F05', '+', 'Si se espera que suba, comprar para invertir compensa.', 'meses', 'D1', [], REF + 'Armona, Fuster y Zafar (2019): las expectativas afectan causalmente a la decisión de invertir en vivienda.', 'Sin medición en España.');
C('A02', 'F08', '+', 'La rentabilidad es renta anual dividida por precio.', 'inmediato');
C('B01', 'F08', '-', 'La rentabilidad es renta anual dividida por precio.', 'inmediato');
e('F09', 'F05', '+', 'El capital internacional busca activos reales seguros.', '1-3 años', 'D0', ss(79), '', 'Solo lo afirma un actor.');
e('F05', 'Q03', '+', 'Quien compra esperando plusvalía puede preferir no alquilar.', '1-3 años', 'D0', ss(34, 41), '', 'Tinsa: la mayor cuota de vivienda vacía está en el interior (S061).', { disputada: true });
e('F07', 'A01', '+', 'Los inversores profesionales promueven y gestionan vivienda de alquiler.', '>3 años', 'D1', ss(24, 44), 'Atlas Real Estate Analytics (consultora del sector; leído en la fuente): 15.710 viviendas de alquiler entregadas por promotores institucionales en 2019-2023, de ellas 9.361 en 2023.', 'Los movimientos de vivienda sostienen que encarecen, no que amplían la oferta (S009, S035). Es poco frente a un parque de alquiler de millones.');
e('F10', 'A08', '+', 'Cada cartera que compra un fondo concentra más la oferta.', '1-3 años', 'D0', ss(35), '', 'Solo lo afirma un actor. Tres mediciones de la concentración no coinciden: Consumo-CSIC (dos o más viviendas alquiladas, 52,8 % entre particulares), Banco de España (más de diez viviendas, un máximo del 7 %) y Civio (737 grupos con el 10 % de los alquileres con fianza).');
e('A08', 'A02', '+', 'Quien controla mucha oferta en una zona puede fijar precios por encima de la competencia.', '1-3 años', 'D1', ss(10, 35, 38, 39), REF + 'Gurun et al. (2023), EE. UU.; Banco Central de Irlanda: los institucionales suben la renta 4,1 pp más tras la compra.', 'Sin estudio español. El Banco de España sostiene el signo contrario: los arrendadores no profesionales tienen más costes y eso se traduce en precios más altos (Informe Anual 2023, pp. 283-284).', { disputada: true });
e('L07', 'F07', '+', 'Un trato fiscal favorable atrae capital a estos vehículos.', '1-3 años', 'D1', ss(41, 53), 'Gil y Martínez (Housing, Theory and Society, 2023): la reforma de 2012-2013 dejó su impuesto de sociedades en el 0 % y redujo de siete a tres años el plazo mínimo de tenencia. Banco de España (Boletín Económico 3/2020): pasan de 2 en 2013 a 90 en 2019.', 'Coincidencia temporal, sin estimación. La vivienda es solo el 11,2 % de sus activos y en torno al 1 % de las viviendas principales en alquiler (Banco de España, 2020). La norma no exige que el arrendamiento sea a residentes permanentes, y hay socimis especializadas en alquiler turístico (Cocola-Gant et al., 2025).');
e('L10', 'F07', '-', 'Si las reglas cambian a menudo, el inversor de largo plazo se retira.', '1-3 años', 'D0', ss(44, 53), '', 'No existe ninguna estimación española del efecto de la inestabilidad normativa sobre la inversión.');
e('F07', 'P09', '+', 'El capital institucional financia promociones que el promotor no puede pagar solo.', '1-3 años', 'D0', ss(45), '', 'Solo lo afirma un actor.');
H('F01', 'F05', '-', 'Con tipos bajos, la vivienda rinde más que los depósitos y la deuda.', 'meses');
H('F09', 'F07', '+', 'El capital internacional entra a través de fondos y socimis.', '1-3 años');
H('F08', 'F05', '+', 'Cuanto más rinde alquilar, más compensa comprar para alquilar.', '1-3 años');
H('F08', 'F07', '+', 'La rentabilidad atrae capital profesional.', '1-3 años');
H('F05', 'A01', '+', 'Parte de lo que se compra para invertir se pone en alquiler.', '1-3 años');
// --- Suelo y urbanismo
e('S02', 'S01', '-', 'Cuanto más tarda la tramitación, menos suelo llega a estar listo.', '>3 años', 'D1', ss(43, 65), 'Ministerio de Vivienda, «Sectores Residenciales en España 2025» (leído en la fuente): de 1.069 grandes sectores, solo el 25,8 % tiene suelo urbanizado disponible y el 64,4 % no ha iniciado la urbanización. Banco de España, Informe Anual 2025: la lenta gestión urbanística da como resultado una baja ejecución de las viviendas previstas.', 'Sin estimación del efecto. La cifra de «10 a 15 años» procede de un informe de Colliers y la patronal APCE apoyado en cuatro casos; lo único medido oficialmente son 18,5 años de media para completar la edificación de un sector.');
e('S01', 'P01', '+', 'Sin suelo listo no se puede iniciar obra.', '1-3 años', 'D1', ss(12, 22, 43, 62, 65), 'Banco de España, Informe Anual 2025 (leído en la fuente): la gestión urbanística y las políticas de suelo «emergen como un factor central» de la baja producción.', 'Ezquiaga: hay suelo urbanizable que no se ejecuta (S068). El propio Ministerio cuenta 106.606 viviendas previstas en sectores ya urbanizados donde no se ha empezado a edificar.');
e('S01', 'B01', '-', 'Donde hay más suelo listo para edificar, los precios suben menos.', '>3 años', 'D1', ss(20), 'Banco de España, Informe Anual 2023, gráfico 4.11 (leído en la fuente): en los municipios de más de 50.000 habitantes, los precios de compra han crecido más donde hay menos suelo disponible.', 'Es una correlación entre municipios, sin coeficiente publicado.');
e('S01', 'A02', '-', 'Donde hay más suelo listo para edificar, los alquileres suben menos.', '>3 años', 'D1', ss(20), 'Banco de España, Informe Anual 2023, gráfico 4.11: los alquileres también han crecido más donde hay menos suelo disponible.', 'Es una correlación entre municipios.');
e('S05', 'G02', '+', 'La vivienda protegida necesita suelo barato o cedido.', '>3 años', 'D0', ss(67), '', 'Solo lo afirma un actor.');
e('S02', 'S03', '+', 'El suelo clasificado se acumula sin transformar.', '>3 años', 'D1', [], 'Ministerio de Vivienda (2025): el 64,4 % de los grandes sectores residenciales no ha iniciado las obras de urbanización. Banco de España, Informe Anual 2025: el 71 % de los municipios no había modificado su plan general desde 2008.', 'Dato compatible, no estimación.');
e('F04', 'S03', '+', 'Si se espera que el suelo valga más, compensa esperar para desarrollarlo.', '1-3 años', 'D0', ss(115), '', 'Solo lo afirma un actor. No hay ninguna medición de la retención de suelo.');
e('S06', 'S02', '-', 'Con reglas estables, los planes no se anulan ni se repiten.', '>3 años', 'D0', ss(50, 116), '', 'No hay serie de planes anulados; la cifra de 94 municipios afectados en 2023 es una cita de segunda mano.');
H('S01', 'S04', '-', 'Cuanto menos suelo listo hay, más caro es.', '1-3 años');
e('B01', 'S04', '+', 'El suelo vale lo que permite ganar la vivienda que se construye encima.', '1-3 años', 'D0', ss(117), '', 'Solo lo afirma un actor; no se ha abierto ningún estudio que lo estime.');
H('M03', 'S01', '-', 'Los propietarios, que son mayoría, tienden a oponerse a nuevos desarrollos cerca de su vivienda.', '>3 años', 'Solé-Ollé y Viladecans-Marsal (2012) muestran que más competencia política local reduce el suelo nuevo clasificado, con más efecto donde hay muchos propietarios; los autores lo interpretan como presión de los promotores, no de los vecinos. No se ha localizado ningún estudio sobre oposición vecinal en España.');
// --- Produccion
e('B01', 'P01', '+', 'Con precios más altos compensa construir más.', '1-3 años', 'D2', [], 'Dos estimaciones de la OCDE que no coinciden: Caldera Sánchez y Johansson (WP 837, leído en la fuente) dan una elasticidad de largo plazo de 0,45, respuesta intermedia; Cavalleri, Cournède y Özsöğüt (2019, datos hasta 2017) dan 1,17.', 'El Banco de España (Informe Anual 2025) considera estas cifras una cota superior de la respuesta actual. Contraejemplo descriptivo: hoy los precios superan los de 2007 y se inicia menos de la cuarta parte.');
e('P03', 'P01', '-', 'Con costes más altos se inician menos promociones.', '1-3 años', 'D1', ss(22), 'Ministerio de Transportes: el índice de costes de construcción sube un 25 % entre 2019 y 2025. Banco de España, Informe Anual 2025: su componente residencial sube cerca de un 35 % entre principios de 2020 y finales de 2025.', 'Sin estimación de cuánto reduce las viviendas iniciadas.');
e('P04', 'P01', '+', 'Sin trabajadores no se puede iniciar ni terminar obra.', '1-3 años', 'D1', ss(22, 49, 58, 62), 'Banco de España, Informe Anual 2025 (leído en la fuente): el 63 % de las empresas del sector señala la falta de personal como factor limitante a finales de 2025; era el 55 % a finales de 2023 y cerca del 20 % a finales de 2020.', 'Es encuesta de percepción; ningún estudio reparte la caída de la producción entre suelo, costes, mano de obra y financiación.');
e('P04', 'P03', '-', 'Cuando faltan trabajadores, suben los salarios del sector.', 'meses', 'D1', [], 'Banco de España, Informe Anual 2023 (leído en la fuente): el coste laboral por trabajador en construcción subió un 11,2 % entre 2019 y 2023.', 'Dato compatible, no estimación.');
C('P01', 'P02', '+', 'Lo que se inicia se termina unos dos años después.', '1-3 años');
e('P02', 'A02', '-', 'La vivienda nueva libera otras por cadenas de mudanzas y alivia el alquiler.', '1-3 años', 'D1', [], REF + 'Auckland, seis años después de permitir más edificación, alquileres entre un 14 % y un 35 % inferiores al contrafactual (Greenaway-McGrevy, 2023). EE. UU.: los edificios nuevos bajan cerca de un 6 % los alquileres cercanos (Asquith, Mast y Reed, 2023).', 'Sin estudio español. En Minneapolis la bajada no se debió a más oferta, según sus autores.');
e('P06', 'P03', '+', 'Cada requisito técnico añade coste por metro.', '1-3 años', 'D0', ss(16), '', 'Solo lo afirma un actor.');
e('P09', 'P01', '+', 'Sin capital no se puede comprar suelo ni empezar obra.', '1-3 años', 'D1', ss(45, 118), 'Banco de España, Informe Anual 2025 (leído en la fuente): el crédito al sector equivale al 5,8 % del PIB en 2025, frente al 26 % en los años 2000; la rentabilidad de la construcción residencial fue del 8,7 % en 2024, unos 6 puntos menos que en 2004-2007.', 'Dato compatible, no estimación.');
e('P03', 'P10', '+', 'Con costes altos solo sale rentable construir caro.', '1-3 años', 'D0', ss(60), '', 'Solo lo afirma un actor.');
e('F06', 'P10', '+', 'La demanda extranjera de renta alta orienta la promoción hacia ese segmento.', '1-3 años', 'D0', ss(17), '', 'Solo lo afirma un actor.', { ambito: 'Costa e islas' });
e('P10', 'B01', '+', 'Si lo nuevo es caro, no alivia el precio del resto.', '1-3 años', 'D0', ss(60), '', REF + 'Mast (2023) y Asquith et al. (2023), EE. UU., encuentran lo contrario: la obra nueva cara libera vivienda más barata.', { disputada: true });
e('L06', 'B01', '+', 'Los impuestos se trasladan al precio final.', 'meses', 'D0', ss(47, 121), '', 'Lo afirman solo fuentes del sector, con definiciones distintas de la carga. No se ha localizado ningún estudio español sobre la traslación de impuestos a precios.');
e('P08', 'Q03', '-', 'Rehabilitar devuelve al uso viviendas que no lo tenían.', '1-3 años', 'D0', ss(22), '', 'Solo lo afirma un actor.');
e('Q09', 'Q03', '-', 'Lo que está en mal estado o no se adapta se queda vacío.', '>3 años', 'D1', ss(101, 103), 'Generalitat, Informe sobre el sector de l’habitatge 2024 (leído en la fuente): de 25.443 viviendas del registro de vacías, el 37 % está en condiciones de habitabilidad. Madrid, programa ReViVa (visto en prensa): las 200 viviendas captadas necesitaron obra.', '');
e('P05', 'P03', '-', 'Más producción por hora, menos coste por vivienda.', '>3 años', 'D1', [], 'Banco de España, Informe Anual 2025 (leído en la fuente): la producción por hora trabajada en la construcción cae un 13 % entre 2013 y 2025; el 95 % de las empresas de edificación residencial tiene menos de diez trabajadores.', 'Dato compatible; no estima el paso de la productividad a los costes.');
e('D02', 'P04', '+', 'Parte de quienes llegan trabaja en la construcción.', '1-3 años', 'D1', [], 'Ministerio de Inclusión (cierre de 2025, leído en la fuente): el 23,2 % de los afiliados del sector de la construcción son extranjeros. En agosto de 2026, el 27 % (mismo Ministerio), y el 27,4 % de los ocupados del sector según la EPA. Banco de España, Informe Anual 2025: el 63 % de las empresas de construcción y promoción dice que la falta de personal limita su actividad.', 'Dato compatible, sin serie histórica ni estimación.', { ambito: 'La inmigración actúa a la vez sobre la demanda de vivienda y sobre la capacidad de construirla.' });
// --- Parque y usos
e('L03', 'Q05', '-', 'Menos licencias, menos viviendas turísticas.', '1-3 años', 'D2', ss(14), 'Gyódi et al. (2025), según la revisión de Hidalgo y Velázquez (Fedea, DT 2026-02, leída en la fuente): sin la regulación aplicada en Barcelona desde 2015, los anuncios casi se habrían duplicado. INE: las viviendas turísticas bajan de 376.463 a 329.764 entre noviembre de 2024 y noviembre de 2025.', 'La misma revisión: la regulación evita más crecimiento, pero no revierte lo ya perdido, y los operadores con muchas viviendas la esquivan mejor. Apartur: la prohibición desplaza a la oferta ilegal (S085). El estudio original no se ha leído.');
e('Q05', 'A02', '+', 'Las viviendas que pasan a uso turístico dejan de alquilarse a residentes y la renta sube.', '1-3 años', 'D3', ss(14, 74, 83), 'Garcia-López, Jofre-Monseny, Martínez-Mazza y Segú (Journal of Urban Economics, 2020): panel de 233 áreas estadísticas básicas de Barcelona con efectos fijos, corroborado con variable instrumental: +1,9 % en alquileres en el área media y +7 % en el decil con más anuncios.', 'Airbnb y FEVITUR lo consideran marginal (S082, S084). ' + REF + 'en Santa Mónica se eliminó el 60 % de los anuncios sin efecto en los alquileres, porque las viviendas no volvieron al alquiler de larga duración.', { disputada: true, ambito: 'Centros urbanos y destinos turísticos' });
e('Q05', 'B01', '+', 'La rentabilidad turística se capitaliza en el precio de compra.', '1-3 años', 'D3', ss(14, 33, 83), 'Garcia-López et al. (2020), versión publicada: +4,6 % en precios de transacción en el área media y +17 % en el decil con más anuncios.', '', { ambito: 'Barcelona' });
e('Q05', 'A01', '-', 'Cada vivienda turística es una vivienda menos para residentes.', '1-3 años', 'D2', ss(1, 14, 100), 'Garcia-López et al. (documento de trabajo de 2019, leído en la fuente): 100 anuncios más reducen un 2,8 % el número de hogares de un área, que los autores interpretan como menos oferta de alquiler de larga duración. Banco de España, DO 2432: las viviendas turísticas equivalen a cerca del 10 % del mercado de alquiler.', 'Mide hogares, no viviendas en alquiler. Junts, Airbnb y Apartur niegan que al retirar licencias las viviendas vuelvan al alquiler habitual (S015, S082, S085). Madrid «recuperó» 323 viviendas en 2025 frente a unas 12.500 sin licencia.', { disputada: true });
e('Q05', 'O08', '+', 'Los edificios se llenan de visitantes y los residentes se van.', '1-3 años', 'D3', ss(83), 'Garcia-López et al. (documento de trabajo de 2019, tabla 5, leído en la fuente): 100 anuncios más reducen un 2,8 % el número de hogares del área, unos 80 hogares. Madrid (Chaves-Fonseca, SERIEs, 2026; 128 barrios, 2010-2018, variable instrumental): cada anuncio de vivienda entera supone 1,2 hogares menos, por menos llegadas de residentes y no por más salidas.', 'Miden hogares totales, no inquilinos, y no dicen qué era antes la vivienda.', { ambito: 'Barcelona, 2009-2016, y Madrid, 2010-2018' });
e('Q05', 'Q11', '-', 'Con menos viviendas turísticas hay menos plazas y el alojamiento se encarece.', 'meses', 'D1', [], REF + 'Nueva York, tras restringir el alquiler de corta estancia la tarifa hotelera media subió entre 14 y 19 dólares por noche (Anastasi et al., 2025, leído en la revisión de Fedea).', 'En España el patrón por ciudades no es uniforme: en Palma y San Sebastián bajan las viviendas turísticas y sube la tarifa hotelera, pero en Barcelona bajan un 37 % y la tarifa apenas se mueve (Exceltur, parte interesada). Sin estimación española.');
e('L01', 'Q06', '+', 'Con el alquiler habitual topado, los contratos se desvían a temporada y habitaciones.', 'meses', 'D1', ss(36, 80, 113), 'Observatori Metropolità de l’Habitatge (leído en la fuente): en Barcelona los contratos de temporada pasan del 12,9 % de los nuevos en el 1T 2024 al 26,3 % en el 4T 2024; en la oferta de portales, del 13,1 % en el 1T 2019 al 39,6 % en el 1T 2024.', 'La cuota sube en parte porque el alquiler habitual rota menos. Sin estimación causal del trasvase.');
e('L01', 'Q05', '+', 'Con el alquiler habitual topado, parte de la oferta se desvía a uso turístico.', '1-3 años', 'D0', ss(30), '', 'Solo lo afirma un actor.');
e('Q06', 'A01', '-', 'Lo que se alquila por temporada o habitaciones sale del alquiler habitual.', 'meses', 'D1', ss(36, 75, 80), 'Banco de España, DO 2432 (leído en la fuente): a mediados de 2024 los anuncios de temporada crecían un 55 % interanual mientras los de alquiler residencial caían más de un 15 %.', 'Mide anuncios, no viviendas. Atlas no encuentra una correlación estable con los precios.');
e('F06', 'Q07', '+', 'Los no residentes compran sobre todo segunda residencia.', '1-3 años', 'D1', [], 'Banco de España (2020, leído en la fuente): los no residentes hicieron el 38 % de las compras de Alicante, el 28 % de Málaga y el 25 % de Santa Cruz de Tenerife.', '');
e('Q03', 'A01', '-', 'Una vivienda vacía donde hay demanda es oferta que no existe.', 'inmediato', 'D1', ss(41), 'INE, Censo de 2021 (leído en la fuente): las ciudades de más de 250.000 habitantes tienen 403.073 viviendas vacías, el 7,5 % de su parque; son 3,6 por 100 habitantes, frente a 38,3 en los municipios de menos de 1.000.', 'Euskadi 2023: solo el 2,4 % del parque es vivienda deshabitada «gestionable». El criterio del INE es consumo eléctrico, medido en el año de la pandemia.');
e('L08', 'Q03', '-', 'Tener la vivienda vacía sale más caro.', '1-3 años', 'D1', [], REF + 'Segú (2020), Francia: el impuesto de 1999 redujo la tasa de vacancia un 13 %. Vancouver: −1,5 pp de vacancia, sin efecto en el alquiler medio.', 'La única evaluación española contradice esas referencias: Ivàlua (2022), sobre el impuesto catalán a las viviendas vacías, concluye que su efecto sobre el número de viviendas vacías y sobre el alquiler no es estadísticamente significativo.', { disputada: true });
e('L13', 'Q03', '-', 'Si la Administración garantiza la renta, el propietario de una vivienda vacía la cede.', '1-3 años', 'D1', [], 'Observatorio Vasco de la Vivienda, evaluación de Bizigune (leída en la fuente): 6.224 viviendas captadas en 2020 y 7.375 a cierre de 2024, con requisito de llevar tres meses sin ocupar; coste de unos 4.850 € por vivienda y año.', 'Evalúa el propio gestor, sin contrafactual. El programa que solo ofrece seguro de impago (ASAP) captó 278 viviendas, el 35 % de su objetivo. ' + REF + 'en Francia el seguro voluntario no cumplió objetivos.', { ambito: 'Funciona con pago directo de la renta; con solo un seguro, apenas.' });
e('L13', 'G01', '+', 'Las viviendas cedidas se alquilan a precio protegido y se suman al parque asequible.', '1-3 años', 'D1', [], 'Bizigune: 7.375 viviendas a cierre de 2024 (Alokabide, memoria de 2024). Cataluña: 7.915 viviendas en la red de mediación. Navarra: 1.000 viviendas cedidas.', 'Son cesiones temporales, no parque permanente.');
e('L13', 'A09', '-', 'Con el cobro garantizado, el arrendador acepta inquilinos que antes descartaba.', 'meses', 'D1', [], REF + 'Cour des comptes (2025, leído en la fuente): la garantía pública francesa Visale cubrió 1,2 millones de contratos en 2016-2023; según una encuesta encargada por el gestor, el 79 % no se habría firmado sin ella.', 'Parte de los arrendadores la rechaza porque la asocia a inquilinos frágiles. Sin evaluación en España: la línea estatal de 2025 aún no tiene resultados.');
e('L13', 'A04', '-', 'Si el cobro está garantizado, el propietario deja de temer el impago.', 'meses', 'D0', ss(114), '', 'Solo lo afirma un actor.');
// L09 -> Q06: ver la cuarta revision, al final del archivo
// --- Mercado de alquiler
e('A03', 'A02', '+', 'Más hogares buscando, rentas más altas.', 'meses', 'D1', [], 'Pinto (Fedea, 2026): 462 contactos por anuncio en Barcelona frente a 103 en Madrid.', 'Dato compatible, no estimación.');
e('A01', 'A02', '-', 'Con menos oferta, los inquilinos compiten y la renta sube.', 'meses', 'D2', ss(11), 'Monràs y García-Montalvo (documento de trabajo de 2022, leído completo): elasticidad de los contratos nuevos respecto al precio en torno a 4.', '');
e('L01', 'A02', '-', 'El tope impide subir por encima del índice en los contratos regulados.', 'meses', 'D3', ss(4, 72), 'Cataluña 2020, dos estudios con identificación causal: Monràs y García-Montalvo (alrededor de −5 %) y Jofre-Monseny, Martínez-Mazza y Segú (entre −4 % y −6 %; estimación base −4,5 %). Barcelona 2024 (Observatori, leído en la fuente): precio de los contratos nuevos −6,4 % entre el 1T y el 4T. ' + REF + 'París, alquileres un 5,2 % inferiores al contrafactual.', 'Monràs y García-Montalvo atribuyen la mitad del efecto a un cambio de composición; Jofre-Monseny et al. no encuentran cambio en la calidad de lo alquilado. Para 2024 el efecto deja de ser significativo con métodos más exigentes (Pérez García, preprint de 2026).', { ambito: 'Contratos regulados' });
e('L01', 'A01', '-', 'Con la renta topada, a algunos propietarios deja de compensarles alquilar como vivienda habitual.', '1-3 años', 'D3', ss(11, 18, 29, 30, 52, 54, 56, 70, 71, 72, 91), 'Monràs y García-Montalvo: los contratos nuevos caen entre un 10 % y un 14 %. Pérez García (preprint de 2026, leído completo): contratos −13 % en las zonas tensionadas de 2024, con la reserva del propio autor de que las tendencias previas divergían. ' + REF + 'Berlín, fuerte reducción de los anuncios de alquiler.', 'Jofre-Monseny et al. (2023), sobre el mismo episodio y con identificación causal, no detectan caída de contratos ni del parque activo. Kholodilin et al. (2022): las cantidades casi no reaccionan. Barcelona 2024 (Observatori): más altas que bajas de contratos, y el descenso de contratos nuevos había empezado en 2022. Llogateres: la caída es desvío a temporada (S036, S037). Datos de 2026 que no coinciden: según la Generalitat, con fianzas depositadas, los contratos vigentes aumentan en 20.994 desde la declaración de zonas tensionadas (S130); según portales inmobiliarios, los anuncios de alquiler en Barcelona caen un 22,2 % (Fedea, Apuntes 2026-15). Miden cosas distintas, contratos registrados y anuncios, y ninguna tiene contrafactual.', { disputada: true });
e('L01', 'A09', '+', 'Con precio topado y muchos candidatos, el arrendador elige al más solvente.', 'meses', 'D0', ss(18, 54, 57), '', '');
e('L01', 'F07', '-', 'El tope reduce la rentabilidad esperada del inversor.', '1-3 años', 'D0', ss(91), '', 'Solo lo afirma un actor.');
e('L01', 'P01', '-', 'Con el alquiler topado se promueve menos vivienda.', '1-3 años', 'D1', [], 'Kholodilin, López, Rey Blanco y González Arbués (2022, leído completo): viviendas iniciadas −6 % en Cataluña frente a +11,5 % en España tras la norma de 2020.', 'Dato provincial que no separa los municipios regulados, como advierten los autores; coincide con la pandemia.');
e('A01', 'A09', '-', 'Con poca oferta, el arrendador puede exigir más.', 'meses', 'D1', ss(54, 57), 'Pinto (Fedea, 2026): contactos por anuncio.', '');
e('A04', 'A01', '-', 'Si se teme no cobrar o no recuperar la vivienda, no se alquila.', '1-3 años', 'D1', ss(73, 90, 92), 'OCU (2025): entre quienes tienen una segunda vivienda y no la ofrecen, al 26 % alquilarla «no le parece seguro». OCU y Ministerio de Consumo (2023, leído en la fuente; 437 arrendadores): al 76,4 % le preocupa no cobrar y al 44,2 % no poder recuperar la vivienda a tiempo.', 'En la misma encuesta, el 76 % de los arrendadores no ha tenido ningún problema con su inquilino en cinco años, y el primer obstáculo que citan es el precio.', { ambito: 'Hay acuerdo entre bloques en que el miedo retira oferta; el desacuerdo es sobre si el miedo está fundado.' });
e('A04', 'Q03', '+', 'La vivienda que no se alquila por miedo se queda vacía.', '1-3 años', 'D1', ss(8, 92), 'OCU (2025): el 26 % de quienes no ofrecen su segunda vivienda dice que alquilarla no le parece seguro; el 55 % la usa de recreo.', 'El miedo no es el primer motivo.');
e('A04', 'A09', '+', 'Quien teme no cobrar pide más garantías o descarta perfiles.', 'meses', 'D1', [], 'OCU y Ministerio de Consumo (2023, leído en la fuente): entre los propietarios con vivienda disponible, el 79 % no alquilaría a inmigrantes en situación irregular, el 70 % a personas sin empleo estable y el 48 % a inquilinos con ingresos justos.', 'Dato compatible, no estimación.');
e('A05', 'A01', '-', 'Cuanto más tarda el juzgado en devolver la vivienda, menos se alquila.', '1-3 años', 'D2', [], 'Mora-Sanguinetti (SERIEs, 2012, leído completo): panel de 50 provincias, 2001-2007; un punto más de congestión judicial en la fase de ejecución eleva la cuota de propiedad entre 0,14 y 0,16 pp.', 'El autor califica el efecto de «menor»; no lo hay en la fase declarativa. Mide congestión, no duración, y cuota de propiedad, no oferta de alquiler.');
e('A05', 'A04', '+', 'Cuanto más tarda el juzgado, más riesgo percibe el propietario.', '1-3 años', 'D1', [], 'OCU y Ministerio de Consumo (2023): al 44,2 % de los arrendadores le preocupa poder recuperar la vivienda en un tiempo prudencial.', 'Dato compatible, no estimación.');
e('A06', 'A01', '-', 'Si el impago se tolera, los propietarios dejan de alquilar.', '1-3 años', 'D0', ss(93), '', 'Solo lo afirma un actor. OCU (2025): el 4 % de los arrendadores ha sufrido impagos reincidentes.');
e('A07', 'A04', '+', 'La ocupación, aunque sea infrecuente, pesa mucho en la percepción.', 'meses', 'D0', ss(92), '', 'Iglesias y Jacinto: es un miedo infundado o inducido (S008, S080). Ministerio del Interior: 14.875 hechos conocidos por allanamiento o usurpación en 2025.', { disputada: true });
e('L02', 'A01', '-', 'Si la protección del inquilino recae sobre el propietario, este se retrae.', '1-3 años', 'D1', ss(52, 96, 97, 105), REF + 'Casas-Arce y Saiz (2010), comparación entre países citada por el Banco de España (DO 2002): relación negativa entre la falta de seguridad jurídica del propietario y el desarrollo del mercado de alquiler.', 'El Banco de España lo formula en condicional. Sin estimación española.');
e('L02', 'A04', '+', 'Más protección al inquilino vulnerable eleva el riesgo de impago que asume el propietario.', 'meses', 'D0', ss(90, 105), '', '');
e('L02', 'A05', '+', 'Las moratorias y garantías alargan el procedimiento.', 'meses', 'D1', [], 'CGPJ: la duración media estimada de los juicios verbales arrendaticios pasa de 4,5 meses en 2014 a 8,5 en 2023.', 'No separa el efecto de la norma del de la congestión judicial; mide hasta la resolución, no hasta el lanzamiento.');
e('L02', 'O04', '-', 'La moratoria y los límites al desahucio evitan lanzamientos.', 'meses', 'D1', ss(42), 'CGPJ (leído en la fuente): los lanzamientos derivados de la ley de arrendamientos bajan de 36.468 en 2019 a 18.317 en 2025. El Banco de España atribuye parte de la caída a esas limitaciones (Informe Anual 2023, p. 277).', 'La PAH estima 34.780 lanzamientos suspendidos en 2021-2023 (fuente de parte). Mide suspensiones, no hogares que conservan la vivienda.');
e('L02', 'A11', '+', 'Si desahuciar es más difícil, el arrendador selecciona más y discrimina más.', 'meses', 'D1', [], REF + 'Arefeva, Hu y Timmins (NBER, 2024; solo leído el resumen): con el desahucio suspendido, los gestores respondieron menos a solicitantes afroamericanos, en un experimento de más de 25.000 consultas.', 'Mercado y moratoria distintos. Sin estudio español.');
e('L10', 'A01', '-', 'Si las reglas cambian a menudo, se ofrece menos vivienda en alquiler.', '1-3 años', 'D0', ss(12, 73, 106), '', 'No existe ninguna estimación española.');
e('L10', 'A04', '+', 'Si la norma cambia a menudo, el propietario no sabe a qué atenerse.', '1-3 años', 'D0', ss(73), '', 'Solo lo afirma un actor.');
e('L04', 'A01', '+', 'La rebaja fiscal hace más rentable alquilar como vivienda habitual.', '1-3 años', 'D2', [], 'AIReF (2020, leído completo): la reducción del 60 % «sí consigue su objetivo de fomentar la oferta», sin poder distinguir oferta nueva de alquiler que aflora. Al suprimirse en 2015 la reducción del 100 % por alquilar a jóvenes, el 12 % de esos inmuebles salió del alquiler en tres años, frente al 9 % del resto.', 'AIReF la califica de regresiva y propone reformularla. García Montalvo: con riesgo percibido alto, los incentivos no bastan (S073).');
e('L05', 'A02', '+', 'Con oferta rígida, la ayuda al inquilino acaba en parte en la renta.', '1-3 años', 'D1', ss(66), REF + 'Fack (2006), Francia: cada euro de ayuda eleva la renta 78 céntimos.', 'Sin evaluación del bono joven en España.');
C('L05', 'O01', '-', 'La ayuda reduce lo que el hogar beneficiario paga de su bolsillo.', 'meses', [], 'Identidad contable, solo para los hogares que reciben la ayuda.');
e('L05', 'B03', '+', 'El aval público permite comprar sin tener la entrada.', 'meses', 'D1', [], 'Avales ICO (visto en prensa): 10.453 operaciones a cierre de 2025, cerca del 10 % de la dotación.', REF + 'Carozzi, Hilber y Yu (2024), Reino Unido: con oferta rígida, sube precios sin más construcción.');
e('A11', 'O04', '+', 'Quien es rechazado acaba en vivienda peor o más cara.', 'meses', 'D1', ss(88), 'Provivienda (2025): en pruebas con 100 agencias de Madrid y Barcelona, el 99 % aceptó prácticas discriminatorias hacia personas extranjeras.', 'Mide la discriminación, no su efecto sobre la exclusión.');
H('A09', 'O04', '+', 'Quien no cumple los requisitos se queda fuera del mercado formal.', 'meses');
H('A09', 'A11', '+', 'Cuando el arrendador puede elegir, los perfiles discriminados son los primeros descartados.', 'meses');
H('A02', 'O08', '+', 'Cuando la renta sube en la renovación, el hogar se va del barrio.', '1-3 años');
// --- Vivienda publica y protegida
e('G04', 'G02', '+', 'Con más presupuesto se promueve más vivienda protegida.', '1-3 años', 'D1', ss(9), 'Ministerio de Vivienda (leído en la fuente): 85.028 calificaciones definitivas en 1997 y 12.858 en 2025. Eurostat: el gasto público en promoción de vivienda fue del 0,4 % del PIB en 2000 y del 0,2 % en 2024.', 'Dato compatible, no estimación.');
e('G04', 'G01', '+', 'La inversión pública financia vivienda de alquiler social.', '1-3 años', 'D1', [], 'Plan de Recuperación (nota oficial): 24.964 viviendas de alquiler social financiadas, con 994,6 millones de euros.', 'Son viviendas financiadas, no terminadas.');
e('G05', 'G02', '+', 'Si el módulo cubre el coste, promotores y cooperativas hacen protegida.', '1-3 años', 'D0', ss(46, 119), '', 'Lo afirman el sector y el Banco de España; no se ha localizado ningún estudio que compare módulos y costes.');
e('P03', 'G05', '-', 'Con el precio máximo fijo, cada subida de costes se come el margen.', 'meses', 'D0', ss(46, 119), '', 'Lo afirman el sector y el Banco de España, sin estudio cuantitativo.');
e('G06', 'G02', '+', 'Lo presupuestado solo se convierte en vivienda si se licita y se ejecuta.', '1-3 años', 'D1', ss(51, 120), 'Banco de España, Informe Anual 2025, con datos de la AIReF (leído en la fuente): a finales de 2025 se había formalizado el 54 % de los fondos europeos de rehabilitación disponibles.', 'Dato compatible; se refiere a rehabilitación, no a vivienda protegida.');
C('G02', 'G01', '+', 'La vivienda protegida destinada a alquiler y con protección permanente entra en el parque social.', '1-3 años', ss(3, 6), 'Identidad de stock y flujo. Históricamente la mayor parte fue vivienda en venta, que no entra.');
C('G03', 'G01', '-', 'Cada vivienda descalificada sale del parque asequible.', 'inmediato', ss(7, 102), 'Identidad de stock y flujo. No hay estadística oficial de descalificaciones; Civio (2026, visto en resumen) estima que más de 340.000 viviendas protegidas cumplirán su plazo entre 2026 y 2030.');
e('G01', 'O01', '-', 'Quien accede a alquiler social paga menos.', 'inmediato', 'D1', ss(3, 6, 13, 31), 'Eurostat (2025): la sobrecarga por coste de vivienda es del 8,4 % entre los inquilinos a precio reducido y del 26,8 % entre los de mercado. Banco de España (leído en la fuente): unas 290.000 viviendas públicas de alquiler, donde reside el 1,6 % de los hogares.', 'Sin evaluación española del efecto del parque social. La categoría de Eurostat mezcla alquiler social, renta antigua y cesión.');
H('G01', 'A03', '-', 'Cada hogar alojado en vivienda social deja de competir en el mercado.', '1-3 años');
// G01 -> O04: ver la sexta revision
// --- Politica y percepcion: la respuesta politica a la presion social es, entera, hipotesis del analista
e('O01', 'M01', '+', 'Cuando el alquiler ahoga a muchos hogares, la vivienda sube entre las preocupaciones.', '1-3 años', 'D1', [], 'CIS, barómetro de enero de 2026 (leído en la fuente): el 42,6 % cita la vivienda entre los principales problemas de España, máximo de la serie. Manifestaciones de 2024-2026 (vistas en prensa).', 'Dato compatible, no estimación.');
H('O03', 'M01', '+', 'Una generación que no puede emanciparse se moviliza.', '1-3 años');
H('O04', 'M01', '+', 'Los desahucios visibles movilizan.', 'meses');
H('O08', 'M01', '+', 'La expulsión de residentes genera protesta vecinal.', '1-3 años');
H('M01', 'L01', '+', 'La presión social empuja a regular precios.', '1-3 años', 'No hay ninguna estimación en España. Chaqués-Bonafont, Palau y Baumgartner: la distancia entre lo que preocupa a los ciudadanos y lo que ocupa a los legisladores ha aumentado.');
H('M01', 'L02', '+', 'La presión social empuja a proteger frente al desahucio.', 'meses');
H('M01', 'L03', '+', 'La presión vecinal empuja a restringir el alquiler turístico.', '1-3 años');
H('M01', 'L05', '+', 'La ayuda directa es la respuesta más rápida y visible.', 'meses');
H('M01', 'G04', '+', 'La presión social empuja a anunciar inversión en vivienda pública.', '1-3 años', 'El salto presupuestario de 2021-2023 coincide con los fondos europeos, no con la preocupación ciudadana, entonces baja.');
H('M01', 'L09', '+', 'La presión empuja a cerrar las vías de escape de la regulación.', '1-3 años');
H('M01', 'M02', '+', 'Cuanto más pesa el problema, más rentable es políticamente diferenciarse en el diagnóstico.', '1-3 años');
H('M01', 'L10', '+', 'Cada pico de presión produce un nuevo decreto.', 'meses', 'Solo hay coincidencias temporales, como la de octubre de 2026.');
H('M02', 'L10', '+', 'Cada cambio de mayoría revierte o modifica las reglas del anterior.', '1-3 años');
H('M02', 'S06', '-', 'Sin acuerdo entre bloques, las reformas de fondo no salen.', '>3 años');
H('M03', 'M01', '-', 'Mientras la mayoría es propietaria, la subida de precios beneficia a más votantes de los que perjudica.', '>3 años', 'Un estudio sobre Madrid (Electoral Studies, 2026, visto en prensa) asocia la subida del alquiler con más voto a la derecha donde hay muchos propietarios; es correlacional y no mide presión social.');

// ---------------------------------------------------------------- Arquetipos
// El analista propone cada arquetipo como un conjunto de bucles (cadenas de variables).
// El motor comprueba que cada cadena existe en el mapa, calcula su tipo (R o B) y lo compara con el
// declarado, calcula confianza y retardo, y verifica la regla estructural de la clase de arquetipo.
// Si una cadena no existe o el tipo no coincide, el motor se detiene.
const arquetipos = [
  {
    id: 'AQ1', clase: 'soluciones_que_fallan', nombre: 'El tope que encoge el mercado', arreglo: 'L01',
    explica: 'Por qué regular el precio alivia el alquiler regulado y, a la vez, puede dejar menos viviendas en alquiler habitual. El alivio es rápido; la retirada de oferta, más lenta.',
    duda: 'Todo el bucle de refuerzo depende de una relación disputada: que el tope reduzca la oferta. Hay estudios con identificación causal sobre Cataluña que lo encuentran y otros que no.',
    bucles: [
      { rol: 'El arreglo', tipo: 'B', cadena: ['A02', 'O01', 'M01', 'L01'] },
      { rol: 'La consecuencia no deseada', tipo: 'R', cadena: ['A01', 'A02', 'O01', 'M01', 'L01'] },
      { rol: 'La vía de escape', tipo: 'R', cadena: ['Q06', 'A01', 'A02', 'O01', 'M01', 'L01'] }
    ]
  },
  {
    id: 'AQ2', clase: 'soluciones_que_fallan', nombre: 'La ayuda que acaba en la renta', arreglo: 'L05',
    explica: 'Por qué las ayudas al inquilino alivian al beneficiario y, con oferta rígida, empujan al alza la renta de todos.',
    duda: 'La incidencia en España no está medida. La referencia es francesa: entre la mitad y cuatro quintos de la ayuda acaban en la renta.',
    bucles: [
      { rol: 'El arreglo', tipo: 'B', cadena: ['L05', 'O01', 'M01'] },
      { rol: 'La consecuencia no deseada', tipo: 'R', cadena: ['A02', 'O01', 'M01', 'L05'] }
    ]
  },
  {
    id: 'AQ3', clase: 'desplazamiento_carga', nombre: 'Lo urgente desplaza a lo estructural', sintoma: 'O01', arreglo: 'L05', fundamental: 'G04',
    explica: 'Por qué el parque social sigue siendo residual. La respuesta rápida (ayudas, topes) y la estructural (parque social) compiten por la misma presión social: cuando la rápida alivia, baja la presión que sostendría la lenta.',
    duda: 'Que la presión social se traduzca en inversión pública sostenida solo se apoya en anuncios, no en ejecución.',
    bucles: [
      { rol: 'La solución sintomática', tipo: 'B', cadena: ['L05', 'O01', 'M01'] },
      { rol: 'La solución fundamental', tipo: 'B', cadena: ['G01', 'O01', 'M01', 'G04', 'G02'] },
      { rol: 'El efecto lateral', tipo: 'R', cadena: ['A02', 'O01', 'M01', 'L05'] }
    ]
  },
  {
    id: 'AQ4', clase: 'limites_crecimiento', nombre: 'La subida que se frena expulsando',
    explica: 'Por qué los precios de compra no suben sin límite y por qué el freno no es una buena noticia: lo que detiene la subida es que los hogares dejan de poder reunir la entrada y no compran.',
    duda: 'El motor de la subida (expectativas e inversión) es la parte peor medida del mapa en España.',
    bucles: [
      { rol: 'El motor', tipo: 'R', cadena: ['F04', 'F05', 'B01'] },
      { rol: 'El límite en la compra', tipo: 'B', cadena: ['B01', 'B04', 'B03'] }
    ]
  },
  {
    id: 'AQ5', clase: 'exito_para_quien_tiene_exito', nombre: 'Quien ya tiene, compra',
    explica: 'Por qué el acceso depende cada vez más del patrimonio familiar. La revalorización enriquece a las familias propietarias, que ayudan a los suyos a comprar; para el resto, la misma subida aleja la entrada.',
    duda: 'Las dos ramas se apoyan en datos descriptivos; no hay estimación del peso de la ayuda familiar en las compras.',
    bucles: [
      { rol: 'La rama que gana', tipo: 'R', cadena: ['R04', 'B03', 'B01'] },
      { rol: 'La rama que queda fuera', tipo: 'B', cadena: ['B01', 'B04', 'B03'] }
    ]
  },
  {
    id: 'AQ6', clase: 'escalada', nombre: 'Regular y esquivar',
    explica: 'Por qué cada regulación genera otra. Al topar el alquiler habitual, rinden más los usos sin tope; la oferta se desplaza; la presión crece y se regula también la vía de escape.',
    duda: 'Que regular la temporada devuelva viviendas al alquiler habitual es una conjetura disputada: hay quien observa que se venden o quedan vacías.',
    bucles: [
      { rol: 'El desplazamiento', tipo: 'R', cadena: ['Q06', 'A01', 'A02', 'O01', 'M01', 'L01'] },
      { rol: 'La respuesta del regulador', tipo: 'B', cadena: ['Q06', 'A01', 'A02', 'O01', 'M01', 'L09'] }
    ]
  },
  {
    id: 'AQ7', clase: 'equilibrio_con_retardo', nombre: 'El freno lento de la oferta',
    explica: 'Por qué la construcción llega tarde y se pasa de largo: se terminaron más de 600.000 viviendas en 2007, con los precios ya en máximos, y se iniciaron menos de 40.000 en 2013. Hoy responde poco y con años de retraso al déficit.',
    duda: 'El eslabón que lo cierra (el déficit sube los precios) está disputado: hay quien niega que falte vivienda.',
    bucles: [
      { rol: 'El corrector', tipo: 'B', cadena: ['P01', 'P02', 'Q08', 'B01'] }
    ]
  },
  {
    id: 'AQ8', clase: 'equilibrio_simple', nombre: 'La carestía que frena la llegada',
    explica: 'Por qué la presión de la inmigración sobre el alquiler se frena a sí misma: quien llega encarece el alquiler donde hay empleo, y un alquiler más caro reduce las llegadas.',
    duda: 'El segundo tramo se apoya en una primera estimación del Banco de España, aún sin documento de trabajo publicado; el primero, en datos de 2001-2012.',
    bucles: [
      { rol: 'El freno', tipo: 'B', cadena: ['D02', 'A02'] }
    ]
  }
];

// Esquema del sistema: posicion fija de las variables clave (lienzo de 1440 x 900)
const esquema = {
  etiquetaArriba: ['G04', 'B03', 'L01', 'R04', 'M01'],
  pos: {
    L09: [680, 150], L01: [900, 215], A01: [640, 270], Q06: [400, 330],
    M01: [1130, 320], A02: [640, 440], O01: [900, 440], G04: [1320, 240], G02: [1320, 410], G01: [1320, 580],
    L05: [985, 640], R04: [110, 480], B03: [290, 460], B04: [480, 560], B01: [300, 610],
    F04: [100, 690], F05: [190, 810], P01: [560, 830], P02: [780, 830],
    Q08: [960, 770], D03: [1230, 770], D02: [520, 70]
  },
  // variables que solo se dibujan en el simulador
  posExtra: { L03: [150, 130], Q05: [200, 270], A04: [1040, 110], L10: [1240, 100], F07: [820, 60], O04: [1140, 520], O03: [1140, 660], O02: [130, 590], L13: [1150, 200], Q03: [800, 330], S02: [760, 720], S01: [680, 760] }
};

// ---------------------------------------------------------------- Datos observados
// Ultimo valor publicado y valor de referencia dos anos antes. La tendencia NO se escribe: la calcula el motor
// (sube si la variacion supera +2 %, baja si es inferior a -2 %, estable en otro caso).
// d(id, valor, anio, previo, anioPrevio, unidad, fuente, nota)
const datos = {};
function d(id, valor, anio, previo, anioPrevio, unidad, fuente, nota) { datos[id] = { valor, anio, previo, anioPrevio, unidad, fuente, nota: nota || '' }; }
d('A02', 122.92, '2024', 112.69, '2021', 'índice 2015 = 100', 'INE, IPVA', 'Mide los contratos vivos; los contratos nuevos suben más deprisa.');
d('B01', 2127.6, '2025', 1809.1, '2023', '€/m²', 'Ministerio de Vivienda, valor tasado', 'En el 2T 2026: 2.355 €/m².');
d('O02', 7.60, '2025', 7.12, '2023', 'años de renta', 'Banco de España', 'En el 2T 2026: 8,36 años. Máximo: 9,36 en 2007.');
d('O01', 26.8, '2025', 30.6, '2023', '% de inquilinos con sobrecarga', 'Eurostat', 'Sin ruptura de serie. Mide a quien consigue alquilar: el Banco de España señala que acceden al alquiler hogares de más renta. Media de la UE: 18,6 %.');
d('O03', 30.2, '2025', 30.4, '2023', 'años', 'Eurostat', 'Media de la UE: 26,3 años.');
d('P01', 137330, '2025', 110344, '2023', 'viviendas/año', 'Ministerio de Vivienda', 'En 2007: 615.976.');
d('P02', 93650, '2025', 89320, '2023', 'viviendas/año', 'Ministerio de Vivienda (libres más protegidas)', 'En 2007: 647.179.');
d('D03', 258200, '2025', 265400, '2023', 'hogares/año', 'EPA, diferencia entre cuartos trimestres', 'Serie ruidosa.');
d('D02', 582896, '2025', 647924, '2023', 'personas/año', 'Eurostat (2025 provisional)', '');
d('D01', 49128297, '2025', 48085361, '2023', 'personas', 'INE', '');
d('G02', 12858, '2025', 8847, '2023', 'viviendas/año', 'Ministerio de Vivienda', 'Sube desde un nivel muy bajo: en 1997 fueron 85.028.');
d('M03', 73.3, '2025', 75.1, '2023', '% de hogares', 'INE, ECV', 'En 2007: 80,1 %.');
d('F01', 2.78, '2025', 3.89, '2023', '%', 'Banco de España', 'En agosto de 2026: 3,10 %.');
d('F02', 498429, '2025', 380966, '2023', 'hipotecas sobre vivienda/año', 'INE', '');
d('F06', 13.82, '2025', 14.98, '2023', '% de las compraventas', 'Registradores', '');
d('P03', 118.5, '2025', 115.0, '2023', 'índice 2021 = 100', 'Ministerio de Transportes', '');
d('P04', 1530.0, '2025', 1398.0, '2023', 'miles de ocupados', 'INE, EPA', 'En 2007: unos 2.700.');
d('R01', 38994, '2025', 34821, '2023', '€/hogar/año', 'INE, ECV', 'Nominal.');
d('Q08', 750000, '2021-2025', null, null, 'viviendas', 'Banco de España (junio de 2026)', 'Sin dato comparable anterior.');
d('G01', 290000, '2023', null, null, 'viviendas', 'Banco de España', 'El 1,5 % de las viviendas principales.');
d('Q05', 341001, 'mayo de 2026', null, null, 'viviendas', 'INE, estadística experimental', 'El 1,28 % del parque; serie estacional, sin tendencia calculada.');
d('A08', 52.8, '2023', null, null, '% del alquiler de particulares', 'Ministerio de Consumo y CSIC', 'En manos de quienes alquilan dos o más viviendas. El Banco de España da un máximo del 7 % para quienes tienen más de diez.');
d('D07', 50.2, '2025', 45.7, '2023', '% de jóvenes de 25 a 34 años que viven con sus padres', 'Eurostat', 'En 2007: 38,9 %.');
d('A06', 18317, '2025', 19676, '2023', 'lanzamientos por impago de alquiler', 'CGPJ', 'En 2019: 36.468. Desde 2020 la moratoria suspende parte.');
d('A05', 8.5, '2023', 7.3, '2021', 'meses', 'CGPJ, juicios verbales arrendaticios', 'En 2014: 4,5 meses. Mide hasta la resolución, no hasta el lanzamiento.');
d('A07', 14875, '2025', 15289, '2023', 'hechos conocidos', 'Ministerio del Interior', 'Suma allanamiento y usurpación; incluye inmuebles de bancos y fondos.');
d('M01', 42.6, 'enero de 2026', null, null, '% que cita la vivienda como problema', 'CIS', 'Máximo de la serie; el anterior fue 37,3 % en 2007.');
d('S04', 171.0, '4T 2025', 154.6, '4T 2023', '€/m²', 'Ministerio de Vivienda', 'Máximo: 285,0 en 2007.');
d('G04', 0.2, '2024', 0.2, '2022', '% del PIB', 'Eurostat', 'La media de la UE llegó al 0,7 % en 2023.');
d('P08', 24384, '2025', 22328, '2023', 'viviendas/año', 'Ministerio de Transportes, visados de reforma', 'Rótulo de la columna inferido.');

// Resultados que muestra el simulador, agrupados por dimension, con el sentido que supone una mejora
// Cada grupo es un actor; para cada variable se indica el sentido que le supone una mejora.
const resultados = [
  { dimension: 'Hogares que alquilan para vivir', variables: [['O01', 'baja'], ['A02', 'baja'], ['A01', 'sube'], ['A09', 'baja'], ['O08', 'baja']] },
  { dimension: 'Jóvenes y hogares que quieren comprar', variables: [['O03', 'baja'], ['O02', 'baja'], ['B01', 'baja']] },
  { dimension: 'Personas vulnerables', variables: [['O04', 'baja'], ['G01', 'sube'], ['A11', 'baja']] },
  { dimension: 'Propietarios que alquilan', variables: [['A04', 'baja'], ['F08', 'sube']] },
  { dimension: 'Promotores y constructores', variables: [['P01', 'sube'], ['P02', 'sube']] },
  { dimension: 'Turistas', variables: [['Q05', 'sube'], ['Q11', 'baja']] },
  { dimension: 'Estudiantes y residentes temporales', variables: [['Q06', 'sube']] },
  { dimension: 'Conjunto de la sociedad', variables: [['Q08', 'baja'], ['O05', 'baja']] }
];
// Escenarios: tendencia que se fija en cada variable (1 sube, -1 baja).
// «lectura» dice como se ha traducido la medida a variables del mapa; «magnitud», lo que se sabe de su tamano.
const escenarios = [
  { id: 'E1', nombre: 'Recuperar para residentes los pisos turísticos', fija: { L03: 1 }, propia: true,
    lectura: 'Retirar la licencia a las viviendas turísticas que antes fueron alquiler habitual. En el mapa equivale a aumentar la restricción al alquiler turístico: el mapa no distingue la restricción selectiva de la general, que difieren en tamaño y en riesgo legal, no en sentido.',
    supuesto: 'Ninguno añadido: la medida actúa sobre una variable de decisión que ya está en el mapa.',
    magnitud: '341.001 viviendas turísticas en mayo de 2026, el 1,28 % del parque (INE). Muy concentradas: Marbella 6,97 %, Málaga 3,17 %, Sevilla 2,12 %, Barcelona 1,02 %, Madrid 0,71 %. El déficit acumulado es de unas 750.000 viviendas (Banco de España). Estudio de Barcelona: efecto medio sobre los alquileres cercano al 2 %, y de unos 7 puntos en los barrios más turísticos.' },
  { id: 'E2', nombre: 'Impedir que los fondos compren edificios enteros para uso turístico', fija: { Q05: -1, F07: -1 }, propia: true,
    lectura: 'Se representa por sus dos efectos directos: menos viviendas de uso turístico y menos capital institucional en vivienda.',
    supuesto: 'Que la medida reduce de verdad ambas cosas. No se ha localizado ninguna afirmación ni dato sobre cuántos edificios se compran para ese fin, así que el tamaño del efecto es desconocido.',
    magnitud: 'No existe ninguna cifra de edificios residenciales completos convertidos en Madrid, Valencia, Sevilla, Palma o San Sebastián. Málaga: los edificios de apartamentos turísticos pasan de 228 en 2022 a 354 a comienzos de 2026 (visto en prensa; no dice cuántos eran residenciales). Barcelona: 13 licencias de edificios enteros, con 783 plazas. El capital institucional ronda las 110.000 viviendas en alquiler, cerca del 5 % de la oferta (estimación de una consultora del sector).' },
  { id: 'E3', nombre: 'Proteger del impago al pequeño propietario', fija: { L13: 1 }, propia: true,
    lectura: 'Garantía pública de cobro para los propietarios que no son grandes tenedores. Ya es una variable del mapa, porque existen programas así y uno está evaluado.',
    supuesto: 'Ninguno añadido. La evidencia distingue dos diseños: cuando la Administración paga la renta al propietario, capta vivienda; cuando solo ofrece un seguro de impago, apenas.',
    magnitud: 'País Vasco: el programa que paga la renta (Bizigune) tenía 7.375 viviendas a cierre de 2024, a unos 4.850 € por vivienda y año; el que solo asegura el impago (ASAP) captó 278, el 35 % de su objetivo. Las ciudades de más de 250.000 habitantes tienen 403.073 viviendas vacías, el 7,5 % de su parque (INE, Censo de 2021). El 76 % de los arrendadores teme no cobrar, y el 76 % no ha tenido problemas con su inquilino en cinco años (OCU, 2023).' },
  { id: 'E4', nombre: 'Dotar a ayuntamientos y comunidades para alojar en el propio barrio', fija: { G01: 1 }, propia: true,
    lectura: 'Presupuesto finalista para que las administraciones cercanas compren, alquilen o rehabiliten viviendas y alojen a las personas vulnerables donde ya viven. Se representa por su resultado: crece el parque de alquiler social.',
    supuesto: 'Que la dotación se convierte en viviendas disponibles, lo que depende de la capacidad de ejecución de la Administración. El mapa no distingue el barrio: no puede decir nada sobre el arraigo.',
    magnitud: 'El parque de alquiler social ronda las 290.000 viviendas, el 1,5 % de las principales; converger con la media europea exigiría cerca de 1,5 millones más (Banco de España). En 2025 se calificaron 12.858 viviendas protegidas (Ministerio de Vivienda).' },
  { id: 'E5', nombre: 'Paquete: E1 + E3 + E4', fija: { L03: 1, L13: 1, G01: 1 }, propia: true,
    lectura: 'Las tres medidas anteriores aplicadas a la vez.', supuesto: 'El de E4.', magnitud: '' },
  { id: 'E6', nombre: 'El mismo paquete con reglas estables', fija: { L03: 1, L13: 1, G01: 1, L10: -1 }, propia: true,
    lectura: 'El paquete E5 acompañado de un compromiso de no cambiar las reglas del alquiler durante un periodo largo.', supuesto: 'El de E4.', magnitud: '' },
  { id: 'R1', nombre: 'Referencia: topar el alquiler', fija: { L01: 1 }, lectura: 'Ampliar las zonas con tope al precio del alquiler habitual.', supuesto: 'Ninguno.', magnitud: '' },
  { id: 'R2', nombre: 'Referencia: ayudas a la demanda', fija: { L05: 1 }, lectura: 'Más bono de alquiler y más avales a la compra.', supuesto: 'Ninguno.', magnitud: '' },
  { id: 'R3', nombre: 'Referencia: invertir en vivienda protegida', fija: { G04: 1 }, lectura: 'Más inversión pública en promover vivienda protegida.', supuesto: 'Ninguno.', magnitud: '' },
  { id: 'R4', nombre: 'Referencia: agilizar el suelo', fija: { S02: -1 }, lectura: 'Reducir los plazos de tramitación urbanística.', supuesto: 'Ninguno.', magnitud: '' }
];

// ---------------------------------------------------------------- Palancas para la busqueda de paquetes
// Cada palanca es una variable que una administracion o la banca puede mover, con el texto de cada sentido.
// «supuesto» = la medida no es una variable del mapa y se representa por su efecto directo.
const palancas = [
  { id: 'L01', sube: 'ampliar las zonas con tope al precio del alquiler', baja: 'retirar los topes al precio del alquiler' },
  { id: 'L02', sube: 'reforzar la protección legal del inquilino frente al desahucio', baja: 'reducir la protección legal del inquilino que hoy recae sobre el propietario' },
  { id: 'L03', sube: 'restringir las viviendas de uso turístico', baja: 'liberalizar las viviendas de uso turístico' },
  { id: 'L04', sube: 'ampliar la rebaja fiscal al propietario que alquila como vivienda habitual', baja: 'reducir la rebaja fiscal al propietario que alquila' },
  { id: 'L05', sube: 'aumentar las ayudas al alquiler y los avales a la compra', baja: 'reducir las ayudas a la demanda' },
  { id: 'L07', sube: 'mejorar el trato fiscal de socimis y fondos que invierten en vivienda', baja: 'retirar las ventajas fiscales de socimis y fondos' },
  { id: 'L08', sube: 'aplicar un recargo fiscal a la vivienda vacía', baja: 'suprimir los recargos a la vivienda vacía' },
  { id: 'G04', sube: 'aumentar la inversión pública en vivienda protegida', baja: 'reducir la inversión pública en vivienda' },
  { id: 'F03', sube: 'endurecer los criterios para conceder hipotecas', baja: 'relajar los criterios para conceder hipotecas' },
  { id: 'L13', sube: 'crear una garantía pública que pague o asegure la renta al pequeño propietario', baja: 'retirar los programas de garantía pública al arrendador' },
  { id: 'G01', sube: 'dotar a ayuntamientos y comunidades para alojar a las personas vulnerables en su barrio', supuesto: 'que la dotación se convierte en viviendas de alquiler social' },
  { id: 'S02', baja: 'acortar los plazos de tramitación urbanística', supuesto: 'que una reforma administrativa acorta de verdad los plazos' },
  { id: 'L10', baja: 'pactar un periodo largo sin cambios en las reglas del alquiler', supuesto: 'que el pacto se cumple' }
];

// ================================================================ Cuarta revision (12/10/2026)
// A peticion de JC: tres vias de conversion a uso turistico (vivienda vacia o heredada; alquiler no renovado; edificio
// vendido a un inversor), demanda turistica, expulsion sin juicio, fondos y socimis, y criterio de coste social.
// Tres busquedas de evidencia. Lo que no tiene fuente entra como hipotesis H() y no se calcula.
Object.assign(F, {
  F79: 'https://www.bde.es/f/webbe/SES/Secciones/Publicaciones/PublicacionesSeriadas/DocumentosOcasionales/24/Fich/do2432.pdf',
  F80: 'https://www.exceltur.org/wp-content/uploads/2022/11/ReviTUR-EXCELTUR-Documento-completo-221122.pdf',
  F81: 'https://idrabcn.com/wp-content/uploads/2024/12/INFORME-ALQUILER-INSEGURIDAD_IDRA.pdf',
  F82: 'https://www.publico.es/sociedad/especulacion-inmobiliaria-pone-peligro-1-000-edificios-madrid-fuera-fondos-buitres-barrios.amp.html',
  F83: 'https://www.elnacional.cat/oneconomia/ca/economia/compravenda-edificis-barcelona-baixar-inversors-31-despres-regulacio-lloguer-2025_1644814_102.html',
  F84: 'https://documentos.fedea.net/pubs/dt/2026/dt2026-02.pdf',
  F85: 'https://www.aeaweb.org/conference/2024/program/paper/dnQ4nAR7',
  F86: 'https://govern.cat/gov/notes-premsa/848548/la-regulacio-del-lloguer-consolida-la-moderacio-de-preus-i-impulsa-el-creixement-del-parc-de-lloguer-habitual-a-catalunya',
  F87: 'https://www.bde.es/f/webbde/SES/Secciones/Publicaciones/PublicacionesSeriadas/DocumentosOcasionales/20/Fich/do2002.pdf'
});
s('Banco de España, Documento Ocasional 2432', 'INST', 'I', '2024-10', L, 'estas alternativas presentarían elevadas rentabilidades esperadas para los propietarios, además de un marco regulatorio más laxo que el alquiler residencial, incentivando a los propietarios al desplazamiento de la oferta', 'Mayor rentabilidad del uso turístico y de temporada → la oferta se desplaza a esos usos', 'F79');   // S122
s('Exceltur, estudio ReviTUR', 'TUR', 'M', '2022-11-22', L, 'Este diferencial de rentabilidad económica […] supone el principal factor explicativo de la fuerza del fenómeno de conversión de viviendas en alojamientos turísticos', 'Diferencia de rentabilidad → conversión de viviendas en alojamiento turístico', 'F80');   // S123
s('Banco de España, Informe Anual 2025', 'INST', 'I', '2026-06', L, 'Las limitaciones regulatorias a este tipo de actividad en algunos territorios o el desplazamiento de estas viviendas a usos alternativos —como, por ejemplo, el alquiler de temporada— podrían explicar la disminución de esta actividad', 'Restricción al uso turístico → desvío al alquiler de temporada (en condicional)', 'F74');   // S124
s('IDRA, «Vivir de alquiler: inseguridad garantizada por ley»', 'ECOC', 'R', '2024-12', L, 'Aunque solo el 1,5% de los desplazamientos forzosos se deben a una orden judicial de desahucio, el 28,5% restante corresponde a lo que se denomina "desahucios invisibles"', 'La mayor parte de las expulsiones de inquilinos no pasa por el juzgado', 'F81');   // S125
s('Sindicato de Inquilinas de Madrid', 'MOV', 'R', '2024-05-16', P, 'Más de 1.000 edificios de propiedad vertical están amenazados y cerca de 21.500 personas están en riesgo de desahucio y expulsión', 'Compra de edificios enteros por inversores → expulsión de sus inquilinos', 'F82');   // S126
s('Carles Donat, Observatori Metropolità de l’Habitatge', 'INST', 'I', '2026-05-25', L, 'Es veu un trencament de tendència', 'Regulación del alquiler → menos compraventas de edificios enteros', 'F83');   // S127
s('Hidalgo y Velázquez, Fedea', 'ECOM', 'M', '2026-02', L, 'regulation selects against casual hosts while leaving professionalized operators largely intact', 'Restricción al uso turístico → salen los anfitriones ocasionales y quedan los profesionales', 'F84');   // S128
s('Francke, Hans, Korevaar y van Bekkum', 'ACAD', 'I', '2023-06-15', L, 'The ban did increase rental prices, consistent with reduced rental housing supply.', 'Prohibir comprar para alquilar → menos oferta de alquiler y alquiler más caro', 'F85');   // S129
s('Govern de la Generalitat de Catalunya', 'TERR', 'R', '2026-07-13', L, "La limitació dels preus del lloguer no només no redueix l'oferta d'habitatge, sinó que les dades apunten a l'ampliació del mercat de lloguer.", 'El tope al alquiler no reduce la oferta (niega el vínculo)', 'F86');   // S130
s('Banco de España, Documento Ocasional 2002', 'INST', 'I', '2020', L, 'reduce la probabilidad y los costes de un desplazamiento inesperado', 'Protección del inquilino → menos desplazamientos forzosos', 'F87');   // S131

v('T01', 'Llegadas de turistas internacionales', 'Turistas no residentes que llegan a España en un año.', 'exogena', 'turistas/año', 'país', 'Movimientos turísticos en fronteras (FRONTUR)', 'INE', 'C06');
v('Q12', 'Ventaja de ingresos del alquiler turístico', 'Cuántas veces ingresa una vivienda en alquiler turístico lo que ingresaría en alquiler habitual.', 'auxiliar', 'veces', 'municipio', NM + ' de forma periódica; Exceltur la estimó en 2,53 veces en junio de 2022 para 20 ciudades', '', 'C06');
v('Q13', 'Viviendas vacías o heredadas que pasan a uso turístico', 'Viviendas sin residentes que su dueño anuncia como turísticas en lugar de venderlas o alquilarlas.', 'flujo', 'viviendas/año', 'municipio', NM, '', 'C06');
v('Q14', 'Alquileres habituales que pasan a uso turístico', 'Viviendas alquiladas a residentes cuyo contrato no se renueva para anunciarlas como turísticas.', 'flujo', 'viviendas/año', 'municipio', NM, '', 'C06');
v('Q15', 'Compraventas de edificios residenciales enteros', 'Edificios de viviendas que cambian de dueño en bloque.', 'flujo', 'edificios/año', 'municipio', 'Operaciones notificadas al Ayuntamiento de Barcelona a efectos de tanteo; sin recuento en otras ciudades', 'Observatori Metropolità de l’Habitatge', 'C03');
v('O09', 'Mudanzas forzosas de inquilinos sin orden judicial', 'Inquilinos que dejan su vivienda por no renovación, subida inasumible o presiones, sin pasar por el juzgado.', 'auxiliar', '% de las últimas mudanzas de inquilinos', 'municipio', 'Encuestas en Barcelona (2022) y Madrid (2023); el INE lo pregunta, sin tabla localizada', 'IDRA', 'C11');
v('L15', 'Compra preferente de vivienda por la Administración', 'Uso del tanteo y retracto para incorporar viviendas y edificios al parque público.', 'decision', 'viviendas adquiridas/año', 'país', 'Viviendas adquiridas por tanteo y retracto en Cataluña', 'Generalitat de Catalunya', 'C10', { dueno: 'Comunidades autónomas y ayuntamientos' });
v('L16', 'Límite a la compra de vivienda por inversores', 'Restricciones a comprar vivienda existente para alquilarla o cambiarle el uso.', 'decision', 'índice', 'país', NM, '', 'C10', { dueno: 'Estado y comunidades autónomas' });

// --- Demanda turistica y ventaja de ingresos
e('T01', 'Q12', '+', 'Más visitantes para un número parecido de viviendas: cada vivienda turística se ocupa más noches.', '1-3 años', 'D1', [], 'INE (ficheros leídos): los turistas internacionales pasan de 83,5 millones en 2019 a 96,8 en 2025 (+15,9 %) y las noches en alojamientos de plataformas de 105,6 a 189,5 millones (+79 %), con un número de viviendas turísticas parecido (321.496 en agosto de 2020; 341.001 en mayo de 2026).', 'Dato compatible, no estimación. Las cifras de plataformas de 2024-2025 parecen calculadas con otro método que las anteriores. No existe ningún estudio español que estime el efecto de las llegadas sobre el número de viviendas turísticas.');
e('Q12', 'Q05', '+', 'Si el uso turístico rinde más que el alquiler habitual, más viviendas pasan a él.', '1-3 años', 'D1', ss(122, 123), 'Exceltur, ReviTUR (2022, leído en la fuente; patronal turística, parte interesada): una vivienda tipo ingresa 2.674 €/mes en turístico frente a 1.056 €/mes en larga estancia, media de 20 ciudades en junio. Garcia-López et al. (documento de trabajo de 2019): en Barcelona en 2015, diez noches al mes igualaban el alquiler mensual. Con la pandemia las plazas cayeron un 31,4 % entre 2019 y 2021 y volvieron en 2022 (ReviTUR). ' + REF + 'Sídney, la prima del alquiler de corta estancia baja del 106 % al 78 % a medida que los caseros se pasan a él (Hill et al., 2023, vía Fedea).', 'Ningún estudio español estima cuánto responde la conversión a la diferencia de ingresos. La cifra de Exceltur es de ingresos brutos y de temporada alta.');
// --- Las tres vias de entrada al uso turistico. Ninguna tiene medicion: nadie ha contado en España que eran antes las viviendas turisticas.
C('Q13', 'Q05', '+', 'Cada vivienda vacía o heredada que se anuncia como turística se suma al parque turístico.', 'inmediato');
C('Q14', 'Q05', '+', 'Cada alquiler habitual que pasa a turístico se suma al parque turístico.', 'inmediato');
C('Q14', 'A01', '-', 'Cada alquiler habitual que pasa a turístico sale de la oferta para residentes.', 'inmediato');
C('Q14', 'O09', '+', 'El inquilino al que no se renueva para cambiar el uso tiene que irse.', 'inmediato');
H('Q12', 'Q13', '+', 'Quien hereda o tiene una vivienda vacía la anuncia como turística si rinde más que venderla o alquilarla.', '1-3 años', 'No existe ninguna medición del uso que se da a la vivienda heredada: se inscriben unas 208.000 herencias de vivienda al año (INE, 2025) y Fotocasa solo distingue venta de alquiler. Una encuesta de PwC para Airbnb (550 anfitriones, fuente de parte) clasifica el 52 % de los alojamientos como segunda residencia de uso ocasional, sin preguntar qué eran antes.');
H('Q12', 'Q14', '+', 'El propietario no renueva al inquilino para pasar la vivienda a uso turístico.', '1-3 años', 'Nadie ha contado los contratos no renovados por este motivo. Indicio indirecto: en Barcelona, 100 anuncios más reducen en 80 los hogares del área (Garcia-López et al.), sin distinguir inquilinos de propietarios.');
H('Q12', 'Q15', '+', 'Los inversores compran edificios enteros donde el cambio de uso rinde más.', '1-3 años', 'Sin dato del uso al que pasan los edificios comprados.');
// Q15 -> Q05: ver la quinta revision
// --- Expulsion sin juicio
e('Q15', 'O09', '+', 'Quien compra el edificio entero no renueva los contratos para vaciarlo.', '1-3 años', 'D1', ss(126, 132, 133), 'Bonshoms (tesis doctoral, Universidad de Leeds, 2023; leídos el resumen y un capítulo): inversores locales medianos compran edificios en zona céntrica, desplazan a los inquilinos y reforman para vender o alquilar por días. Casos documentados en prensa: Tribulete 7 (Madrid), comprado en bloque en 2024, donde de 52 familias quedan 15 (El Salto, octubre de 2026, medio afín al movimiento); Casa Orsola (Barcelona), con desahucios señalados para 2025 y paralizados al comprar el edificio el Ayuntamiento y una fundación por 9,2 M€ (eldiario.es).', 'Son casos, no una medición: nadie ha contado cuántos inquilinos salen tras estas ventas. La cifra de Madrid es una estimación de riesgo del Sindicato de Inquilinas, sin método publicado. No se ha leído la versión de los compradores.');
e('L01', 'Q15', '-', 'Con la renta topada, comprar un edificio para subir los alquileres rinde menos.', '1-3 años', 'D1', ss(127), 'Observatori Metropolità de l’Habitatge (visto en prensa): las compraventas de edificios notificadas al Ayuntamiento de Barcelona pasan de 217 en 2024 a 149 en 2025 (−31 %); fueron 202, 167 y 212 en 2021-2023.', 'Sin contrafactual: atribuir la caída a la regulación es interpretación del Observatori. Solo Barcelona.');
e('A02', 'O09', '+', 'Cuando la renta sube más de lo que el hogar puede pagar, se va sin que haya juicio.', '1-3 años', 'D1', [], 'IDRA (2024, leído en la fuente; instituto próximo al movimiento inquilino): el 30,8 % de las últimas mudanzas de inquilinos en Madrid y el 31,6 % en Barcelona fueron forzosas, y solo el 1,5 % por orden judicial. Área metropolitana de Barcelona (encuesta de cohesión urbana de 2025, vista en prensa): los cambios de vivienda por motivos económicos o forzados pasan del 5,7 % en 1995 al 23,9 % en 2025.', 'La encuesta de IDRA no es probabilística y no separa la subida de renta de la no renovación ni de las presiones. El INE pregunta por el fin de contrato como motivo de mudanza, pero no se ha localizado la tabla.');
e('L02', 'O09', '-', 'Contratos más largos y prórrogas obligatorias dejan menos ocasiones de no renovar.', '1-3 años', 'D1', ss(131), REF + 'San Francisco (Diamond, McQuade y Qian, 2019; solo leído el resumen): el control de rentas con protección frente al desalojo reduce un 20 % la movilidad de los inquilinos y su salida de la ciudad. Escocia: tras eliminar en 2017 el desahucio sin causa, el 80 % de los inquilinos encuestados confía en poder quedarse (estudio RentBetter, visto en la nota de su financiador).', 'No existe evaluación de la reforma española de 2019, que alargó los contratos de 3 a 5 o 7 años. El mismo estudio de San Francisco halla que los caseros reducen la oferta de alquiler un 15 %.');
H('O09', 'O04', '+', 'Quien es expulsado sin alternativa acaba en vivienda peor, hacinado o sin hogar.', '1-3 años', 'IDRA: solo entre el 25 % y el 28 % de quienes se mudan van a un barrio de renta menor.');
// --- Instrumentos
e('L15', 'G01', '+', 'Cada vivienda adquirida por tanteo y retracto pasa al parque público.', '1-3 años', 'D1', [], 'Generalitat de Catalunya, informe del sector de la vivienda de 2024 (leído en la fuente): 662 viviendas adquiridas en 2024 y 544 en 2023, con un gasto de 49,9 y 43,8 millones de euros; 4.746 viviendas administradas procedentes de tanteo y retracto. Ayuntamiento de Barcelona: 21 fincas con 291 viviendas.', 'Se ejerce en torno al 2 % de los expedientes abiertos. En Cataluña recae sobre viviendas procedentes de ejecuciones hipotecarias, no sobre edificios con inquilinos. En la Comunitat Valenciana no se adquirió ninguna en 2024, por falta de presupuesto y de medios.');
H('L15', 'O09', '-', 'Si la Administración compra el edificio, los inquilinos se quedan.', 'inmediato', 'Un solo caso documentado (Casa Orsola), y fue una compra negociada, no un tanteo.');
e('L16', 'F10', '-', 'Si se limita comprar vivienda existente como inversión, los inversores compran menos.', '1-3 años', 'D1', [], REF + 'Países Bajos (Francke, Hans, Korevaar y van Bekkum, 2023; leídos resumen e introducción): la prohibición de comprar para alquilar redujo en torno a un 75 % las compras de inversores en las viviendas afectadas y elevó unos 14 puntos la cuota de primeros compradores.', 'El mismo estudio: los precios de venta no variaron y los alquileres subieron un 4 % en Róterdam (S129). Un año de datos y otro país. En España no ha llegado a aplicarse ninguna medida de este tipo.');
e('F10', 'B01', '+', 'La demanda de los inversores institucionales se suma a la de los hogares.', '1-3 años', 'D2', [], 'Bandoni et al., Banco Central Europeo, documento de trabajo 3026 (leído el resumen): un aumento de la demanda de inversores institucionales tiene un efecto «positive and persistent» sobre el crecimiento del precio de la vivienda; modelo vectorial y panel regional de ocho países de la zona euro, España incluida.', 'Mide precios de compra, no alquileres ni desahucios. Sin estimación separada para España.');
e('F10', 'A02', '+', 'Los propietarios institucionales suben la renta de las viviendas que compran más que otros caseros.', '1-3 años', 'D1', ss(35, 135), 'Tres estudios de caso españoles revisados por pares. Janoschka et al. (2020): en los bloques de Carabanchel comprados por Blackstone, los ingresos por alquiler suben un 38 % entre 2014 y 2017. Yrigoy (2021): en Tres Cantos, la renta media pasa de 560 a 800 €/mes al acabar la protección. Martínez y Gil (2022): subidas «around 100%» al vencer los contratos. ' + REF + 'Irlanda (McCarthy, Banco Central de Irlanda, 2024; estimación causal): suben el alquiler 4,1 puntos más que otros caseros en viviendas comparables tras la compra.', 'Son casos, sin estimación para el conjunto de España. No contradice que los institucionales añadan oferta, que es otra relación del mapa: para Estados Unidos, Coven (2025) estima que amplían la oferta de alquiler y bajan su precio. El peso de las sociedades es del 8,1 % del alquiler habitual (Banco de España, 2021).');
e('L03', 'Q06', '+', 'Las viviendas que dejan el uso turístico se desvían al alquiler de temporada.', '1-3 años', 'D1', ss(124), 'Ministerio de Vivienda (nota del 2 de febrero de 2026, leída): de 412.253 solicitudes de registro de alquiler de corta duración, el 22 % son de temporada; en la Comunidad de Madrid, 21.978 de 26.355 (83 %). Fedea, DT 2026-02: los operadores profesionales arbitran entre la corta y la media estancia.', 'El Banco de España lo plantea como posibilidad, sin cifra. Nadie ha medido en España a qué uso pasan las viviendas que dejan de ser turísticas. ' + REF + 'la evidencia está dividida: los alquileres bajan un 2-3 % en Irvine, Los Ángeles y Berlín (2016), no cambian en Santa Mónica ni en Nueva York el primer año, y suben en Sídney.');
e('L09', 'Q06', '-', 'Si la temporada también se regula, deja de ser una vía de escape.', 'meses', 'D1', [], 'Observatori Metropolità de l’Habitatge, informe semestral n.º 4 (abril de 2026, leído completo): en Barcelona, 1.282 contratos de temporada nuevos en el cuarto trimestre de 2025, un 53 % menos que un año antes, coincidiendo, según el informe, con la ley catalana 11/2025, de 29 de diciembre.', 'El propio Observatori advierte de que no se puede establecer una relación directa entre ese descenso y el aumento de contratos permanentes. Junyent: al regularla, los pisos se vendieron o quedaron vacíos (S055).');

Object.assign(datos, {
  T01: { valor: 96803894, anio: '2025', previo: 85169050, anioPrevio: '2023', unidad: 'turistas/año', fuente: 'INE, FRONTUR', nota: 'En 2019: 83,5 millones. Noches en alojamientos de plataformas: 189,5 millones en 2025 frente a 105,6 en 2019.' },
  Q15: { valor: 149, anio: '2025', previo: 212, anioPrevio: '2023', unidad: 'edificios/año en Barcelona', fuente: 'Observatori Metropolità de l’Habitatge, visto en prensa', nota: 'En 2024: 217. No hay recuento en otras ciudades.' },
  O09: { valor: 30.8, anio: '2023', previo: null, anioPrevio: null, unidad: '% de las últimas mudanzas de inquilinos (Madrid)', fuente: 'IDRA, encuesta no probabilística', nota: 'Barcelona, 2022: 31,6 %. Solo el 1,5 % fue por orden judicial.' },
  L15: { valor: 662, anio: '2024', previo: 544, anioPrevio: '2023', unidad: 'viviendas adquiridas en Cataluña', fuente: 'Generalitat de Catalunya', nota: 'Gasto de 49,9 millones de euros en 2024.' }
});
resultados.find(g => g.dimension === 'Hogares que alquilan para vivir').variables.push(['O09', 'baja']);

// Criterio de coste social (JC, 12/10/2026): se quiere el mayor numero de personas viviendo con dignidad y tranquilidad,
// no el mayor beneficio de quien ofrece. Cuentan solo los resultados que describen como viven las personas.
// Quedan fuera del objetivo, y se informan aparte: rentabilidad y riesgo del arrendador, produccion de vivienda (es un medio:
// si cae, sus efectos llegan al precio y al deficit, que si cuentan), los dos resultados de los turistas y las viviendas en
// alquiler no habitual, que son a la vez el alojamiento del residente temporal y la via por la que se esquiva la regulacion.
const criterioSocial = { resultados: ['O01', 'A02', 'A01', 'A09', 'O08', 'O09', 'O03', 'O02', 'B01', 'O04', 'G01', 'A11', 'Q08', 'O05'] };

// Familias de medidas, para poner a prueba la tesis de que intervenir el mercado da mejor resultado social que dejarlo actuar.
// Intervencion: regula, limita, grava o sustituye al mercado. Mercado: desregula o incentiva a la oferta privada.
const FAM = { L01: ['intervencion', 'mercado'], L02: ['intervencion', 'mercado'], L03: ['intervencion', 'mercado'], L04: ['mercado', null], L05: ['intervencion', 'mercado'],
  L07: ['mercado', 'intervencion'], L08: ['intervencion', 'mercado'], G04: ['intervencion', 'mercado'], F03: ['intervencion', 'mercado'], L13: ['intervencion', 'mercado'],
  G01: ['intervencion', null], S02: [null, 'mercado'], L10: [null, 'mercado'] };
palancas.push(
  { id: 'L09', sube: 'regular el alquiler de temporada' },
  { id: 'L15', sube: 'ampliar la compra preferente de viviendas y edificios por la Administración' },
  { id: 'L16', sube: 'limitar la compra de vivienda por inversores' });
Object.assign(FAM, { L09: ['intervencion', null], L15: ['intervencion', null], L16: ['intervencion', null] });
for (const p of palancas) { if (!FAM[p.id]) throw new Error('Palanca sin familia: ' + p.id); if (FAM[p.id][0]) p.familiaSube = FAM[p.id][0]; if (FAM[p.id][1]) p.familiaBaja = FAM[p.id][1]; }

escenarios.push(
  { id: 'E7', nombre: 'Frenar la conversión turística y la compra inversora, proteger frente a la expulsión y contener el alquiler', fija: { L03: 1, L09: 1, L16: 1, L07: -1, L02: 1, L01: 1, L15: 1 }, propia: true,
    lectura: 'El paquete que plantea JC: restringir las viviendas turísticas, regular también el alquiler de temporada para que no sirva de escape, limitar la compra de vivienda por inversores y retirar las ventajas fiscales de socimis y fondos, reforzar la protección del inquilino frente a la no renovación y el desahucio, ampliar las zonas con tope al alquiler y usar la compra preferente de la Administración cuando se vende un edificio.',
    supuesto: 'Ninguno añadido: las siete son variables de decisión del mapa. El mapa no puede dirigir cada medida a una de las tres vías de conversión (vivienda vacía o heredada, alquiler no renovado, edificio vendido a un inversor), porque ninguna de las tres está medida.',
    magnitud: '341.001 viviendas turísticas en mayo de 2026, un 10,7 % menos que un año antes (INE). En Barcelona, 149 compraventas de edificios enteros en 2025, frente a 217 en 2024. Cataluña adquirió 662 viviendas por tanteo y retracto en 2024, por 49,9 millones de euros. En Madrid y Barcelona, cerca del 31 % de las últimas mudanzas de inquilinos fueron forzosas y solo el 1,5 % por orden judicial (IDRA, encuesta no probabilística). Se inscriben unas 208.000 herencias de vivienda al año, sin dato de su uso posterior.' },
  { id: 'E8', nombre: 'El mismo paquete, con vivienda pública y suelo', fija: { L03: 1, L09: 1, L16: 1, L07: -1, L02: 1, L01: 1, L15: 1, G04: 1, S02: -1 }, propia: true,
    lectura: 'El paquete E7 acompañado de más inversión pública en vivienda protegida y de plazos urbanísticos más cortos, para actuar también sobre la falta de construcción.',
    supuesto: 'Que una reforma administrativa acorta de verdad los plazos.', magnitud: 'En 2025 se iniciaron 137.330 viviendas y se calificaron 12.858 protegidas (Ministerio de Vivienda); el déficit acumulado ronda las 750.000 (Banco de España). La inversión pública en vivienda es el 0,2 % del PIB (Eurostat, 2024).' });
Object.assign(esquema.posExtra, { T01: [60, 80], Q12: [60, 220], Q15: [1130, 70], O09: [1370, 605], L15: [1400, 290], L16: [690, 70], L02: [1400, 110], L07: [560, 70] });

// ---------------------------------------------------------------- Premisas del decisor (JC, 12/10/2026)
// No son evidencia: son lo que JC sostiene sobre tres puntos que nadie ha medido. No entran en el calculo base.
// El motor repite el calculo de coste social «si las premisas fueran ciertas» y lo presenta al lado, rotulado.
H('Q15', 'O04', '+', 'Los inquilinos de un edificio comprado por un inversor acaban desahuciados por vía judicial.', '1-3 años', 'Premisa de JC. Lo localizado apunta en otro sentido: en la encuesta de IDRA solo el 1,5 % de las mudanzas forzosas fue por orden judicial, y en Tribulete 7 se habían ido 37 de 52 familias cuando empezaban a llegar las demandas de desahucio.');
H('F10', 'Q05', '+', 'Fondos y socimis destinan las viviendas que compran a alojamiento turístico.', '1-3 años', 'Premisa de JC. No existe ningún dato de viviendas turísticas propiedad de fondos o socimis. En Canarias, el 28 % de las viviendas vacacionales es de empresas (informe autonómico visto en prensa).');
const premisas = {
  nombre: 'Las tres premisas de JC',
  lista: [
    { n: 1, dice: 'Las viviendas que dejan de ser turísticas van sobre todo al alquiler convencional, otras a la venta, y pocas se quedan sin alquilar.', cambia: 'Se retira del cálculo el desvío del uso turístico al alquiler de temporada.', frente: 'Nadie lo ha medido en España. En la Comunidad de Madrid, el 83 % de las solicitudes de registro de corta duración son de temporada, y el Banco de España plantea ese desvío como posible. Fuera, las viviendas volvieron al alquiler en Irvine, Los Ángeles y Berlín, y no en Santa Mónica.' },
    { n: 2, dice: 'Los inquilinos que salen cuando se compra un edificio generan normalmente un expediente de desahucio con intervención judicial.', cambia: 'La compra de edificios enteros pasa a empujar directamente la exclusión residencial.', frente: 'La única medición (IDRA, encuesta no probabilística) dice lo contrario: solo el 1,5 % de las mudanzas forzosas fue por orden judicial. El CGPJ no separa los lanzamientos por fin de contrato de los de impago.' },
    { n: 3, dice: 'Fondos y socimis agravan la escasez y suben el alquiler, porque destinan las viviendas a apartamentos turísticos y no a residencia de larga duración.', cambia: 'La compra de vivienda existente por inversores pasa a aumentar las viviendas turísticas, y los edificios comprados en bloque pasan a uso turístico.', frente: 'No existe ningún estudio causal para España. Las sociedades tienen el 8,1 % del alquiler habitual (Banco de España, datos de 2021), y los promotores institucionales entregaron 15.710 viviendas de alquiler en 2019-2023 (consultora del sector). Irlanda: suben el alquiler 4,1 puntos más que otros caseros. Estados Unidos: aumentan la oferta de alquiler y bajan su precio.' }
  ],
  activa: [['Q15', 'O04'], ['F10', 'Q05'], ['Q15', 'Q05']],
  desactiva: [['L03', 'Q06'], ['F10', 'A01']]
};

// ================================================================ Quinta revision (12/10/2026)
// Cinco busquedas mas: bibliografia sobre fondos y socimis (la conclusion anterior «no existe ningun estudio» era falsa),
// esfuerzo de alquiler por tramo de renta, salarios, segmentos de demanda y alquiler de habitaciones.
Object.assign(F, {
  F88: 'https://etheses.whiterose.ac.uk/id/eprint/33056/',
  F89: 'https://observatoridesca.org/descarrega/legacy/publication/files/fondosinversion_industriadepredadora.pdf',
  F90: 'https://www.publico.es/sociedad/casi-tercio-edificios-esquerra-eixample-unico-propietario.html',
  F91: 'https://eprints.whiterose.ac.uk/id/eprint/142563/1/MJpaper.pdf',
  F92: 'https://www.bde.es/f/webbde/SES/Secciones/Publicaciones/InformesBoletinesRevistas/ArticulosAnaliticos/20/T3/descargar/Fich/be2003-art26.pdf',
  F93: 'https://www.esade.edu/ecpol/es/blog/inquilinos-ricos-esfuerzo-alquiler/'
});
s('Bonshoms Guzmán, tesis doctoral, Universidad de Leeds', 'ACAD', 'I', '2023', L, 'buying prime zone buildings, refurbish them, and convert them into luxury apartments or short-term rentals', 'Inversores locales compran edificios céntricos → salida de los inquilinos y paso a pisos de lujo o alquiler turístico', 'F88');   // S132
s('Observatori DESC, «Los fondos buitre»', 'ECOC', 'R', '2022', P, 'La estrategia turística corresponde a inmobiliarias de inversores locales; los nuevos residentes son muchas veces estacionales', 'Compra de edificios por inversores locales → sustitución de residentes por estacionales y turistas', 'F89');   // S133
s('Associació de Veïns de l’Esquerra de l’Eixample', 'MOV', 'R', 's/f', L, 'Los fondos compran edificios enteros con vecindario, no renuevan los contratos a los vecinos, promueven reformas integrales y acaban sustituyendo los residentes por colivings', 'Compra de edificios enteros → no renovación → paso a residencias compartidas', 'F90');   // S134
s('Janoschka, Alexandri, Orozco y Vives-Miró', 'ACAD', 'I', '2020', L, 'the new investor is able to generate profits and surpluses from rent increases and displacements without any further investment to upgrade flats', 'Compra de viviendas por un fondo → subidas de renta y desplazamiento de inquilinos', 'F91');   // S135
s('Banco de España, Boletín Económico 3/2020', 'INST', 'I', '2020', L, 'podría favorecer un aumento de la oferta de vivienda en alquiler', 'Más actividad residencial de las socimis → más oferta de alquiler (en condicional)', 'F92');   // S136
s('Banco de España, Informe Anual 2025', 'INST', 'I', '2026-06', L, 'constituyendo el alquiler de habitaciones en pisos compartidos una de las principales vías de emancipación de los jóvenes', 'Alquiler inasequible → emancipación compartiendo piso por habitaciones', 'F74');   // S137
s('García Montalvo y Galindo, EsadeEcPol', 'ECOM', 'M', '2026-03-19', L, 'Si el mercado se vuelve más selectivo por escasez de oferta y los hogares con menos recursos quedan fuera, el indicador mejora mecánicamente.', 'Escasez de oferta → quedan fuera los hogares con menos renta → el esfuerzo medido baja', 'F93');   // S138

v('A12', 'Alquiler por habitaciones', 'Viviendas que se alquilan habitación a habitación a personas sin parentesco.', 'stock', 'habitaciones anunciadas', 'municipio', 'Sin cifra oficial; anuncios de portales', 'Idealista, citado por el Consejo de la Juventud', 'C07');
v('A13', 'Sobreprecio de las viviendas que entran al mercado de alquiler', 'Cuánto más caras son las viviendas que entran al alquiler que las ya alquiladas.', 'auxiliar', '%', 'país', 'Prima de entrada', 'Banco de España', 'C07');
v('O10', 'Sobreocupación de las viviendas alquiladas', 'Inquilinos que viven en una vivienda con menos habitaciones de las que corresponden a sus ocupantes.', 'auxiliar', '% de inquilinos de mercado', 'país', 'Tasa de sobreocupación', 'Eurostat', 'C11');

// --- Compra de edificios: ya hay literatura. Segun ella lo hacen inversores locales medianos y socimis pequeñas, no los grandes fondos.
e('Q15', 'Q05', '+', 'Parte de los edificios comprados en bloque se destina a alojamiento turístico.', '1-3 años', 'D1', ss(132, 133), 'Cocola-Gant, Hodkinson y Janoschka (2025, leído en acceso abierto): en Barcelona, el 56 % de las 10.058 viviendas con licencia turística es de personas jurídicas; 382 titulares (8,8 %) reúnen 5.195 licencias (51 %), y más de un tercio de las licencias está en 216 edificios con diez o más. Hubo 3.501 compraventas de viviendas con licencia entre 2016 y 2024.', 'Con las licencias congeladas desde 2014, lo medido es concentración de viviendas que ya eran turísticas, no conversión de alquiler habitual: nadie cuantifica cuántos edificios comprados cambian de uso. Según esta literatura lo hacen inversores locales medianos y socimis pequeñas; ningún propietario supera los 200 apartamentos turísticos en Barcelona.');
e('Q15', 'Q06', '+', 'Parte de los edificios comprados pasa a alquiler de temporada, por habitaciones o a residencias compartidas.', '1-3 años', 'D0', ss(133, 134), '', 'Lo afirman entidades vecinales y sociales, sin recuento. En la Esquerra de l’Eixample, 68 bloques en manos de fondos según la asociación de vecinos (visto en prensa).');
// --- Grandes fondos: compran carteras y operan en alquiler residencial
e('F10', 'O09', '+', 'Tras la compra: contratos cortos, no renovación y sustitución de inquilinos.', '1-3 años', 'D1', ss(135), 'Janoschka et al. (European Urban and Regional Studies, 2020): en los bloques de vivienda pública de Carabanchel comprados por Blackstone, más del 40 % de los inquilinos tenía contratos de menos de un año; describe abandono del mantenimiento, desahucios selectivos y sustitución de inquilinos. Martínez y Gil (Housing Studies, 2022): al vencer los contratos se pedían subidas «around 100%».', 'Estudios de caso de un barrio y de un fondo, sin grupo de comparación. En el registro de la PAH de Barcelona (no representativo), los fondos promueven el 10,7 % de 289 desahucios de 2018-2019 y los particulares el 38,4 %.');
// --- Habitaciones, sobreocupacion, y la distancia entre quien esta dentro y quien quiere entrar
e('A02', 'A12', '+', 'Cuando alquilar un piso entero es inasequible, se alquila una habitación.', '1-3 años', 'D1', ss(137), 'Consejo de la Juventud (Observatorio de Emancipación 2025, con precios de anuncio): alquilar una vivienda en solitario cuesta el 98,7 % del salario de una persona joven y una habitación el 33,6 %; las habitaciones anunciadas aumentan un 85,4 % desde 2022; comparte vivienda el 33,6 % de los jóvenes emancipados en alquiler.', 'Los datos de volumen proceden de un portal inmobiliario. No hay cifra oficial del alquiler por habitaciones.');
e('A12', 'O10', '+', 'Más personas adultas sin parentesco en la misma vivienda.', '1-3 años', 'D1', [], 'Eurostat (ficheros leídos): los inquilinos de mercado en vivienda sobreocupada pasan del 15,4 % en 2021 al 20,5 % en 2025, y los que viven en hogares de tres adultos o más, del 24,2 % al 31,0 %.', 'Evolución simultánea, no estimación: la sobreocupación sube también en las demás formas de tenencia.');
e('A12', 'O01', '-', 'Quien comparte paga solo su habitación, y su esfuerzo medido baja.', '1-3 años', 'D1', [], 'Eurostat: entre 2021 y 2025 la sobrecarga de gasto en vivienda baja en los hogares de varios adultos y apenas entre quienes viven solos (del 20,1 % al 18,7 %). INE, metodología de la Encuesta de Condiciones de Vida: quien alquila una habitación cuenta como hogar inquilino, con el coste de la habitación.', 'Es una mejora del indicador a cambio de espacio. Sin los microdatos no se puede separar de la subida de las rentas bajas: el salario de la décima parte que menos gana sube un 48 % entre 2018 y 2024 (INE).');
H('L09', 'A12', '-', 'Limitar la suma de las rentas de las habitaciones a la del piso entero quita el incentivo a trocear la vivienda.', '1-3 años', 'El Real Decreto-ley 29/2026 lo establece desde el 8 de octubre de 2026; pendiente de convalidación y sin efecto medible todavía.');
H('A01', 'A13', '-', 'Cuanta menos oferta, más se paga por lo que sale al mercado.', '1-3 años', 'El Banco de España mide el sobreprecio, pero no lo relaciona con la oferta.');
e('A13', 'D07', '+', 'Si entrar cuesta mucho más que quedarse, quien no tiene contrato no llega a formar hogar.', '1-3 años', 'D1', [], 'Banco de España, Informe Anual 2025 (leído): los nuevos entrantes «se enfrentan a esfuerzos más elevados en el momento de la firma del contrato». El sobreprecio de entrada sube del 6,2 % en 2020 al 16,5 % en 2024, y los jóvenes de 25 a 34 años que viven con sus padres, del 46,0 % en 2021 al 50,2 % en 2025 (Eurostat).', 'Evolución simultánea, no estimación.');

Object.assign(datos, {
  A12: { valor: 101984, anio: '2025', previo: null, anioPrevio: null, unidad: 'habitaciones anunciadas', fuente: 'Idealista, citado por el Consejo de la Juventud (fuente de parte)', nota: 'Un 85,4 % más que en 2022. Sin cifra oficial.' },
  A13: { valor: 16.5, anio: '2024', previo: 6.2, anioPrevio: '2020', unidad: '% sobre el precio de las ya alquiladas', fuente: 'Banco de España, Informe Anual 2025', nota: '' },
  O10: { valor: 20.5, anio: '2025', previo: 17.5, anioPrevio: '2023', unidad: '% de inquilinos de mercado', fuente: 'Eurostat', nota: 'En 2021: 15,4 %. En 2015: 11,7 %.' },
  R02: { valor: 22723.25, anio: '2024', previo: 20459.60, anioPrevio: '2022', unidad: '€/año, de 25 a 29 años', fuente: 'INE, Encuesta Anual de Estructura Salarial', nota: 'En 2015: 16.046,47.' }
});
datos.O01.nota = 'En 2021: 40,9 %, un pico (ingresos del año de la pandemia). Baja a la vez por tres motivos que no se pueden separar sin microdatos: suben las rentas bajas, se comparte más vivienda y alquilan menos hogares muy pobres. Media de la UE: 18,6 %.';
resultados.find(g => g.dimension === 'Hogares que alquilan para vivir').variables.push(['O10', 'baja']);
criterioSocial.resultados.push('O10');
premisas.lista[2].frente = 'La literatura localizada distingue dos actores. Los grandes fondos (Blackstone, Cerberus) compraron carteras de bancos y vivienda pública en la periferia y las explotan como alquiler residencial, con subidas de renta y rotación de inquilinos; el turismo lo abordan comprando hoteles. Quienes compran edificios céntricos para vaciarlos y pasarlos a turístico, lujo o temporada son inversores locales medianos y socimis pequeñas. En Barcelona, el 56 % de las licencias turísticas es de personas jurídicas, pero ningún propietario supera los 200 apartamentos. Nadie cuantifica las viviendas convertidas.';
Object.assign(esquema.posExtra, { A12: [420, 380], A13: [640, 470], O10: [1250, 700] });

// ---------------------------------------------------------------- Saldo social por personas (JC, 12/10/2026: «haz lo posible, o simula»)
// Es una SIMULACION con una convencion declarada, no un recuento de personas rescatadas. Se reparte a la poblacion afectada en
// tres grupos que no se solapan, cada uno con los resultados sociales que le atañen. La nota de un grupo es
// (resultados que mejoran - resultados que empeoran) / resultados del grupo, entre -1 y +1, y se pondera por sus personas.
// El indice va de -100 (todo empeora para todos) a +100 (todo mejora para todos).
const POB = 49128297;                                  // INE, poblacion a 1/1/2025
const gruposPersonas = [
  { id: 'G1', nombre: 'Personas que viven de alquiler de mercado y no son pobres', personas: Math.round(POB * 0.174 - POB * 0.195 * 0.291),
    calculo: '49.128.297 × 17,4 % en alquiler de mercado (Eurostat, 2025), menos el grupo siguiente.',
    resultados: ['O01', 'A02', 'A09', 'O09', 'O10', 'O05'] },
  { id: 'G2', nombre: 'Personas pobres que viven de alquiler de mercado', personas: Math.round(POB * 0.195 * 0.291),
    calculo: '49.128.297 × 19,5 % en riesgo de pobreza × 29,1 % de ellas en alquiler de mercado (Eurostat, 2025).',
    resultados: ['O01', 'A02', 'A09', 'O09', 'O10', 'O05', 'O04', 'G01', 'A11'] },
  { id: 'G3', nombre: 'Jóvenes de 18 a 34 años que viven con sus padres', personas: Math.round(9345672 * 0.687),
    calculo: '9.345.672 personas de 18 a 34 años (Eurostat, 1/1/2025) × 68,7 % que viven con sus padres. Es un máximo: no todos quieren o pueden emanciparse.',
    resultados: ['O03', 'A01', 'O02', 'B01', 'Q08'] }
];
// Queda sin grupo el desplazamiento de residentes de los centros urbanos (O08): no hay cifra de las personas afectadas.
// No entran los propietarios que residen en su vivienda, a quienes estos resultados no afectan de forma directa.

// ================================================================ Sexta revision (12/10/2026)
// Dos busquedas: inmigracion, trabajo y vivienda; y efecto de la vivienda social.
// Correccion de fondo: la formacion de hogares que sigue a un alquiler mas asequible no es un coste social. Todas las fuentes leidas
// (Banco de España, Defensor del Pueblo, normas estatales, Observatorio Vasco) la tratan como objetivo o beneficio: el hogar que se
// forma es, sobre todo, quien sale del hacinamiento o de casa de sus padres. El mapa la contaba como daño a traves del deficit.
// Desde ahora el deficit es un medio (sus efectos sobre el precio siguen contando) y el resultado social es que haya menos
// hogares que no llegan a formarse.
Object.assign(F, {
  F94: 'https://www.airef.es/wp-content/uploads/2025/09/Documentos-tecnicos-macro-opinion-sostenibilidad/250922_DT_Proyecciones_Demograficas.pdf',
  F95: 'https://www.bde.es/f/webbe/SES/Secciones/Publicaciones/PublicacionesAnuales/InformesAnuales/25/InfAnual_2025.pdf'
});
s('AIReF, Documento Técnico 6/25', 'INST', 'I', '2025-09-22', L, 'La inmigración en España se encuentra muy vinculada al crecimiento económico y al comportamiento del mercado laboral', 'Crecimiento del empleo → llegada de inmigrantes', 'F94');   // S139
s('Banco de España, Informe Anual 2025', 'INST', 'I', '2026-06', L, 'Los elevados esfuerzos para acceder a una vivienda de alquiler dificultan la emancipación de los jóvenes y la localización de los inmigrantes', 'Alquiler caro → menos emancipación y menos llegada de inmigrantes', 'F95');   // S140

e('R03', 'D02', '+', 'Donde se crea empleo, llega población de fuera.', '1-3 años', 'D2', ss(139), 'Banco de España, Informe Anual 2025 (leído): los factores de atracción explican el 57 % del cambio en los flujos migratorios (cita a Fernández-Huertas, 2025). Entre finales de 2019 y de 2024, en torno al 76 % de los puestos de trabajo creados los ocuparon personas nacidas fuera (Informe Anual 2024).', 'Solo el 18,1 % de los primeros permisos de residencia de 2025 fue por empleo; el 43,4 % fue por reagrupación familiar (Eurostat). La tasa de paro de los extranjeros es del 14,3 %, frente al 9,0 % de los españoles (EPA, 2.º trimestre de 2026).');
e('D02', 'D03', '+', 'Quienes llegan forman hogares nuevos.', 'meses', 'D1', [], 'INE, Estadística Continua de Población (ficheros leídos): entre el 1 de enero de 2021 y el de 2025 la población aumenta en 1.727.499 personas; los nacidos en el extranjero aumentan en 2.209.413 y los nacidos en España disminuyen en 481.914.', 'Es población, no hogares: ni el INE ni el Banco de España publican qué parte de los hogares nuevos es de personas nacidas fuera.');
e('D02', 'A03', '+', 'Quien llega vive sobre todo de alquiler.', 'meses', 'D1', [], 'INE, Encuesta de Condiciones de Vida 2025: vive en alquiler a precio de mercado el 63,4 % de los hogares de nacionalidad extracomunitaria y el 47,4 % de los de la UE, frente al 11,3 % de los españoles. Banco de España, Informe Anual 2025: entre los inquilinos recientes, los inmigrantes pasan del 42,5 % al 53,5 % entre 2002-2008 y 2022-2024.', 'No hay estimación reciente del efecto sobre el precio: los estudios causales llegan a 2012 o a 2019. Los extranjeros residentes hacen además el 10,1 % de las compras de vivienda.');
e('D02', 'O10', '+', 'Quien llega con ingresos bajos absorbe el coste del alquiler compartiendo vivienda.', '1-3 años', 'D1', [], 'Eurostat (ficheros leídos): entre las personas de nacionalidad extranjera, la sobreocupación pasa del 9,6 % en 2015 al 19,3 % en 2025, mientras su sobrecarga de gasto en vivienda baja del 37,6 % al 22,4 %; entre los españoles, la sobreocupación pasa del 4,3 % al 6,7 %. Su salario medio es el 77,7 % del de los españoles (INE, 2024) y el riesgo de pobreza de los extracomunitarios, del 44,5 %.', 'Evolución simultánea, no estimación. El grupo es heterogéneo: el 19,6 % de los ocupados extranjeros es directivo, técnico o profesional, y el 29,5 % entre los de la UE.');
C('D03', 'D07', '-', 'Cada hogar que se forma es un hogar menos que se queda sin formar.', 'inmediato');
e('G01', 'O04', '-', 'Un hogar en exclusión que accede a una vivienda social estable deja de estarlo.', 'inmediato', 'D1', [], 'Evaluación del programa Hábitat (España, 2021; asignación aleatoria, 18 meses; promovida por las entidades que lo gestionan): el 96 % de los participantes conserva la vivienda; en el grupo de comparación, el 27 % sigue en la calle y menos del 10 % ha accedido a un alojamiento independiente. Eurostat, España 2024: sobrecarga de gasto en vivienda del 28,1 % en alquiler de mercado y del 8,2 % en alquiler reducido o gratuito. Observatorio Vasco de la Vivienda (2019): alquiler protegido de 342 €/mes frente a 668-1.045 € en el mercado. ' + REF + 'ensayos aleatorizados en Estados Unidos, Canadá y Francia con resultados en el mismo sentido.', 'La evidencia es del hogar que accede, no del efecto de ampliar el parque: ningún estudio lo estima para España, y el dato de Eurostat mezcla alquiler social, renta antigua y cesión. Efectos contrarios documentados fuera: desplazamiento de construcción privada (dos tercios en Estados Unidos, según la revisión del Banco de España), menor empleo de algunos beneficiarios, concentración de pobreza y coste fiscal permanente.');

Object.assign(datos, {
  D07: Object.assign({}, datos.D07, { nota: 'Jóvenes de 18 a 34 años: 68,7 % (58,0 % en 2015).' })
});
// El deficit sale del objetivo social y entra «hogares que no llegan a formarse»
criterioSocial.resultados.splice(criterioSocial.resultados.indexOf('Q08'), 1, 'D07');
resultados.find(g => g.dimension === 'Jóvenes y hogares que quieren comprar').variables.push(['D07', 'baja']);
{ const g3 = gruposPersonas.find(g => g.id === 'G3'); g3.resultados.splice(g3.resultados.indexOf('Q08'), 1, 'D07'); }
Object.assign(esquema.posExtra, { D07: [1150, 760], R03: [380, 40] });

// ================================================================ Septima revision (12/10/2026)
// El mapa tenia en una sola variable el capital que CONSTRUYE alquiler nuevo y el que COMPRA vivienda existente. Son cosas distintas
// y los propios estudios las separan. F07 queda como el primero (aumenta la oferta); F10 es el segundo (sube la renta y rota inquilinos).
v('F10', 'Compra de vivienda existente por inversores', 'Viviendas ya construidas que compran fondos, sociedades de inversión y otros inversores, sueltas, en carteras o en edificios enteros.', 'flujo', 'viviendas/año', 'país', NM + '; el Catastro cuenta 13.222 sociedades con más de 10 viviendas, que reúnen 559.825 (2025)', 'Dirección General del Catastro', 'C03');
e('L07', 'F10', '+', 'El régimen fiscal de las sociedades de inversión favorece también la compra de vivienda ya construida.', '1-3 años', 'D1', ss(41), 'Gil y Martínez (2023): tras la reforma de 2012-2013 se crearon 73 sociedades de este tipo entre 2013 y 2019, y a través de ellas se compraron carteras de bancos y vivienda pública. Cocola-Gant et al. (2025): la norma exige arrendar tres años, pero no que sea a residentes permanentes. Catastro (2025, fichero oficial leído): las sociedades con más de 10 viviendas son 13.222 y reúnen 559.825.', 'Coincidencia temporal, sin estimación. La vivienda es el 11,2 % de los activos de estas sociedades (Banco de España, 2020).');
e('F10', 'A01', '+', 'La vivienda que compra un inversor para alquilar entra en la oferta de alquiler; si se le impide, la compra un hogar para vivir en ella.', '1-3 años', 'D1', ss(129), REF + 'Países Bajos (Francke et al., 2023): la prohibición de comprar para alquilar redujo la oferta de alquiler, subió los alquileres un 4 % en Róterdam y elevó 14 puntos la cuota de primeros compradores.', 'En España, buena parte de lo que compraron los grandes fondos ya estaba alquilado: entre el 73 % y el 80 % de las viviendas públicas vendidas en Madrid en 2013 tenía inquilino (Cámara de Cuentas), y en ese caso la compra no añade oferta. Un año de datos y otro país.', { disputada: true });
datos.Q05.nota = 'El 1,28 % del parque, pero muy concentradas: 5,0 % de las viviendas del distrito Centro de Madrid, 12,9 % en el distrito 1 de Sevilla, 30,3 % en un distrito censal del centro de Málaga, con secciones por encima del 50 % (INE). Sobre el mercado de alquiler del centro turístico: Sevilla 44,9 %, Málaga 44,6 %, Barcelona 22,2 %, Madrid 14,9 % (Banco de España, 2025).';
datos.A08 = { valor: 49.3, anio: '2024', previo: null, anioPrevio: null, unidad: '% de las viviendas alquiladas por particulares cuyo dueño alquila dos o más', fuente: 'Banco de España, Informe Anual 2025, con datos de la Agencia Tributaria', nota: 'Con 11 o más: 2,4 %. No incluye a las sociedades. Titulares con más de 10 viviendas, alquiladas o no: 26.897, con 1.040.955 viviendas, el 4,3 % del parque (Catastro, 2025).' };
Object.assign(esquema.posExtra, { F10: [930, 100] });

// ---------------------------------------------------------------- Exportacion
module.exports = {
  datos, resultados, escenarios, palancas, criterioSocial, gruposPersonas, premisas, maxMedidasPaquete: 5,
  titulo: 'El sistema de la vivienda en España',
  longitudMaximaBucle: 8,
  fuentes: F, tiposActor, statements, clusters, variables, edges, arquetipos, esquema
};