# Guía de Nombres y Jerarquía de Unity

Esta es la referencia única para que todo lo generado (modelos, audio) y todo lo ya escrito en código (`Assets/Scripts`) encaje sin tener que adivinar nombres. Varios de estos nombres **no son solo organización** — están escritos como texto literal dentro del código (tags, nombre de escena, parámetros del Mixer) y si no coinciden exactamente, esa parte deja de funcionar.

## 1. Carpetas dentro de `Assets/`

Ya existen `Scripts/*`. Agregar estas al importar assets:

```
Assets/
├── Scenes/
├── Models/
│   ├── House/          (exterior, kit modular)
│   ├── Bedroom/
│   ├── Kitchen/
│   ├── LivingRoom/
│   └── Props/          (espejo, cuchillo, marco de foto, celular, vísceras, vidrios)
├── Textures/
│   ├── Floors/
│   ├── Walls/
│   ├── Decals/          (charco de sangre)
│   └── Photos/          (foto familiar)
├── Materials/
├── Prefabs/
│   ├── Furniture/
│   ├── Interactables/
│   ├── Enemies/
│   └── UI/
├── Audio/
│   ├── Ambience/
│   ├── Whispers/
│   ├── Footsteps/
│   ├── Voice/
│   └── Stingers/
└── Mixer/
```

## 2. Tags (Edit > Project Settings > Tags and Layers)

| Tag | Uso |
|---|---|
| `Player` | En el GameObject raíz del jugador. Requerido literalmente por `TeleportLoopTrigger`, `PowerOutageEvent`, `WhisperAudioZone` (usan `CompareTag("Player")`). |

## 3. Layers

| Layer | Uso |
|---|---|
| `Player` | El jugador (para que sus propios colliders no tapen sus raycasts). |
| `Interactable` | Todo objeto con un script que hereda de `Interactable` (ventana, armario, etc.). Asignar en `PlayerInteractor.interactableLayers`. |
| `Walls` | Geometría sólida de la casa (paredes, muebles grandes). Asignar en `ChaseAI.sightBlockingLayers` para que la IA no vea al jugador a través de paredes. |
| `Enemy` | La entidad de persecución (`ChaseAI`). |

## 4. Escenas (exactamente estos nombres, van en Build Settings en este orden)

| Índice | Nombre de escena | Contenido |
|---|---|---|
| 0 | `MainMenu` | Menú diegético (ver `Docs/MainMenuDesign.md`), `GameManager` y `GameSettingsManager` (con `DontDestroyOnLoad`, persisten al resto). |
| 1 | `House_Act1` | **Toda la casa, los 3 actos.** No dividir en `House_Act2`/`House_Act3` como escenas separadas — el bucle de pasillo y el `ChaseAI` necesitan que la geometría y el NavMesh sean continuos. Los "actos" se manejan como estado (`GameManager.CurrentAct`), no como escenas distintas. |
| 2 | `Flashback` | Cargada de forma aditiva desde `House_Act1` para la secuencia distorsionada de 20-30s del Acto 3. |

> Nota: `GameManager.act1SceneName` y `MainMenuController.firstSceneName` ya apuntan a `"House_Act1"` por defecto — no hace falta tocar el código si respetás este nombre exacto.

## 5. Audio Mixer

Crear `Assets/Mixer/MasterMixer.mixer`. Jerarquía de grupos (ver también `Docs/MainMenuDesign.md`):

```
Master
├── Ambience
├── Voice
└── SFX
    ├── Whispers
    ├── Footsteps
    └── Stingers
```

**Parámetros expuestos** (click derecho en el slider de volumen del grupo → *Expose parameter* → renombrar exactamente así):

| Grupo | Nombre del parámetro expuesto |
|---|---|
| Master | `MasterVolume` |
| Ambience | `AmbienceVolume` |
| SFX | `SFXVolume` |
| Voice | `VoiceVolume` |
| Whispers | `WhisperVolume` |
| Footsteps | `FootstepVolume` |

Asignar este Mixer en `GameSettingsManager` (los primeros 4 parámetros) y en `AudioIntensityManager` (los últimos 2).

## 6. GameObjects — Escena `MainMenu`

Ver el árbol completo del Canvas en `Docs/MainMenuDesign.md`. Además, agregar en la raíz:

| GameObject | Script |
|---|---|
| `_Systems/GameManager` | `GameManager` |
| `_Systems/GameSettingsManager` | `GameSettingsManager` (asignar `MasterMixer` y el `Volume` de post-procesado) |

## 7. GameObjects — Escena `House_Act1`

