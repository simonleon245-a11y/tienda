# La Tormenta — Juego de Terror Psicológico

Walking sim de terror psicológico en primera persona, Unity 3D, estilo low-poly / PS1 horror. Duración objetivo: ~60 minutos.

## Documentación

- [`Docs/GDD.md`](Docs/GDD.md) — historia completa, actos, mecánicas y estructura de escenas.
- [`Docs/AssetList.md`](Docs/AssetList.md) — assets necesarios y cómo generarlos con IA (sin comprar nada).
- [`Docs/SceneBlockout.md`](Docs/SceneBlockout.md) — guía paso a paso para armar cada escena en el Editor de Unity.
- [`Docs/ModelPrompts.md`](Docs/ModelPrompts.md) — prompts exactos para generar los modelos 3D low-poly con IA.
- [`Docs/AudioPrompts.md`](Docs/AudioPrompts.md) — prompts exactos para ambiente, voces y efectos de sonido.
- [`Docs/MainMenuDesign.md`](Docs/MainMenuDesign.md) — concepto y blockout del menú principal (diegético, sin pantalla genérica).

## Proyecto Unity

El proyecto vive en [`GameProject/`](GameProject). Incluye la estructura de carpetas, `Packages/manifest.json` y todos los scripts de C# (`Assets/Scripts`) para las mecánicas principales:

- `Player/` — movimiento en primera persona, linterna con batería, sigilo/escondite, interacción.
- `Horror/` — eventos scripteados (golpes en la ventana, vidrio rompiéndose, corte de luz, espejo con delay, bucle de pasillo, persecución con NavMesh).
- `Audio/` — intensidad de audio global (susurros/pasos), zonas de susurro, pasos direccionales.
- `Core/` — estado del juego (acto actual, nivel de intensidad, conteo de vueltas del loop).
- `UI/` — batería de la linterna, prompts de interacción.

### Cómo abrir el proyecto

1. Instalar Unity Hub y la versión de Unity indicada en `GameProject/ProjectSettings/ProjectVersion.txt` (2022.3 LTS).
2. Abrir el proyecto apuntando a la carpeta `GameProject/`.
3. Unity generará automáticamente `Library/`, `Temp/` y los archivos de solución al abrir por primera vez (no están en el repo, ver `.gitignore`).

### Siguiente paso (manual, en el Editor)

Este repo no incluye archivos `.unity` de escena: requieren el Editor para colocar geometría, bakear NavMesh e iluminar. Seguir `Docs/SceneBlockout.md` para construir `House_Act1`, `House_Act2` y `House_Act3`, colocar los scripts en los GameObjects correspondientes y conectar las referencias en el Inspector.
