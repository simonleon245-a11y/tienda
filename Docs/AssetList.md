# Lista de Assets (generables con IA, sin comprar)

Estilo objetivo: low-poly / PS1 horror (pocos polígonos, texturas pequeñas con dithering, sin necesidad de detalle fotorrealista). Esto reduce mucho la cantidad de trabajo de generación.

## Modelos 3D (props/muebles)

Herramientas sugeridas: **Meshy AI**, **Tripo3D**, **Luma AI Genie** (texto/imagen → modelo 3D, exportan a .glb/.fbx compatibles con Unity). Pide siempre "low poly, PS1 style, flat shading" en el prompt para simplificar el resultado y que encaje con el estilo.

- Cama, mesa de noche, ventana con marco, cortinas
- Puertas (dormitorio, cocina, armario, pasillo)
- Muebles de cocina: mesada, alacena, mesa, sillas, heladera
- Armario (dormitorio y de la escena de revelación)
- Sofá, mesa de living, TV vieja
- Espejo (necesita un plano separado para el efecto de reflejo con delay, ver scripts)
- Props de rastro: charcos de sangre (decal/textura), vísceras (mesh simple deformado)
- Vidrios rotos (mesh fracturado simple o sprites en el piso)
- Cuchillo (prop de la escena final)
- Fotos familiares (marcos + textura generada con IA de imagen, ej. Stable Diffusion/DALL-E, estilo foto antigua)
- Celular (prop interactuable, pantalla con textura de mensaje)

## Texturas

Generables con cualquier modelo de imagen IA (Stable Diffusion, DALL-E, Midjourney): pedir texturas tileable, baja resolución (64x64 a 256x256), paleta apagada. Útil para pisos de madera, paredes, tapizado, sangre/manchas.

## Audio

- **Ambiente de tormenta/lluvia**: bancos de sonido libres (freesound.org, CC0) o generación con IA de audio (ElevenLabs Sound Effects, Stable Audio).
- **Voces susurrantes**: generar con TTS (ElevenLabs) frases cortas e ininteligibles, luego aplicar reverb/pitch down en post.
- **Pasos**: grabación simple propia o freesound + variaciones de pitch en Unity (evita necesidad de múltiples archivos).
- **Stings de susto**: Stable Audio / ElevenLabs SFX con prompts tipo "sudden horror stinger, distorted".
- **Voz del personaje** (líneas como "huele a muerto"): ElevenLabs TTS.

## Iluminación y post-procesado (no son "assets", son configuración en Unity)

- URP (Universal Render Pipeline) + Volume con Post-Processing: viñeta, grano, aberración cromática leve, color grading desaturado.
- Niebla (Fog) para ocultar límites del nivel y ayudar al low-poly a lucir intencional.
- Luces dinámicas limitadas: la linterna del jugador como fuente principal en el Acto 3.

## Prioridad de generación (para no bloquear el desarrollo)

1. Geometría base de la casa (paredes, pisos, techos) — puede armarse con primitivas de Unity (cubos escalados) sin necesidad de IA, es más rápido y controlable para el blockout.
2. Props clave de la narrativa: ventana, armario, cuchillo, fotos, espejo.
3. Audio ambiente y voces (impacto más directo en el terror que el detalle visual).
4. Props decorativos (menor prioridad, se puede agregar al final).
