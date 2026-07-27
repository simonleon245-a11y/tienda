# Menú Principal — Diseño y Blockout

## Concepto (por qué no es un menú genérico)

El menú **no es una pantalla negra con botones**: es la primera toma del juego. La cámara ya está en el dormitorio, acostada mirando al techo, con la tormenta sonando de fondo — exactamente el plano con el que arranca el Acto 1. El título y las opciones aparecen como texto superpuesto con look VHS/analógico (grano, jitter leve, una línea de scan que cruza la pantalla cada tanto), no como UI limpia de menú de configuración.

- **"Jugar"** no dispara una carga de escena visible: hace fade del texto del menú y, ~1 segundo después, empiezan los golpes en la ventana (`WindowKnockEvent`, que ya existe) — el jugador nunca "sale" de la habitación, pasa de menú a juego sin corte.
- El título del juego tiembla/se distorsiona levemente al pasar el mouse por encima (no una animación de brillo genérica).
- Como easter egg, uno de los `WhisperAudioZone` de la casa puede estar apenas audible ya desde el menú (volumen mínimo), para que el jugador sienta que "algo" empieza antes de apretar jugar.
- Cuando se abre "Opciones", la cámara del dormitorio se queda quieta de fondo (desenfocada/oscurecida) y el panel de configuración se superpone — no se corta a una escena distinta.

## Estructura de Canvas (Editor)

```
MainMenuScene
├── Main Camera (mirando al techo, igual que el arranque del Acto 1)
├── EnvironmentLite (versión mínima del dormitorio, sin necesidad del resto de la casa)
├── AmbientAudioSource (tormenta, loop, ya sonando)
├── WhisperEasterEgg (WhisperAudioZone a volumen muy bajo, opcional)
└── Canvas (Screen Space - Overlay)
    ├── FadeCanvasGroup (CanvasGroup negro, para el fundido al presionar Jugar)
    ├── RootMenuPanel
    │   ├── TitleText ("LA TORMENTA" — fuente con textura de distorsión/glitch)
    │   ├── BtnJugar
    │   ├── BtnOpciones
    │   ├── BtnCreditos
    │   └── BtnSalir
    ├── SettingsPanel (inactivo al inicio)
    │   ├── TabButtons (Video / Audio / Controles)
    │   ├── VideoTabPanel
    │   │   ├── Dropdown Resolución (incluye 4K)
    │   │   ├── Toggle Pantalla Completa
    │   │   ├── Dropdown Calidad Gráfica
    │   │   ├── Toggle VSync
    │   │   ├── Dropdown Límite de FPS (30/60/90/120/144/240/Sin límite — se deshabilita si VSync está activo)
    │   │   └── Slider Brillo (calibración, ver nota abajo)
    │   ├── AudioTabPanel
    │   │   ├── Slider Volumen General
    │   │   ├── Slider Ambiente/Música
    │   │   ├── Slider Efectos
    │   │   └── Slider Voces
    │   ├── ControlsTabPanel
    │   │   ├── Slider Sensibilidad del Mouse
    │   │   └── Toggle Invertir Eje Y
    │   ├── BtnRestablecerValores
    │   └── BtnVolver
    ├── CreditsPanel (inactivo al inicio, texto simple + BtnVolver)
    └── QuitConfirmationDialog (inactivo al inicio: mensaje + Confirmar/Cancelar)
```

## Wiring de scripts (ya están en `Assets/Scripts`)

- `MainMenuController` en el Canvas raíz: asignar `rootMenuPanel`, `settingsPanel`, `creditsPanel`, `quitConfirmation`, `fadeCanvasGroup`. Conectar los botones a `OnPlayPressed`, `OnSettingsPressed`, `OnCreditsPressed`, `OnQuitPressed`.
- `SettingsMenuUI` en `SettingsPanel`: asignar los 3 sub-paneles de pestañas y cada Dropdown/Slider/Toggle. Los botones de pestaña llaman a `ShowVideoTab` / `ShowAudioTab` / `ShowControlsTab`.
- `ConfirmationDialog` en `QuitConfirmationDialog`: asignar `messageLabel`, `confirmButton`, `cancelButton`.
- `GameSettingsManager` en un GameObject vacío en la escena del menú (con `DontDestroyOnLoad`, persiste al resto del juego): asignar el `AudioMixer` y el `Volume` de post-procesado (URP) para el brillo.

## Límite de FPS

Unity ignora `Application.targetFrameRate` mientras VSync esté activo (`QualitySettings.vSyncCount > 0`), así que el dropdown de FPS se deshabilita automáticamente (`SettingsMenuUI.OnVSyncToggled`) cuando VSync está prendido, para no mostrarle al jugador una opción que no hace nada. Opciones: 30 / 60 / 90 / 120 / 144 / 240 / Sin límite.

## Brillo (calibración, típico de juegos de terror)

En vez de un slider de "brillo" genérico de UI, usalo como pantalla de calibración real: el slider mueve el `postExposure` de un `ColorAdjustments` en el Volume Profile de post-procesado (URP). Texto sugerido arriba del slider: *"Ajustá hasta que apenas puedas distinguir la silueta en la oscuridad."* — más inmersivo que "Brillo: 50%".

## Audio Mixer — jerarquía necesaria

Para que el slider de "Efectos" del usuario y el sistema de intensidad narrativa (`AudioIntensityManager`, ya existente) no se pisen, la jerarquía del Mixer debe ser:

```
Master
├── Ambience   (tormenta/lluvia, slider "Ambiente/Música")
├── Voice      (diálogo del personaje, slider "Voces")
└── SFX        (slider "Efectos" — controla el volumen general de esta rama)
    ├── Whispers   (modulado por AudioIntensityManager según el acto)
    ├── Footsteps  (modulado por AudioIntensityManager según el acto)
    └── Stingers
```

Como el volumen de un grupo hijo en Unity Audio Mixer es relativo al padre, el slider de "Efectos" y la intensidad narrativa se combinan automáticamente sin que el código tenga que coordinarlos.

## Resoluciones

`ResolutionUtility.BuildResolutionList()` ya garantiza que 720p/1080p/1440p/4K estén siempre disponibles en el dropdown, aunque el monitor actual no las reporte (por ejemplo, para capturas o pantallas externas). El label se genera automáticamente con el tag "(4K)", "(1440p)", etc.
