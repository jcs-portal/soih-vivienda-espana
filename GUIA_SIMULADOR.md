# Guía del simulador de tendencias

Esta guía explica cómo usar el archivo `Simulador_de_tendencias.html`. Está escrita para quien no ha
trabajado nunca con dinámica de sistemas. No hace falta instalar nada ni saber programar.

**Qué hace el simulador, en una frase:** tú dices qué cambia (por ejemplo, «se restringen los pisos
turísticos») y él te enseña a qué empuja ese cambio, a quién beneficia, a quién perjudica, en cuánto
tiempo y por qué camino.

## Antes de empezar: cuatro ideas

**1. Una variable es algo que puede subir o bajar.** El precio del alquiler, el número de pisos
turísticos, la edad a la que se emancipan los jóvenes. El modelo tiene 98.

**2. Una relación une dos variables y tiene un signo.**

- Signo **(+)**: las dos se mueven en el mismo sentido. Si suben los pisos turísticos, sube el precio
  del alquiler; si bajan, baja.
- Signo **(−)**: se mueven en sentido contrario. Si sube la restricción al alquiler turístico, bajan
  los pisos turísticos.

**3. Una vía es una cadena de relaciones.** Restringir el alquiler turístico → menos pisos
turísticos → baja el precio del alquiler. Eso es una vía de dos pasos. Casi siempre hay varias vías
entre una medida y un resultado, y no todas empujan hacia el mismo lado. Ahí está la gracia: el
simulador las encuentra todas y te las enseña.

**4. El simulador dice hacia dónde, no cuánto.** Te dirá que una medida empuja el alquiler a la baja
por dos vías y al alza por otras dos. No te dirá si baja un 3 % o un 10 %. Cuando hay vías en los dos
sentidos, el resultado depende de cuál pese más, y eso el modelo no lo sabe.

> **No es una bola de cristal.** Es una manera ordenada de ver todos los efectos de una decisión a la
> vez, incluidos los que no se suelen contar.

## Cómo abrirlo

**En línea, sin instalar nada:** https://jcs-portal.github.io/soih-vivienda-espana/

Funciona en el ordenador y en el móvil. En el móvil las tres zonas se apilan una debajo de otra, y una
barra al pie de la pantalla salta de una a otra con el recuento de lo que mejora y empeora a la vista.

La primera vez que lo abres aparece un resumen de cómo se juega; el botón **? Cómo se usa** lo vuelve
a abrir. Se abre con un ejemplo ya cargado (el tope al alquiler) para que haya algo que mirar desde el
primer momento: cámbialo como quieras.

**Sin conexión:** en la página del proyecto en GitHub, pulsa **Code** y luego **Download ZIP**,
descomprímelo y abre `index.html` (en la raíz) con el navegador.

| Así se abre en el móvil | Y la guía rápida de la primera visita |
|---|---|
| ![El simulador en un teléfono](12_Cases/Vivienda%20Espana/imagenes/manual_12_movil.png) | ![La guía rápida en un teléfono](12_Cases/Vivienda%20Espana/imagenes/manual_13_movil_guia.png) |

## La pantalla tiene tres zonas

![La pantalla del simulador, con sus tres zonas numeradas](12_Cases/Vivienda%20Espana/imagenes/manual_01_pantalla.png)

| Zona | Para qué sirve |
|---|---|
| **1. Elige qué cambia** (izquierda) | Aquí decides tú: qué medida se toma o qué condición cambia. |
| **2. Qué empuja a qué** (derecha) | El resultado: qué mejora y qué empeora, para quién y en qué plazo. |
| **3. El mapa** (centro) | El dibujo del sistema. Se iluminan las relaciones por las que viaja el efecto. |

Se usan en ese orden: eliges en la 1, miras el resultado en la 2 y usas la 3 para entender por qué.
En el móvil aparecen en ese mismo orden, una debajo de otra.

