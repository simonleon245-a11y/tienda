# Prompts de Audio (ElevenLabs Sound Effects / TTS, Stable Audio)

Dos tipos de generación distintos:

- **SFX/ambiente** (ElevenLabs Sound Effects, Stable Audio): prompts descriptivos en inglés — dan resultados más consistentes en estas herramientas.
- **Voces del personaje y susurros** (ElevenLabs Text-to-Speech): el guion va en **español**, porque es diálogo real del juego.

## Herramientas

- **ElevenLabs Sound Effects**: texto → efecto de sonido corto (hasta ~22s). Tiene parámetro de duración y "loop" opcional.
- **ElevenLabs TTS**: texto → voz. Podés elegir una voz base y ajustar *Stability* (bajo = más inestable/tembloroso, ideal para terror) y *Similarity/Style*.
- **Stable Audio**: mejor para ambientes largos en loop (tormenta, drones de tensión).

---

## 1. Ambiente base (loops largos, Stable Audio o ElevenLabs SFX con "loop" activado)

**Tormenta y lluvia (loop principal, suena todo el juego):**
```
Heavy rainstorm with distant rolling thunder, steady rain hitting windows and roof, occasional strong wind gusts, continuous ambient loop, no music, dark and oppressive atmosphere
```

**Tensión de fondo (drone de tensión, sube de volumen con la intensidad):**
```
Low ominous drone, subtle dissonant string tension, unsettling atmospheric hum, very quiet and distant, horror ambience, no rhythm, no melody
```

**Crujidos de la casa (capa suelta, disparada al azar):**
```
Old wooden house creaking and settling, subtle floorboard groans, distant pipe knocking, isolated short sound, no reverb tail added
```

---

## 2. Voces susurrantes (TTS en español + procesamiento)

Generá estas frases con ElevenLabs TTS, voz neutra/susurrada si la voz lo permite, *Stability* baja. Después en Unity/DAW aplicá: bajar volumen a -20/-30dB, reverb largo (sala grande), pasa-bajos (low-pass ~2000Hz) para simular "detrás de una pared", y capas superpuestas de 2-3 tomas distintas para que no se entienda del todo — el objetivo es que el jugador sienta que casi entendió algo, no que lo entienda.

Frases sugeridas (usar 2-3 por zona de susurro, distribuidas por la casa):

```
No deberías haber mirado.
Está detrás de ti.
¿Por qué corriste?
Todavía estamos acá.
No fue un sueño.
Date la vuelta.
Ya lo sabés.
No hay nadie más en esta casa.
```

Para el Acto 3 (más directas, casi audibles, cerca del clímax):
```
Fuiste vos.
Mira el espejo.
No lo vas a olvidar otra vez.
```

---

## 3. Pasos (ElevenLabs SFX, generar una toma corta y usar variación de pitch en Unity para no repetir igual)

**Pasos sobre madera (detrás del jugador):**
```
Single set of slow footsteps on a creaky wooden floor, deliberate pace, isolated sound, no reverb, no music
```

**Pasos descalzos (más orgánico, para la persecución):**
```
Bare feet footsteps on a wooden floor, fast and urgent pace, wet slight squelch on impact, isolated sound, no music
```

**Respiración de persecución (loop corto para cuando el monstruo está cerca):**
```
Heavy labored breathing, close and intimate, slightly wet and raspy, tense and threatening, isolated sound, no music
```

---

## 4. Eventos puntuales (stings y SFX de escenas)

**Golpes en la ventana (Acto 1, inicio):**
```
Three sharp knocks on a glass window pane, hollow and deliberate, from outside, isolated sound, no reverb
```

**Vidrio rompiéndose (Acto 1):**
```
A glass window pane shattering violently, sharp crack followed by falling glass shards, isolated sound, no music
```

**Agua entrando por la ventana rota (loop corto, ambiente localizado):**
```
Rain and wind blowing through a broken window, water dripping onto a wooden floor, continuous loop, no music
```

