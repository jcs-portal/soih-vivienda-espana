// SOIH - Caso vivienda: indice de sostenibilidad social (primera version, 12/10/2026, pedido por el autor).
// Mide el DAÑO a la poblacion, no sus causas: las presiones (turismo, inversion, demografia, oferta) van aparte,
// para poder comprobar si el daño es mayor donde la presion es mayor en lugar de darlo por supuesto.
// Regla de calculo, fija: cada componente se expresa como indice con base en el primer año (= 100); mas alto es peor.
// Cada subindice es la media simple de sus componentes; el indice es la media ponderada de los subindices.
// Solo entran componentes con serie oficial completa en todos los años. Todos los valores se leyeron en la API de Eurostat.
'use strict';
const anios = ['2015', '2019', '2021', '2023', '2025'];
const subindices = [
  { id: 'I', nombre: 'Quien ya alquila: lo que pesa el alquiler', peso: 1 / 3, componentes: [
    { nombre: 'Inquilinos de mercado que gastan más del 40 % de su renta en vivienda', unidad: '%', fuente: 'Eurostat, ilc_lvho07c', valores: [43.3, 37.4, 40.9, 30.6, 26.8] },
    { nombre: 'Personas de la quinta parte más pobre con sobrecarga de gasto en vivienda', unidad: '%', fuente: 'Eurostat, ilc_lvho07b', valores: [40.9, 32.5, 38.4, 32, 27.7] },
    { nombre: 'Alquiler sobre renta disponible de los inquilinos pobres', unidad: '%', fuente: 'Eurostat, ilc_mded02', valores: [45.6, 45.7, 47.9, 38, 38.6] } ] },
  { id: 'II', nombre: 'Quien no entra, o entra compartiendo', peso: 1 / 3, componentes: [
    { nombre: 'Inquilinos de mercado en vivienda sobreocupada', unidad: '%', fuente: 'Eurostat, ilc_lvho05c', valores: [11.7, 16.3, 15.4, 17.5, 20.5] },
    { nombre: 'Jóvenes de 18 a 34 años que viven con sus padres', unidad: '%', fuente: 'Eurostat, ilc_lvps08', valores: [58, 64.5, 64.5, 65.6, 68.7] },
    { nombre: 'Jóvenes de 16 a 29 años en vivienda sobreocupada', unidad: '%', fuente: 'Eurostat, ilc_lvho05a', valores: [9.2, 10.3, 11.3, 13.1, 16] } ] },
  { id: 'III', nombre: 'Hogares frágiles: mayores pobres, personas solas, monoparentales', peso: 1 / 3, componentes: [
    { nombre: 'Mayores de 65 pobres con sobrecarga de gasto en vivienda', unidad: '%', fuente: 'Eurostat, ilc_lvho07a', valores: [19.7, 16.1, 25.7, 24.4, 23.2] },
    { nombre: 'Personas menores de 65 que viven solas, con sobrecarga', unidad: '%', fuente: 'Eurostat, ilc_lvho07e', valores: [28.5, 25.7, 26, 25.7, 24.4] },
    { nombre: 'Familias monoparentales con sobrecarga', unidad: '%', fuente: 'Eurostat, ilc_lvho07e', valores: [33.3, 24.1, 29.3, 24, 22.5] } ] }
];
// Otras ponderaciones, para comprobar si la conclusion depende de los pesos
const pesosAlternativos = [
  { nombre: 'Más peso a quien ya alquila', pesos: [0.5, 0.25, 0.25] },
  { nombre: 'Más peso a quien no entra', pesos: [0.25, 0.5, 0.25] },
  { nombre: 'Más peso a los hogares frágiles', pesos: [0.25, 0.25, 0.5] }
];
// Presiones: lo que podria causar el daño. No entran en el indice.
const presiones = [
  { nombre: 'Turistas internacionales', unidad: 'millones al año', fuente: 'INE, FRONTUR', valores: { '2019': '83,5', '2023': '85,2', '2025': '96,8' } },
  { nombre: 'Noches en alojamientos de plataformas', unidad: 'millones al año', fuente: 'INE, estadística experimental', valores: { '2019': '105,6', '2023': '141,1', '2025': '189,5' } },
  { nombre: 'Viviendas de uso turístico', unidad: 'viviendas', fuente: 'INE, estadística experimental', valores: { '2019': 'sin dato (la serie empieza en 2020: 321.496)', '2023': '340.424 (agosto)', '2025': '381.837 (mayo); 341.001 en mayo de 2026' } },
  { nombre: 'Saldo migratorio exterior', unidad: 'miles de personas al año', fuente: 'Eurostat', valores: { '2019': '456,5', '2023': '647,9', '2025': '582,9' } },
  { nombre: 'Hogares nuevos frente a viviendas terminadas', unidad: 'miles al año', fuente: 'EPA; Ministerio de Vivienda', valores: { '2019': '121,9 frente a 78,8', '2023': '265,4 frente a 89,3', '2025': '258,2 frente a 93,7' } },
  { nombre: 'Sobreprecio de las viviendas que entran al alquiler', unidad: '% sobre las ya alquiladas', fuente: 'Banco de España, Informe Anual 2025', valores: { '2019': '6,2 (2020)', '2023': 'sin dato', '2025': '16,5 (2024)' } },
  { nombre: 'Viviendas protegidas calificadas', unidad: 'viviendas al año', fuente: 'Ministerio de Vivienda', valores: { '2019': 'sin dato leído', '2023': '8.847', '2025': '12.858' } }
];
// Primer cruce por territorio: daño frente a presion turistica. Cuatro ciudades: es un indicio, no una prueba.
const ciudades = {
  danio: { nombre: 'Hogares no propietarios que gastan más del 30 % de su renta neta en vivienda', unidad: '%', anio: '2024', fuente: 'Banco de España, Informe Anual 2025, cuadro 2.6' },
  presion: { nombre: 'Viviendas de uso turístico sobre el parque', unidad: '%', anio: 'mayo de 2026', fuente: 'INE, estadística experimental' },
  filas: [
    { ciudad: 'Sevilla', danio: 46.8, presion: 2.12 },
    { ciudad: 'Málaga', danio: 46.7, presion: 3.17 },
    { ciudad: 'Barcelona', danio: 43.5, presion: 1.02 },
    { ciudad: 'Madrid', danio: 41.3, presion: 0.71 },
    { ciudad: 'España', danio: 32.5, presion: 1.28 }
  ]
};
// Pesos segun las personas a las que describe cada subindice (el autor, 12/10/2026: «los pesos se deben simular de alguna forma»).
// El tercero esta incompleto: solo se sabe cuantas personas viven en hogares monoparentales.
const pesosPersonas = [
  { subindice: 'I', personas: 8548324, calculo: '49.128.297 habitantes × 17,4 % en alquiler de mercado (Eurostat, 2025).' },
  { subindice: 'II', personas: 6420477, calculo: '9.345.672 personas de 18 a 34 años × 68,7 % que viven con sus padres (Eurostat, 2025). Es un máximo.' },
  { subindice: 'III', personas: 1621234, calculo: '49.128.297 habitantes × 3,3 % en hogares monoparentales (Eurostat, 2025). Es un mínimo: faltan los mayores pobres y las personas solas, sin cifra localizada.' }
];
// Barrido: se prueban todas las ponderaciones posibles de los tres subindices, de 5 en 5 puntos.
const pasoBarrido = 0.05;
// Perfil por edades (el autor: «el estudio de rentas e ingresos por pirámide de edades podría ayudar»).
const edades = {
  cab: ['Edad', 'Personas (1/1/2025)', 'Hogares en alquiler de mercado, 2007', 'Hogares en alquiler de mercado, 2025', 'Hogares en propiedad, 2007', 'Hogares en propiedad, 2025', 'Sobrecarga de gasto en vivienda, 2015', 'Sobrecarga, 2025'],
  filas: [
    ['16 a 29 años', '7.558.029', '28,4 %', '49,8 %', '58,1 %', '30,6 %', '12,4 %', '7,0 %'],
    ['30 a 44 años', '9.482.709', '15,8 %', '32,1 %', '74,3 %', '53,1 %', 'sin dato por este tramo', 'sin dato por este tramo'],
    ['45 a 64 años', '15.034.032', '7,3 %', '15,3 %', '83,8 %', '75,0 %', 'sin dato por este tramo', 'sin dato por este tramo'],
    ['65 años o más', '10.178.625', '3,6 %', '5,5 %', '87,5 %', '88,2 %', '3,7 %', '4,8 %'],
    ['Total', '49.128.297 (incluye menores de 16)', '10,4 %', '16,7 %', '80,1 %', '73,3 %', '10,3 %', '7,2 %']
  ],
  nota: 'Personas: Eurostat. Tenencia: INE, Encuesta de Condiciones de Vida, por edad de la persona de referencia del hogar; en el tramo de 16 a 29 años solo recoge a quien ya se ha emancipado. Sobrecarga: Eurostat, porcentaje de personas de esa edad.',
  salarios: [
    ['Salario medio, de 25 a 29 años', '16.046 €', '22.723 €', '+41,6 %', '+14,7 %'],
    ['Salario medio, de 30 a 34 años', '19.598 €', '26.944 €', '+37,5 %', '+11,4 %'],
    ['Salario medio, todas las edades', '23.106 €', '29.540 €', '+27,9 %', '+3,6 %'],
    ['Jóvenes de 18 a 34 años que viven con sus padres', '58,0 %', '68,7 % (2025)', '', '']
  ],
  notaSalarios: 'Salarios: INE, Encuesta Anual de Estructura Salarial, 2015 y 2024; variación real descontando el IPC (+23,5 %). Jóvenes con sus padres: Eurostat, 2015 y 2025.'
};
module.exports = { anios, subindices, pesosAlternativos, pesosPersonas, pasoBarrido, edades, presiones, ciudades };