**Un solo código de colores.** El color solo dice si algo es bueno o malo: **verde** mejora, **rojo**
empeora, **morado** hay vías en los dos sentidos. Lo que indica una dirección (los botones ▲ ● ▼, las
flechas del mapa) va en azul oscuro o gris, sin juicio.

## Zona 1: elegir qué cambia

Hay dos maneras.

**La rápida: un escenario ya preparado.** Arriba hay una lista de botones con medidas y paquetes de
medidas. Pulsa uno y el simulador lo carga entero. Aparece un recuadro azul que explica en qué
consiste y, debajo, **Lo que cambia ahora**: las variables que mueve ese escenario, con sus botones,
para que las cambies o las quites con **✕**. El botón **Limpiar todo y empezar de cero** lo borra todo.

En **Prueba esto** hay comparaciones de un clic: ver solo la evidencia firme, comparar con otro
escenario o volver al ejemplo inicial.

![Los escenarios de partida](12_Cases/Vivienda%20Espana/imagenes/manual_02_escenarios.png)

**La manual: variable a variable.** Más abajo están las variables que alguien puede decidir (un
ayuntamiento, el Estado, un banco) y las condiciones externas que nadie decide (los tipos de interés,
la llegada de turistas). Cada una tiene tres botones:

![Los tres botones de cada variable](12_Cases/Vivienda%20Espana/imagenes/manual_03_botones.png)

| Botón | Significa | Ejemplo |
|---|---|---|
| **▲** | Sube | Se restringe más el alquiler turístico |
| **●** | Se mantiene | Esa variable no cambia, pase lo que pase |
| **▼** | Baja | Se restringe menos: se liberaliza |

Pulsa otra vez el mismo botón para soltarlo, o **✕** para quitar la variable. Debajo de cada nombre,
en gris, pone quién tiene esa decisión en su mano.

Puedes marcar varias a la vez. Y si quieres mover cualquier otra de las 98 variables del mapa, elígela
en el desplegable **Añadir variable…**: entra subiendo (▲) y la cambias en «Lo que cambia ahora».

Cualquiera puede cambiar lo que quiera. Lo que hagas se queda en tu pantalla y no cambia el modelo para
nadie más.

## Zona 2: leer el resultado

Es la tabla de la derecha. Cada fila es un resultado que le importa a alguien, y están agrupados por
a quién afectan: hogares que alquilan, jóvenes y hogares que quieren comprar, personas vulnerables,
propietarios que alquilan, promotores, etc.

![La tabla de resultados](12_Cases/Vivienda%20Espana/imagenes/manual_05_tabla.png)

**Debajo del nombre de cada resultado** pone cuándo mejora («Mejora si baja») y, cuando lo hay, el
último dato real («Hoy: 26,8 % de inquilinos con sobrecarga»).

**Los colores son lo primero que hay que mirar:**

| Color | Significa |
|---|---|
| **Verde** | Todas las vías empujan hacia la mejora |
| **Rojo** | Todas empujan hacia el empeoramiento |
| **Morado ◆** | Hay vías en los dos sentidos: el modelo no puede decir cuál gana |
| Un punto gris | Ninguna vía llega hasta ahí |

**Los símbolos dicen hacia dónde y por cuántas vías.** «▼ 1» significa que una vía empuja ese
resultado a la baja. «◆ 2▲ 3▼» significa que dos vías lo empujan al alza y tres a la baja. Cuidado:
la flecha dice si sube o baja, y el color dice si eso es bueno o malo. Que baje el precio del
alquiler es verde; que baje la oferta de alquiler es rojo.

**Las columnas.** En el simulador, la caja «Cómo leer la tabla», justo encima, también las explica. Y si pasas
el ratón por la cabecera de una columna, sale un resumen.