**Puerta de armario abriéndose (Acto 2, vacío):**
```
An old wooden closet door creaking open slowly, rusty hinges, isolated sound, no reverb
```

**Corte de luz (Acto 3):**
```
Electrical power cutting out, a brief buzz and click followed by a low hum fading to silence, isolated sound
```

**Sting de "primer contacto" (silueta que desaparece):**
```
Sudden sharp horror stinger, distorted low-frequency hit with a high-pitched screech, short and jarring, no music
```

**Sting de persecución empieza (el jugador ve que lo persigue):**
```
Intense horror chase stinger, sudden loud distorted hit with a rising tension sweep, aggressive and jarring
```

**Casi atrapado (cuando el monstruo casi alcanza al jugador):**
```
A loud violent screeching stinger combined with a guttural distorted growl, very close and aggressive, short burst
```

**Espejo — reflejo hablando (Acto 3, revelación):**
```
A whispered voice with unnatural reverb, slightly reversed and pitched down, unsettling and wrong, isolated line
```
> Para esta usá una toma de TTS de la línea "Fuiste vos" y en post-producción invertí una copia superpuesta a bajo volumen (efecto clásico de voz "al revés" mezclada con la voz normal).

---

## 5. Líneas de voz del personaje (TTS, diálogo interno)

Guion completo en orden de aparición. Voz sugerida: adulta, tono cansado/ansioso, *Stability* media-baja para que suene algo quebrada en los momentos de tensión.

**Acto 1:**
```
¿Qué fue eso?
Hola? ¿Hay alguien ahí afuera?
No hay nada... habrá sido el viento.
¿Escuchaste eso?
Huele a muerto. Viene de la cocina.
```

**Acto 2:**
```
¿Qué es esto...? Hay sangre en el piso.
Va hacia el armario.
No hay nada. No entiendo.
```

**Acto 3:**
```
¿Por qué se cortó la luz?
Hola... ¿quién anda ahí?
Otra vez este pasillo... ya pasé por acá.
No, no, esto no puede ser real.
No... no, yo no hice esto.
```

**Línea final (loop, mismo tono que el inicio):**
```
¿Qué fue eso?
```

---

## 6. Flashback (Acto 3, secuencia distorsionada)

**Base para la secuencia (Stable Audio o capa de música):**
```
Distorted nightmarish drone, warped and reversed audio texture, dissonant and disturbing, slowly building intensity, no clear rhythm
```

**Procesamiento adicional (en Unity o DAW, no generado por IA):** invertir la línea de diálogo del flashback, bajar el pitch ~20%, aplicar distorsión/bitcrush leve y un filtro paso-bajo que se abre gradualmente hacia el final de la secuencia (simulando "recuperar la conciencia").

---

## Notas de mezcla (Audio Mixer en Unity)

- Grupos separados: **Ambience** (tormenta, drone), **Whispers**, **Footsteps**, **Voice** (diálogo del personaje), **Stingers**. Esto es lo que controla `AudioIntensityManager` (ya armado en el proyecto) subiendo el volumen de Whispers/Footsteps por nivel de intensidad.
- Los susurros y pasos nunca deben ser 100% claros hasta el Acto 3 — mezclarlos siempre con algo de reverb/low-pass para que se sientan "fuera de foco".
- Los stingers van sin reverb y a volumen alto — el contraste con el resto (todo apagado/distante) es lo que los hace efectivos.

## Orden sugerido de generación

1. Tormenta/lluvia (loop base) + golpes en la ventana + vidrio rompiéndose — necesario desde el minuto uno.
2. Pasos y 2-3 frases de susurro — para la exploración del Acto 1.
3. Líneas de diálogo del personaje (los 3 actos completos).
4. Corte de luz, stingers de persecución/casi atrapado, respiración de persecución — Acto 3.
5. Audio del flashback y mezcla final.
