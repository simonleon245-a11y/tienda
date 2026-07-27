# Prompts para generación de modelos 3D (Meshy AI / Tripo3D / Luma Genie)

Los prompts están en inglés porque los modelos de texto-a-3D (Meshy, Tripo3D, Luma) están entrenados mayormente con datasets en inglés y dan resultados mucho más consistentes en ese idioma. Copia y pega tal cual.

## Sufijo de estilo (agregar al final de CADA prompt)

```
, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

## Prompt negativo (si la herramienta lo permite)

```
photorealistic, PBR materials, high detail, smooth shading, subdivision surface, realistic textures, high poly, ray traced, 4k texture, sharp clean render
```

## Configuración recomendada

- **Topología:** quad, no triangulada si la herramienta lo permite.
- **Polycount objetivo:** 300–1500 triángulos por prop pequeño/mediano (muebles grandes hasta 3000).
- **Resolución de textura:** 128×128 a 256×256 (usar "pixelated" o "low-res texture" en el prompt ayuda a Meshy a no generar detalle innecesario).
- **Simetría:** activarla para muebles (camas, puertas, sillas, heladera).
- **Formato de exportación:** `.fbx` o `.glb` (ambos compatibles con Unity).

---

## Estructura de la casa

**Importante — leer antes de generar esto:** el *interior* (los cuartos donde el jugador camina: dormitorio, pasillo, cocina, armarios) **no conviene generarlo como un mesh único de IA**. Necesitás poder mover paredes, ubicar puertas exactas, bakear NavMesh y armar el truco del pasillo en bucle del Acto 3 — todo eso se hace mucho más fácil con las paredes/pisos como cubos escalados en Unity (ProBuilder o primitivas), tal como ya indica `Docs/SceneBlockout.md`. Los prompts de acá abajo son para la **casa vista desde afuera** (lo que se ve por la ventana, el establishing shot inicial, y una posible silueta bajo la tormenta), donde sí sirve un modelo generado de una sola vez porque nunca se camina sobre él ni necesita colisión precisa.

**Casa completa, vista exterior (para el plano que se ve por la ventana / silueta bajo la lluvia):**
```
A small isolated two-story house at night, wooden siding, pitched roof, single dim light in one window, standing alone in heavy rain, ominous and abandoned feeling, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Versión alternativa (casa de un piso, si preferís algo más chico/rural):**
```
A small isolated one-story wooden house at night, sagging porch, single chimney, dim light in one window, surrounded by darkness and rain, ominous and abandoned feeling, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

> Nota: generá esta casa a baja resolución de textura y sin preocuparte por el interior (los modelos de texto-a-3D no van a resolver bien cuartos internos) — se usa solo como "caja" vista desde afuera. En Unity, colocala detrás de la ventana del dormitorio, sin colisión, e iluminala con relámpagos ocasionales (Light con flicker) para el efecto de silueta.

**Kit modular exterior** (si en algún momento agregás una escena donde el jugador sale o se ve la entrada de cerca — más flexible que la casa completa de una sola pieza):

**Segmento de pared exterior con revestimiento de madera:**
```
A wooden exterior house wall panel segment, horizontal siding boards, weathered and worn, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Sección de techo a dos aguas:**
```
A pitched roof section with dark wooden shingles, simple gable shape, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Puerta principal de entrada:**
```
A weathered wooden front door with a small window pane and an old metal knob, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Chimenea:**
```
A simple brick chimney stack, weathered and slightly crumbling, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Porche de entrada con escalones:**
```
A small wooden porch with sagging steps and a simple railing, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

---

## Dormitorio

**Cama:**
```
A simple single bed with a wooden frame, thin mattress, wrinkled blanket, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Mesa de noche:**
```
A small wooden nightstand with one drawer and a lamp on top, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Ventana con marco (versión intacta):**
```
A wooden window frame with four glass panes intact, rain droplets on glass, simple curtains hanging beside it, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Ventana rota (versión post-evento):**
```
A wooden window frame with shattered broken glass, jagged glass shards remaining in the frame, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Cortinas:**
```
A pair of long hanging fabric curtains, slightly worn and faded, simple folds, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Armario (dormitorio, con puertas que abren):**
```
A tall wooden wardrobe closet with two front doors, simple metal handles, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

## Puertas