| Columna | Qué responde |
|---|---|
| **Tiempo en notarse:** menos de 1 año · de 1 a 4 años · más de 4 años | ¿Cuánto tarda en notarse el efecto? Cada relación del mapa tarda en notarse (inmediata, meses, de 1 a 3 años o más de 3). Se suman los retrasos de todos los eslabones de una vía, y la vía va a la columna que le toca |
| Conjunto | Todas las vías juntas, sin distinguir plazos |
| **Primera ronda** | ¿Qué dicen las vías más cortas, las de menos eslabones? Es el efecto más directo, y debajo pone cuántos pasos tiene. Es el mismo veredicto del resumen de arriba |
| **Efectos de vuelta** | ¿Y las vías más largas, las que dan un rodeo o vuelven sobre sí mismas? Cuántas van a favor de lo que le conviene a ese resultado y cuántas en contra |

Ojo: «más corta» quiere decir con menos pasos, no más rápida. Una vía de dos pasos lentos puede tardar
años, y aparecerá en la columna de más de 4 años aunque sea de primera ronda.

Si solo vas a mirar dos columnas, que sean las dos últimas. **Primera ronda** es lo que promete quien
propone la medida. **Efectos de vuelta** es lo que el sistema devuelve después: los rodeos, los
rebotes, las consecuencias que no estaban en el plan.

> La primera ronda llega antes, pero el modelo no sabe si pesa más que los efectos de vuelta. Una
> «mejora» con muchos efectos de vuelta en contra es una mejora que hay que vigilar.

**Pulsa cualquier celda** para ver, debajo de la tabla, las vías una por una.

## Zona 3: el mapa

![El mapa con una medida aplicada](12_Cases/Vivienda%20Espana/imagenes/manual_04_mapa.png)

| Lo que ves | Qué es |
|---|---|
| Un **rombo** | Una decisión: algo que una administración o un banco puede cambiar |
| Un **círculo** | Cualquier otra variable |
| El **color** del círculo o del rombo | El tema: alquiler, compraventa, regulación, resultados sociales… |
| Un **círculo a trazos** alrededor | La variable que has fijado tú |
| **▲ ▼ ◆** dentro | Empujada al alza, a la baja, o en los dos sentidos |
| Flecha **azul** | Relación de signo (+): se mueven en el mismo sentido |
| Flecha **gris oscuro** | Relación de signo (−): se mueven en sentido contrario |
| Flecha **a trazos** | Relación disputada: unos actores la afirman y otros la niegan |
| Flecha **gris y fina** | Relación que existe, pero por la que ahora no pasa ningún efecto |

Tres cosas que se pueden hacer en el mapa:

- **Dejar el ratón quieto sobre una variable**: aparece su definición y su último dato.
- **Pulsar una variable**: la fijas sin ir a la zona 1. Cada pulsación cambia el estado: sube → baja
  → se mantiene → libre.
- **Cambiar el plazo** en el desplegable de abajo, para ver solo lo que ocurre en menos de un año, de
  uno a cuatro, o en más de cuatro.

El mapa dibuja las 49 variables principales para que se pueda leer. El cálculo usa las 98.

## Ejemplo 1: restringir los pisos turísticos

**La pregunta:** ¿qué pasa con el precio del alquiler si se restringe el alquiler turístico?

**Paso 1.** En la zona 1, pulsa **Limpiar todo y empezar de cero**; luego, en **Todas las variables**,
busca «Restricción al alquiler turístico» y pulsa **▲**. (O pulsa el primer escenario, «Recuperar para
residentes los pisos turísticos», que hace lo mismo.)

**Paso 2.** En la zona 2, busca la fila «Precio del alquiler». Dice:

- Conjunto: **◆ 3▲ 3▼** en morado. Hay seis vías: tres lo empujan a la baja y tres al alza.
- Primera ronda: **mejora**, en 2 pasos.
- Efectos de vuelta: **2 a favor, 3 en contra**.

Es decir: el efecto directo es bueno, y detrás vienen cinco efectos más lentos, más en contra que a favor.

**Paso 3.** Pulsa la celda «mejora» de esa fila. Debajo de la tabla aparecen las seis vías:

![Las seis vías hacia el precio del alquiler](12_Cases/Vivienda%20Espana/imagenes/manual_06_vias.png)

Cada línea se lee como una frase. La primera:

> ▲ Restricción al alquiler turístico →(−) ▼ Viviendas de uso turístico →(+) ▼ Precio del alquiler

«Sube la restricción; como la relación es de signo contrario, bajan las viviendas turísticas; como
la siguiente es del mismo signo, baja el precio del alquiler.» Las etiquetas de debajo dicen cuánto
se fía el modelo de esa vía (confianza media) y cuánto tarda (unos 4 años).

Ahora mira la segunda, que va en contra:

> ▲ Restricción al alquiler turístico →(+) ▲ Viviendas en alquiler no habitual →(−) ▼ Oferta de alquiler habitual →(−) ▲ Precio del alquiler

Es la **vía de escape**: parte de los pisos que dejan de ser turísticos no vuelven al alquiler normal
sino que pasan al alquiler por meses, la oferta para residentes baja y el precio sube. Nadie que
defienda la medida lo cuenta, y el simulador lo pone delante.

**Paso 4.** Mira el mapa. Al pulsar la celda, solo quedan iluminadas las relaciones que llevan hasta
el precio del alquiler:

![El mapa, mostrando solo las vías hacia el precio del alquiler](12_Cases/Vivienda%20Espana/imagenes/manual_07_mapa_vias.png)

**Qué se aprende:** la medida empuja en la buena dirección, y la fuga está identificada. Para
cerrarla, pulsa también **▲** en «Regulación del alquiler de temporada» y mira qué cambia.

## Ejemplo 2: el tope al alquiler, y para qué sirve «Se mantiene»

**La pregunta:** ¿qué pasa si se limita el precio del alquiler?

**Paso 1.** Es el ejemplo con el que se abre el simulador. Para hacerlo a mano: pulsa **Limpiar todo y
empezar de cero** y luego **▲** en «Intensidad de la regulación del precio del alquiler», dentro de
**Todas las variables**.

![El tope al alquiler](12_Cases/Vivienda%20Espana/imagenes/manual_08_tope.png)

**Paso 2.** Lee la fila «Precio del alquiler» de izquierda a derecha, que es leerla en el tiempo:

- Menos de 1 año: **▼ 1 en verde**. El precio baja. Es el efecto directo.
- De 1 a 4 años: **▲ 2 en rojo**. Dos vías lo empujan al alza.
- Más de 4 años: **◆ morado**. Vías en los dos sentidos.

Y dos filas más abajo está la explicación: «Oferta de alquiler habitual», **empeora** en un paso.
Parte de los propietarios retira la vivienda del alquiler, hay menos oferta y el precio vuelve a
subir por otro lado. Además, «Exigencia en la selección de inquilinos» empeora: con menos pisos, el
casero elige más.

**Paso 3.** Ahora la pregunta interesante: ¿y si se consigue que la oferta no caiga? Es lo que
intentan las medidas que acompañan a un tope (incentivos al propietario, garantía de cobro). En
«Añadir variable…» elige «Oferta de alquiler habitual». Aparece en **Lo que cambia ahora** marcada con
▲; pulsa su botón **●** (Se mantiene).

![El tope al alquiler, con la oferta mantenida](12_Cases/Vivienda%20Espana/imagenes/manual_09_tope_oferta.png)

La fila de la oferta dice ahora «fijada». En «Precio del alquiler» ha desaparecido el rojo de 1 a
4 años, y los efectos de vuelta bajan de «4 a favor, 5 en contra» a «2 a favor, 3 en contra».

**Qué se aprende:** el botón **●** sirve para preguntar «¿y si esto no se mueve?». Corta todos los
efectos que pasarían por esa variable. Aquí enseña que el problema del tope no es el tope, sino lo
que le pasa a la oferta, y que la exigencia al seleccionar inquilino empeora igualmente.

