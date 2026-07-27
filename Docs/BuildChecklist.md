# Checklist Maestro — De Cero al Juego Jugable

Seguí esto de arriba hacia abajo, tildando cada casillero. Cada fase linkea al documento con el detalle completo si lo necesitás — este checklist te dice **qué hacer y en qué orden**, los otros documentos tienen el **contenido exacto** (prompts, nombres, jerarquías).

---

## Fase 0 — Instalar herramientas

- [ ] Unity Hub
- [ ] Unity **2022.3 LTS** (misma versión que `GameProject/ProjectSettings/ProjectVersion.txt`)
- [ ] Cuenta en **Meshy AI** o **Tripo3D** (modelos 3D)
- [ ] Cuenta en **ElevenLabs** (voces + efectos de sonido)
- [ ] (Opcional) Cuenta en **Stable Audio** para el ambiente de tormenta en loop largo

## Fase 1 — Abrir el proyecto

- [ ] Bajar/clonar la rama del repo
- [ ] Abrir la carpeta `GameProject/` desde Unity Hub (no la raíz del repo — el proyecto de Unity vive ahí adentro)
- [ ] Dejar que Unity importe los paquetes (URP, AI Navigation, Timeline — ya están en `Packages/manifest.json`). Si aparece un popup pidiendo activar URP, aceptar.

## Fase 2 — Configuración base del proyecto

- [ ] **Tags** (Edit > Project Settings > Tags and Layers): crear `Player`
- [ ] **Layers**: crear `Player`, `Interactable`, `Walls`, `Enemy`
- [ ] Crear las carpetas que faltan dentro de `Assets/` según [`UnityHierarchyGuide.md`](UnityHierarchyGuide.md) sección 1 (`Scenes`, `Models`, `Textures`, `Materials`, `Prefabs`, `Audio`, `Mixer`)

## Fase 3 — Generar y organizar los assets

- [ ] Generar los modelos 3D usando los prompts de [`ModelPrompts.md`](ModelPrompts.md), en el orden sugerido ahí (casa exterior → props Acto 1 → Acto 2 → Acto 3 → decorativos)
- [ ] Al importar cada modelo, renombrarlo con el prefijo `SM_...` (tabla completa en [`UnityHierarchyGuide.md`](UnityHierarchyGuide.md) sección 9) y guardarlo en la subcarpeta de `Assets/Models/` que corresponda
- [ ] Generar el audio usando los prompts de [`AudioPrompts.md`](AudioPrompts.md), en el orden sugerido ahí
- [ ] Guardar cada audio en la subcarpeta de `Assets/Audio/` que corresponda (Ambience/Whispers/Footsteps/Voice/Stingers)

> No hace falta tener el 100% de los assets para seguir avanzando — podés armar las escenas con cubos grises de placeholder y reemplazarlos después. Priorizá los props narrativos (ventanas, armario, espejo, cuchillo) sobre los decorativos.

## Fase 4 — Audio Mixer

- [ ] Crear `Assets/Mixer/MasterMixer.mixer` (click derecho > Create > Audio Mixer)
- [ ] Armar la jerarquía de grupos: `Master` → `Ambience`, `Voice`, `SFX` → `Whispers`, `Footsteps`, `Stingers`
- [ ] Exponer los 6 parámetros con los nombres **exactos** de la tabla en [`UnityHierarchyGuide.md`](UnityHierarchyGuide.md) sección 5 (`MasterVolume`, `AmbienceVolume`, `SFXVolume`, `VoiceVolume`, `WhisperVolume`, `FootstepVolume`)

## Fase 5 — Escena `MainMenu`

- [ ] Crear la escena `Assets/Scenes/MainMenu.unity`
- [ ] Armar el Canvas siguiendo el árbol de [`MainMenuDesign.md`](MainMenuDesign.md)
- [ ] Colocar `_Systems/GameManager` (script `GameManager`) y `_Systems/GameSettingsManager` (script `GameSettingsManager`, asignarle `MasterMixer` y el `Volume` de post-procesado)
- [ ] Conectar cada botón a los métodos públicos de `MainMenuController` (`OnPlayPressed`, `OnSettingsPressed`, `OnCreditsPressed`, `OnQuitPressed`)
- [ ] Conectar `SettingsMenuUI` (pestañas Video/Audio/Controles) a sus Dropdowns/Sliders/Toggles
- [ ] **Guardar como prefabs** los GameObjects `GameManager` y `GameSettingsManager` (arrastrarlos a `Assets/Prefabs/`) — los vas a necesitar en la Fase 6 para `SceneBootstrap`
- [ ] Probar: Play, que el fade al presionar Jugar funcione, que Opciones muestre los valores correctos

## Fase 6 — Escena `House_Act1` (la más grande — ir por partes)

### 6.1 Blockout con primitivas

- [ ] Armar los cuartos con cubos escalados (dormitorio, pasillo, living, cocina, armarios, cuarto de revelación) siguiendo [`SceneBlockout.md`](SceneBlockout.md)

### 6.2 Jugador

- [ ] Crear `Player` (Tag `Player`, Layer `Player`) con `CharacterController`, `PlayerController`, `PlayerInteractor`, `HideState`
- [ ] `CameraPivot` hijo con la Main Camera y la `Flashlight` (Light Spot + `FlashlightController`)

### 6.3 Cableado del Acto 1

- [ ] `WindowKnockEvent` en el dormitorio (deshabilita movimiento al inicio, lo habilita tras el golpe)
- [ ] `Window_Intact` con `WindowLookEvent`
- [ ] `Window_ToBreak` con `GlassBreakEvent`
- [ ] Repartir 2-3 `FootstepAudioTrigger` y 2-3 `WhisperAudioZone` (con Trigger Collider) por la casa