**Puerta interior genérica (dormitorio/pasillo/cocina):**
```
A plain wooden interior door with a simple round doorknob, slightly scratched surface, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Puerta de armario de revelación (más deteriorada):**
```
A worn wooden closet door with a rusty handle, scratches and dark stains near the bottom edge, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

## Cocina

**Mesada de cocina:**
```
A kitchen counter with cabinets underneath and a built-in sink, simple faucet, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Alacena:**
```
A wall-mounted kitchen cabinet with two small doors, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Mesa de cocina:**
```
A small wooden kitchen table with four legs, worn wood texture, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Sillas de cocina:**
```
A simple wooden kitchen chair with a straight backrest, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Heladera:**
```
An old vintage refrigerator, rounded corners, single door with a metal handle, slightly rusted, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

## Living

**Sofá:**
```
An old worn fabric sofa with sagging cushions, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Mesa de living (ratona):**
```
A low wooden coffee table with simple straight legs, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**TV vieja:**
```
An old bulky CRT television on a small stand, thick plastic casing, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

## Props narrativos clave (requieren más cuidado, la cámara se detiene en ellos)

**Espejo (marco; el plano de reflejo se hace aparte con render texture, no generar el "reflejo" como modelo):**
```
An old wall mirror with a simple wooden frame, slightly tarnished glass edges, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Cuchillo (prop de la escena final):**
```
A kitchen knife with a wooden handle and a stained blade, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Marco de foto familiar (vacío; la foto va como textura/imagen aparte generada con un modelo de imagen, no de 3D):**
```
A small simple wooden picture frame, standing upright, empty front panel, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Celular (prop interactuable, pantalla como textura aparte):**
```
A simple old-model mobile phone with a small screen and physical buttons, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

## Rastro de sangre y vísceras

**Vísceras (mesh simple, se coloca en secuencia sobre el piso siguiendo el camino a la cocina):**
```
A pile of grotesque entrails and viscera lying on the floor, wet glistening texture, dark red color, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

**Charco de sangre (mejor como decal/textura plana en vez de modelo 3D — ver nota abajo):**
```
A dark red blood puddle texture on a floor, irregular edges, subtle wetness highlight, low-res dithered pixel texture, flat shading, no photorealism, retro survival horror style
```
> Nota: para charcos de sangre conviene generar esto como **textura/decal** (imagen 2D con IA de imágenes, ej. Stable Diffusion, prompt: "dark red blood puddle, top-down view, pixel art texture, PS1 horror game style, tileable edges") y aplicarla sobre un plano en Unity (Decal Projector de URP), no como modelo 3D — es más liviano y fácil de repetir a lo largo del rastro.

**Vidrios rotos en el piso (fragmentos sueltos, separados del marco de la ventana):**
```
Scattered broken glass shards on the floor, sharp jagged pieces, low-poly, PS1 horror style, flat shading, hard edges, limited color palette, dithered low-res texture, blocky simple geometry, no photorealism, retro survival horror asset
```

---

## Texturas de imagen (generador de imágenes, no de 3D)

Para paredes, pisos y la foto familiar, usa un modelo de imágenes (Stable Diffusion, DALL-E) con este tipo de prompt:

**Piso de madera:**
```
tileable wood floor texture, worn planks, low-res pixel art, desaturated colors, PS1 horror game style
```

**Papel tapiz/pared:**
```
tileable old wallpaper texture, faded floral pattern, stained, low-res pixel art, desaturated colors, PS1 horror game style
```

**Foto familiar (para el marco vacío):**
```
old faded family photograph, grainy analog film look, low-res pixel art texture, desaturated colors, unsettling composition, PS1 horror game style
```

---

## Orden sugerido de generación

0. Casa exterior (silueta bajo la lluvia) — no bloquea nada del gameplay, pero es el primer plano que ve el jugador (menú principal y vista por la ventana), conviene tenerlo temprano para probar la atmósfera general.
1. Ventana (intacta + rota), armario del dormitorio, cama — necesarios para el Acto 1.
2. Mesada, vísceras, charco de sangre (decal), armario de revelación — Acto 2.
3. Espejo, cuchillo, marco de foto, celular — Acto 3 (los props más importantes narrativamente).
4. Muebles decorativos (sofá, TV, sillas) — relleno, menor prioridad.