```
House_Act1
├── _Systems
│   ├── AudioIntensityManager        (AudioIntensityManager.cs)
│   └── SceneBootstrap               (SceneBootstrap.cs — crea GameManager/GameSettingsManager
│                                      si la escena se abre directo en el Editor, sin pasar por MainMenu)
│
├── Player                            [Tag: Player] [Layer: Player]
│   ├── CharacterController, PlayerController.cs, PlayerInteractor.cs, HideState.cs
│   └── CameraPivot
│       ├── Main Camera
│       └── Flashlight
│           ├── FlashlightLight        (Light, Spot)
│           └── (FlashlightController.cs en Flashlight o en Player)
│
├── Environment
│   ├── Bedroom
│   │   ├── Bed
│   │   ├── Nightstand
│   │   ├── Window_Intact              (WindowLookEvent.cs) [Layer: Interactable]
│   │   ├── Window_Broken              (inactivo al inicio)
│   │   ├── WindowKnockEvent           (WindowKnockEvent.cs)
│   │   ├── ClosetDoor_Bedroom         [Layer: Walls]
│   │   └── HidingSpot_Closet          (HidingSpot.cs)
│   │   └── HidingSpot_UnderBed        (HidingSpot.cs)
│   │
│   ├── Hallway
│   │   ├── Window_ToBreak             [Interactable]
│   │   ├── GlassBreakEvent            (GlassBreakEvent.cs)
│   │   ├── FootstepAudioTrigger_01/02/03   (FootstepAudioTrigger.cs)
│   │   ├── WhisperAudioZone_01/02/03       (WhisperAudioZone.cs) [Trigger Collider]
│   │   ├── Mirror
│   │   │   ├── MirrorFrame
│   │   │   ├── ReflectionRig           (mueve la cámara/rig del "reflejo")
│   │   │   └── (MirrorDelayEffect.cs en Mirror)
│   │   ├── PowerOutageEvent            (PowerOutageEvent.cs) [Trigger Collider]
│   │   ├── LoopEndTrigger              (TeleportLoopTrigger.cs)
│   │   ├── LoopDetail_01 / 02 / 03      (inactivos, se activan por vuelta del loop)
│   │   └── BedroomReturnPoint           (Transform vacío, punto de teletransporte)
│   │
│   ├── LivingRoom
│   │   ├── Sofa, CoffeeTable, OldTV
│   │
│   ├── Kitchen
│   │   ├── Counter, Cabinet, KitchenTable, Chair_01/02
│   │   ├── Fridge
│   │   ├── BloodTrail_01...N           (decals en secuencia hacia el armario)
│   │   ├── ClosetDoor_Kitchen          [Interactable]
│   │   └── ClosetCheckEvent            (ClosetCheckEvent.cs, en ClosetDoor_Kitchen)
│   │
│   └── RevelationRoom
│       ├── FamilyBodies
│       ├── Knife                       [Interactable]
│       ├── Mirror_Final
│       └── (trigger que dispara la carga aditiva de la escena Flashback)
│
├── Entity                              [Layer: Enemy]
│   └── ChaseAI.cs, NavMeshAgent (asignar HidingSpot del jugador y PlayerController)
│
└── UI (Canvas HUD)
    ├── BatteryUI                       (BatteryUI.cs)
    ├── InteractionPrompt               (InteractionPrompt.cs)
    └── PausePanel                      (PauseMenuController.cs en la raíz de PausePanel)
        ├── PauseRoot                   (Reanudar / Opciones / Salir al menú, inactivo al inicio)
        ├── SettingsSubPanel             (misma estructura que SettingsPanel del MainMenu, con SettingsMenuUI.cs)
        └── QuitToMenuConfirmationDialog (ConfirmationDialog.cs)
```

## 8. GameObjects — Escena `Flashback`

```
Flashback
├── FlashbackCamera
├── FlashbackAudioSource
└── FlashbackSequenceController   (FlashbackSequenceController.cs — al terminar la duración
                                    llama a GameManager.RestartCycle(), que carga House_Act1
                                    en modo Single y descarga esta escena automáticamente)
```

## 9. Convención de nombres para lo generado con IA

Al importar los `.fbx`/`.glb` de `Docs/ModelPrompts.md`, renombrarlos con este esquema antes de arrastrarlos a `Assets/Models/...`, para que coincidan con los nombres de arriba:

```
SM_Bed, SM_Nightstand, SM_Window_Intact, SM_Window_Broken,
SM_Wardrobe, SM_Door_Generic, SM_Door_Closet_Worn,
SM_KitchenCounter, SM_Cabinet, SM_KitchenTable, SM_Chair,
SM_Fridge, SM_Sofa, SM_CoffeeTable, SM_OldTV,
SM_Mirror, SM_Knife, SM_PhotoFrame, SM_Phone,
SM_Entrails, SM_GlassShards, SM_House_Exterior
```

(`SM_` = Static Mesh, convención estándar para no confundirlos con prefabs armados, que van sin prefijo, ej. `Prefabs/Furniture/Bed.prefab`.)