## Ejemplo 3: ¿cuánto de esto está demostrado?

No todas las relaciones del mapa están igual de respaldadas. Unas tienen un estudio que las mide;
otras, solo datos que encajan o actores que las afirman.

Al final de la zona 1 hay un desplegable, **Relaciones que se usan**:

![El desplegable de confianza](12_Cases/Vivienda%20Espana/imagenes/manual_11_selector.png)

| Opción | Qué usa el cálculo |
|---|---|
| Confianza baja o superior | Todo lo que tiene algún respaldo. Es la opción de partida |
| Solo confianza media o alta | Solo lo mejor respaldado |
| Solo confianza alta | Lo poco que está sólidamente demostrado |
| Añadir conjeturas | También lo que afirma un solo actor, sin datos |
| Añadir también hipótesis del analista | También las relaciones sin ninguna fuente |

**Pruébalo.** Vuelve al ejemplo 1 (restringir el alquiler turístico) y elige «Solo confianza media o
alta». (Con el botón **¿Cuánto de esto está demostrado?** de «Prueba esto» se hace en un clic.)

![El ejemplo 1, solo con evidencia media o alta](12_Cases/Vivienda%20Espana/imagenes/manual_10_firme.png)

La tabla se vacía mucho, y lo que queda es más limpio: el precio del alquiler pasa a **verde**, con
una vía a la baja y ninguna al alza. La vía de escape del ejemplo 1 ha desaparecido, porque su
respaldo es bajo. Y filas como «Mudanzas forzosas» o «Sobreocupación» se quedan sin ninguna vía: lo
que se decía de ellas se apoyaba en evidencia débil.

**Qué se aprende:** una conclusión que aguanta con «Solo confianza media o alta» es firme. Una que
solo aparece con «baja» es una pista razonable, no un hecho. Y una que solo aparece al añadir
hipótesis es una pregunta que alguien tendría que investigar.

## Errores de lectura frecuentes

- **Contar vías como si fueran votos.** «3 a la baja y 2 al alza» no significa que gane la baja. Una
  sola vía puede pesar más que tres. El número dice cuántos caminos hay, no cuánta fuerza llevan.
- **Leer el verde como «funciona».** Verde significa que todas las vías *conocidas y respaldadas*
  empujan a favor. Puede faltar una vía que nadie ha estudiado.
- **Leer el punto gris como «no afecta».** Significa que el modelo no tiene ninguna relación
  respaldada que llegue hasta ahí. Puede que afecte y nadie lo haya medido.
- **Olvidar el plazo.** Una medida puede mejorar algo en un año y empeorarlo en cinco. Mira siempre
  las tres columnas de plazo (en el móvil se ocultan para que quepa la tabla: ábrelo en una pantalla
  ancha para verlas).
- **Quedarse con un solo resultado.** Baja la vista por toda la tabla: lo que mejora para quien
  alquila puede empeorar para quien quiere comprar.

## Cosas que probar

1. Pulsa **▼** en «Restricción al alquiler turístico» (es decir, liberalizarlo) y compara con el
   ejemplo 1.
2. Carga el escenario «Paquete P4: Menor coste social» y mira cuántas filas quedan en verde.
3. Sube «Llegadas de turistas internacionales», que no la decide nadie, y mira qué arrastra.
4. Elige una medida que defiendas y busca en la tabla a quién perjudica. Luego elige una que rechaces
   y busca a quién beneficia.

## Qué hay detrás

Cada relación del mapa procede de una fuente: un dato oficial, un estudio o lo que afirman actores de
posiciones opuestas. Están todas en `datos/fuentes.csv` y en el documento de fuentes. Si una relación
no te convence, puedes quitarla o cambiarla en `datos/caso.js` y recalcular; el archivo `LEEME.md`
explica cómo.

Las capturas de esta guía son de la versión 0.8.8. Si el modelo cambia, los números de los
ejemplos pueden variar.
