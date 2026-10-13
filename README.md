# SOIH · La vivienda en España como sistema

Un modelo causal del sistema de la vivienda en España, con sus datos, sus fuentes y el programa que
lo calcula. Está hecho para que cualquiera pueda **revisarlo, discutirlo, cambiarle un dato y ver
qué pasa**.

Autor: Juan Carlos Siria · Versión del paquete: 0.8.2 · Fecha: 13 de octubre de 2026

## Qué es

- **Un mapa de causas y efectos**: 97 factores (precios, oferta, salarios, turismo,
  inmigración, leyes, inversores, vivienda pública) unidos por relaciones del tipo «si esto sube,
  aquello sube o baja».
- **Solo cuenta lo que tiene fuente.** Cada relación necesita un dato oficial, un estudio, o que la
  afirmen actores de posiciones opuestas. Hay 117 relaciones con respaldo y 37
  hipótesis sin fuente. Las hipótesis no entran en el cálculo principal: se calculan en un nivel
  aparte, rotulado «por confirmar», y el programa dice cuáles cambiarían más el resultado.
- **Un objetivo declarado**: se mide cómo viven las personas (poder pagar, tener dónde, no ser
  expulsado, poder emanciparse), no la rentabilidad de quien ofrece vivienda. Es una elección, no un
  resultado; con otro objetivo, el orden de las medidas cambia.
- **Dice hacia dónde, no cuánto.** El modelo indica el sentido y el plazo de cada efecto, no su
  tamaño. Es dinámica de sistemas cualitativa; el modelo con cantidades está por hacer.

## Por dónde empezar

| Si quieres… | Abre |
|---|---|
| Entenderlo en diez minutos | `12_Cases/Vivienda Espana/SOIH_12_Vivienda_Articulo_v0.1.pdf` |
| Jugar con él | `12_Cases/Vivienda Espana/Simulador_de_tendencias.html` (se abre en el navegador, sin instalar nada). **Cómo se usa: [Guía del simulador](GUIA_SIMULADOR.md)**, con ejemplos e imágenes |
| Ver el mapa entero | `Mapa_interactivo_N2.html` y `Esquema_del_sistema.html`, en la misma carpeta |
| Comprobar una cifra | `SOIH_12_Vivienda_Tabla_de_datos_v0.1.pdf` o `datos/tabla_datos.csv`: 266 cifras con fecha, fuente y estado |
| Saber de dónde sale cada cosa | `SOIH_12_Vivienda_Fuentes_v0.1.pdf` o `datos/fuentes.csv`: cada documento, para qué se usó y hasta dónde se leyó |
| Ver qué falta por comprobar | `datos/hipotesis_a_contrastar.csv`: las relaciones sin confirmar, ordenadas por cuánto moverían el resultado |
| Ver qué medidas salen mejor y por qué | `SOIH_12_Vivienda_Coste_social_v0.1.pdf` |
| Ver cómo ha cambiado el daño desde 2015 | `SOIH_12_Vivienda_Indice_sostenibilidad_v0.1.pdf` |
| Leerlo todo, con anexos | `SOIH_12_Caso_Vivienda_Espana_v0.2.pdf` |
| Conocer el método | `00_Master_Methodology/SOIH_00_Master_Methodology_v0.2.pdf` |

## Tres maneras de usarlo

1. **Sin instalar nada.** Descarga el paquete (en GitHub, botón «Code» y «Download ZIP»), descomprímelo
   y abre `12_Cases/Vivienda Espana/Simulador_de_tendencias.html` en el navegador. Elige una medida o
   varias y mira qué resultados mejoran y empeoran, para quién y por qué camino. La
   [Guía del simulador](GUIA_SIMULADOR.md) lo explica paso a paso, sin dar nada por sabido.
2. **Cambiando los datos.** Edita `caso.js` y recalcula, como se explica abajo. Hace falta Node.js.
3. **Con tus propias convicciones.** Lo que creas y no puedas demostrar, escríbelo como hipótesis
   (`H(...)`) o como premisa. No se mezcla con lo comprobado: el programa calcula aparte qué pasaría
   si fuera cierto.

## Cómo cambiarlo y recalcular