### 6.4 Cableado del Acto 2

- [ ] Secuencia de decals `BloodTrail_01...N` hacia el armario de la cocina
- [ ] `ClosetDoor_Kitchen` con `ClosetCheckEvent`

### 6.5 Cableado del Acto 3

- [ ] `PowerOutageEvent` (Trigger Collider en la transición Acto2→Acto3)
- [ ] `Mirror` con `MirrorDelayEffect` + `ReflectionRig` hijo
- [ ] `LoopEndTrigger` (`TeleportLoopTrigger`) + `BedroomReturnPoint` (Transform vacío) + `LoopDetail_01/02/03` (inactivos)
- [ ] `Entity` (Layer `Enemy`) con `NavMeshAgent` + `ChaseAI`, inicialmente oculta/inactiva hasta que `TeleportLoopTrigger` la active
- [ ] `HidingSpot_Closet` y `HidingSpot_UnderBed` (`HidingSpot`) en el dormitorio
- [ ] `RevelationRoom` con los cuerpos, `Knife` (Interactable), `Mirror_Final`
- [ ] Trigger en `RevelationRoom` que carga `Flashback` de forma aditiva (`SceneManager.LoadScene("Flashback", LoadSceneMode.Additive)`)

### 6.6 UI / HUD

- [ ] Canvas HUD con `BatteryUI` e `InteractionPrompt`
- [ ] `PausePanel` con `PauseMenuController`, `SettingsSubPanel` (mismo `SettingsMenuUI` que el menú principal) y `QuitToMenuConfirmationDialog`

### 6.7 Sistemas de la escena

- [ ] `_Systems/AudioIntensityManager` (asignar `MasterMixer`)
- [ ] `_Systems/SceneBootstrap` (asignar los prefabs de `GameManager`/`GameSettingsManager` guardados en la Fase 5)

### 6.8 NavMesh

- [ ] Marcar toda la geometría sólida (paredes, piso, muebles grandes) como **Navigation Static**
- [ ] Window > AI > Navigation > **Bake**

## Fase 7 — Escena `Flashback`

- [ ] Crear la escena, cámara fija, `AudioSource` con el audio distorsionado
- [ ] `FlashbackSequenceController` (al terminar la duración configurada, llama a `GameManager.RestartCycle()`, que recarga `House_Act1` y descarga automáticamente esta escena)

## Fase 8 — Build Settings

- [ ] File > Build Settings > Add Open Scenes, en este orden exacto: `MainMenu` (0), `House_Act1` (1), `Flashback` (2)

## Fase 9 — Playtest (probar cada mecánica de punta a punta)

- [ ] Menú: resolución (incluye 4K), FPS, brillo y volumen se guardan y se aplican al reabrir
- [ ] Acto 1: golpes en la ventana → se habilita el movimiento → ventana vacía → el vidrio se rompe al alejarse → pasos/susurros ambientan la exploración
- [ ] Acto 2: el rastro de sangre lleva al armario → armario vacío → sube la intensidad de audio (pasos/susurros más fuertes)
- [ ] Acto 3: corte de luz → linterna se puede prender/apagar y gasta batería → espejo con delay perceptible → el pasillo lleva de vuelta al dormitorio 2-3 veces (con detalles nuevos cada vez) → arranca la persecución → esconderse funciona (aguantar la respiración) → llegada al cuarto de revelación → flashback → vuelve a cargar `House_Act1` desde el inicio (el bucle)
- [ ] Pausa (Esc) funciona en cualquier momento excepto mientras estás escondido

## Fase 10 — Pulido final

- [ ] Player Settings: nombre del juego, ícono, resolución por defecto
- [ ] Revisar el Volume de post-procesado (viñeta, grano, desaturación) para el look low-poly/PS1
- [ ] File > Build Settings > Build (Windows, o la plataforma que uses)

---

## Si el tiempo apremia: orden de prioridad

1. Acto 1 completo y jugable de punta a punta (aunque sea con cubos grises).
2. Audio Mixer + susurros/pasos (el terror psicológico vive más en el audio que en el detalle visual).
3. Acto 2 y Acto 3 con los props narrativos clave (ventana, armario, espejo, cuchillo) — los decorativos van al final.
4. Menú y pausa (ya están armados en código, solo falta el wiring visual).
5. Pulido de post-procesado y build final.

## Problemas comunes (troubleshooting)

| Síntoma | Causa probable |
|---|---|
| El jugador no se mueve | Falta el Tag `Player`, falta `CharacterController`, o algún evento (`WindowKnockEvent`) no habilitó `MovementEnabled` |
| El volumen no cambia al mover un slider | El nombre del parámetro expuesto en el Mixer no coincide **exactamente** (mayúsculas incluidas) con el string en el script |
| No aparece el prompt de interacción | El objeto no está en el Layer `Interactable`, o `PlayerInteractor.interactableLayers` no incluye ese Layer |
| El enemigo no persigue | Falta bakear el NavMesh, o las paredes no están en el Layer `Walls` asignado a `ChaseAI.sightBlockingLayers` |
| 4K no aparece en el dropdown de resolución | No debería pasar — `ResolutionUtility` lo garantiza siempre. Revisar que `SettingsMenuUI` esté leyendo `GameSettingsManager.Instance.AvailableResolutions` |
| La escena `House_Act1` tira errores de referencia nula al abrirla sola en el Editor | Falta asignar los prefabs en `SceneBootstrap`, o abriste la escena sin haber pasado por `MainMenu` y sin `SceneBootstrap` configurado |
