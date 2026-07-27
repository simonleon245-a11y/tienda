# "La Tormenta" — Documento de Diseño de Juego

Terror psicológico, primera persona, walking sim. Unity 3D, estilo low-poly / PS1 horror. Duración objetivo: ~60 minutos, un solo playthrough lineal.

## Premisa

El jugador controla a un personaje que pasa la noche solo en casa durante una tormenta. Golpes en una ventana lo obligan a levantarse. A medida que explora la casa, encuentra un rastro de sangre y vísceras, escucha pasos y voces que nunca lo alcanzan. En el clímax descubre que él mismo, en un episodio disociativo, asesinó a su familia — los pasos "detrás suyo" eran los suyos, desfasados en el tiempo. El final es un bucle: la tormenta vuelve a empezar.

**Tema:** el monstruo no es sobrenatural, es la propia mente del jugador negando lo que hizo.

## Estructura por actos

### Acto 1 — Despertar (≈20 min)

1. Jugador acostado en la cama, mirando al techo. Sin control de movimiento (cámara fija o con leve libertad de mirar).
2. Golpes en la ventana. Se habilita el movimiento.
3. El jugador va a la ventana, mira hacia afuera: tormenta, lluvia, nada visible.
4. Al alejarse, se escucha una ventana romperse en otra habitación.
5. El jugador va a revisar: solo vidrios rotos en el piso y agua entrando. Nada más.
6. Exploración libre de la casa (~15 min). Atmósfera tenebrosa: voces de fondo apenas audibles, pasos detrás del jugador que se detienen si él se da vuelta.
7. El personaje comenta que "huele a muerto". Objetivo: ir a la cocina.

### Acto 2 — El rastro (≈15 min)

1. En la cocina: un rastro de vísceras y sangre en el piso.
2. El jugador sigue el rastro; lleva a un armario.
3. Abre el armario: no hay nada. Los sonidos (voces, pasos) se intensifican notablemente a partir de este punto.

### Acto 3 — La verdad (≈20-25 min)

1. **Corte de luz.** La casa se queda sin electricidad. El jugador depende de una fuente de luz limitada (linterna de celular / vela).
2. **Primer contacto.** El jugador ve una silueta de reojo al final de un pasillo; al iluminarla, desaparece. Un espejo cercano muestra su propio reflejo moviéndose con un pequeño delay.
3. **Bucle espacial.** Siguiendo la voz/rastro, el jugador vuelve siempre a su habitación sin importar la ruta. Cada vuelta añade un detalle nuevo (foto familiar rota, mensaje en el celular, manchas nuevas) — pistas del crimen.
4. **Persecución.** Algo lo persigue activamente por la casa. Mecánica de correr + esconderse (armario / debajo de la cama) con indicador de respiración/ruido. Un vistazo con la linterna revela que la silueta persecutora viste su misma ropa.
5. **Cuarto de la revelación.** El origen del rastro: la familia del jugador, muerta. Un cuchillo con sus propias huellas y sangre en sus manos. El espejo muestra su reflejo hablándole o sonriendo, confirmando que él lo hizo.
6. **Flashback.** Secuencia corta (20-30s), distorsionada (audio invertido, colores desaturados), del momento del crimen, disparada por el sonido de la tormenta.
7. **Final ambiguo.** El jugador "despierta" de nuevo en la cama del inicio. La tormenta y los golpes en la ventana comienzan otra vez. Corte a negro. Implica que el ciclo se repite cada tormenta.

## Mecánicas principales

- **Movimiento en primera persona** (caminar, correr limitado, agacharse para esconderse).
- **Linterna con batería limitada** (Acto 3): consume batería al usarla, atrae al perseguidor si se usa cerca de él.
- **Sistema de esconderse**: armarios/camas como refugios; mecánica de contener la respiración (minijuego simple de input, ej. mantener presionado sin exceder un límite de "ruido").
- **Persecución (Chase AI)**: NavMeshAgent que patrulla/persigue basado en línea de visión y ruido del jugador.
- **Eventos con script (Scripted Events)**: golpes en la ventana, vidrio rompiéndose, corte de luz, delay del espejo — todos disparados por triggers de colisión o proximidad, no por IA compleja.
- **Bucle de pasillo**: teletransporte disfrazado (el jugador cruza un trigger al final del pasillo y reaparece en un punto anterior) para simular el loop espacial sin necesidad de geometría infinita.

## Audio (crítico para el terror psicológico)

- Voces de fondo (susurros, apenas inteligibles) — subir volumen/intensidad por acto.
- Pasos detrás del jugador — sonido posicional 3D, se detiene si el jugador se gira (raycast/ángulo de cámara).
- Tormenta y lluvia constantes (loop de fondo).
- Sting de audio para los sustos puntuales (vidrio, persecución).
- Distorsión de audio (pitch/reverse) para el flashback final.

## Estilo visual

Low-poly / PS1 horror: geometría simple, texturas de baja resolución con dithering, iluminación dinámica limitada (uso de sombras duras y niebla para ocultar detalle), paleta de colores apagada con acentos rojos (sangre) y azules (tormenta).

## Escenas de Unity (a crear en el Editor)

1. `MainMenu` (opcional/simple)
2. `House_Act1` — dormitorio, ventana, pasillo, sala, cocina inicial
3. `House_Act2` — cocina (rastro), armario
4. `House_Act3` — pasillo con loop, cuarto de revelación, secuencia de flashback
5. `Ending` (o reutilizar House_Act1 con estado alterado)

> Nota: las escenas `.unity` requieren el Editor de Unity para construirse correctamente (geometría, luces, NavMesh, wiring de componentes en el Inspector). Este repo incluye la estructura de proyecto, scripts y guía de blockout — el armado visual en el Editor es el siguiente paso manual. Ver `Docs/SceneBlockout.md`.