Solo hace falta [Node.js](https://nodejs.org) (cualquier versión reciente). No hay dependencias.

1. Edita `12_Cases/Vivienda Espana/datos/caso.js`. Es el único archivo de datos del mapa: variables,
   relaciones, afirmaciones de actores, escenarios, palancas y premisas.
2. Desde la carpeta `11_Systemic_Analysis_Engine`, ejecuta:

   ```
   node soih_engine.js "../12_Cases/Vivienda Espana"
   ```

3. Se regeneran el simulador, el mapa, el esquema y los CSV de `datos/`. El resumen numérico queda
   en `datos/resumen.json`.

El programa **se detiene con un mensaje** si una relación no tiene ni afirmación ni fuente y no está
marcada como hipótesis, o si se declara un nivel de datos sin escribir de dónde sale. Es deliberado.

Los otros archivos de datos son `datos/inventario.js` (la tabla de cifras), `datos/indice.js` (el
índice de sostenibilidad social) y `datos/fuentes.js` (la lista de fuentes).

### Cómo se escribe una relación en `caso.js`

```js
// e(origen, destino, signo, mecanismo, retardo, nivel de datos, afirmaciones, evidencia, lo que la contradice)
e('Q05', 'A02', '+', 'Las viviendas que pasan a uso turístico dejan de alquilarse a residentes y la renta sube.',
  '1-3 años', 'D3', ss(14, 74, 83), 'Garcia-López et al. (2020)…', 'Solo Barcelona…');

// H(...) = hipótesis sin fuente: se conserva a la vista y no se calcula
H('Q12', 'Q14', '+', 'El propietario no renueva al inquilino para pasar la vivienda a uso turístico.', '1-3 años');
```

Niveles de datos: `D1` datos descriptivos compatibles o evidencia de otro país; `D2` estimación
cuantitativa; `D3` identificación causal. La confianza de cada relación la calcula el programa con
una regla fija a partir del nivel de datos y de cuántos bloques de interés distintos la afirman.

### Ideas para jugar

- Cambia el objetivo: la lista `criterioSocial` decide qué resultados cuentan.
- Añade tus propias convicciones como **premisas** (objeto `premisas`): el programa recalcula «si
  fueran ciertas» y lo muestra al lado del cálculo con evidencia.
- Marca como hipótesis una relación que no te convenza y mira qué conclusiones se caen.
- Añade una medida nueva a `palancas` y entra en la búsqueda de paquetes.
- Haz el mapa de otra ciudad, o de otro problema: el programa no sabe nada de vivienda.

### Regenerar los documentos Word y PDF

Es opcional y solo funciona en Windows con Word, PowerShell 7 y Edge:

```
& .\11_Systemic_Analysis_Engine\construir_caso.ps1 -Caso "12_Cases\Vivienda Espana" -Plantilla "_fuente_html\SOIH_12_Vivienda_Articulo_v0.1.plantilla.html"
```

Las plantillas están en `_fuente_html`. Las cifras de los textos salen de `resumen.json`; las tablas,
del programa. **La prosa no se actualiza sola**: si cambias el modelo, revisa el texto de la plantilla.

## Qué hay en cada carpeta

| Carpeta | Contenido |
|---|---|
| `00_Master_Methodology` | El método SOIH, versión 0.2 |
| `11_Systemic_Analysis_Engine` | El programa (`soih_engine.js`) y las plantillas de las herramientas interactivas |
| `12_Cases/Vivienda Espana` | El caso: documentos, herramientas interactivas, imágenes y `datos/` |
| `_fuente_html` | Plantillas de los documentos y el conversor a Word |

## Lo que debes saber antes de fiarte

- **Da dirección, no magnitud.** «Mejora» significa que las causas más directas empujan a favor.
- **El resultado depende de lo que se ha estudiado.** Lo que no tiene fuente no cuenta, y eso
  perjudica a las medidas cuyo beneficio parece evidente pero nadie ha medido. El paquete de medidas
  que sale primero ha cambiado en cada revisión, por diferencias de un punto, y en la última empatan
  seis. Lo estable es lo que repiten todos: restringir el uso turístico de la vivienda.
- **Parte de la evidencia es de otros países o de una sola ciudad**, casi siempre Barcelona. Se
  indica en cada relación.
- **Cómo se reunió la evidencia.** La búsqueda y lectura de fuentes se hizo con ayuda de asistentes
  de inteligencia artificial, con una regla escrita: solo vale lo que se abrió y se leyó en la fuente,
  y se dice cuándo solo se leyó el resumen o se llegó a través de un tercero. En la tabla de datos,
  13 cifras están marcadas «Sin verificar» por ese motivo. Si vas a citar una cifra,
  ve a su fuente.
- **Errores ya corregidos, por si reaparecen**: se dio dos veces por inexistente algo que existía (la
  literatura sobre fondos de inversión y el desglose de propietarios por tramos, que publica el
  Catastro); se contaba como daño que se formasen más hogares al abaratarse el alquiler; y el capital
  que construye alquiler nuevo estaba mezclado con el que compra vivienda existente. Todos cambiaron
  resultados.
- **Las leyes se mueven.** Varias normas citadas estaban aprobadas por decreto-ley y pendientes de
  convalidación en la fecha del paquete, entre ellas el gravamen del 25 % sobre el beneficio no
  repartido de las socimis (Real Decreto-ley 29/2026). Pueden decaer.

## Trabajo pendiente conocido

- Cruzar registros que hoy no se cruzan: licencias turísticas con padrón o fianzas (qué era antes cada
  vivienda turística), y Catastro con Hacienda (cuántas viviendas de los grandes tenedores se alquilan).
- Dar a cada segmento de la demanda (mayores, familias monoparentales, inmigrantes) variables propias.
- Ponderar los resultados por personas afectadas con datos, no con una simulación.
- Pasar a un modelo con cantidades (existencias y flujos).
- Llevar el índice de sostenibilidad a escala de ciudad.

## Cómo contribuir

Lo más útil, por este orden: una **fuente** que respalde o contradiga una relación; un **dato** de los
que figuran como «No existe»; un **error** en una cifra o en una cita; una **medida** que falte.
Indica siempre el documento, la página y el enlace.

## Licencia y cita

Ver `LICENCIA.md`. Si lo usas, cita: *Juan Carlos Siria, «SOIH · La vivienda en España como
sistema», versión 0.8.2, 13 de octubre de 2026.*
