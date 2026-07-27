# Guía de Blockout de Escenas (para armar en el Editor de Unity)

Este documento describe cómo construir cada escena manualmente en el Editor. Las escenas `.unity` no se generan por código en este repo: requieren el Editor para wiring de componentes, NavMesh bake e iluminación. Usa primitivas (cubos escalados) para el blockout inicial; reemplaza por modelos generados con IA después.

## Escena: House_Act1

**Habitaciones:** Dormitorio → Pasillo → Sala → Cocina (puerta cerrada al inicio hacia Cocina, se abre al final del acto).

1. Dormitorio: cama (jugador empieza acostado, `CinemachineVirtualCamera` o cámara fija apuntando al techo), ventana en una pared, mesita de noche.
   - Trigger `WindowKnockEvent` al iniciar la escena (delay de unos segundos) → dispara audio + habilita `PlayerController`.
   - Collider de interacción en la ventana → mirar afuera (partículas de lluvia + audio de tormenta, nada visible).
2. Pasillo conectando a otra habitación con una segunda ventana (la que se rompe).
   - Trigger `GlassBreakEvent`: se dispara cuando el jugador se aleja unos metros de la primera ventana (tiempo o distancia). Reproduce audio de vidrio rompiéndose en la posición de la segunda ventana.
   - Al llegar, el mesh de la ventana cambia a la variante "rota" (o se desactiva y se activa una versión con agujero) + partículas de agua entrando + vidrios en el piso (decal o mesh simple).
3. Sala: zona de exploración libre, sin objetivos claros, para ambientar (15 min). Colocar 2-3 `FootstepAudioTrigger` (pasos detrás del jugador) y 2-3 `WhisperAudioZone` (voces de fondo) distribuidos.
4. Puerta a la Cocina: se desbloquea con evento `SmellOfDeathTrigger` (línea de diálogo del personaje) tras cierto tiempo de exploración o al entrar a un trigger de "casi cocina".

## Escena: House_Act2 (o continuación de la misma escena)

1. Cocina: mesada, alacena, rastro de sangre/vísceras en el piso (secuencia de decals o meshes simples siguiendo un `Path` de puntos).
2. El rastro termina en un Armario.
3. Armario: al abrirlo (trigger de interacción), está vacío. Este evento marca el cambio de intensidad de audio — subir volumen de `WhisperAudioZone` y frecuencia de `FootstepAudioTrigger` globalmente (vía `GameManager.SetIntensityLevel(2)`).

## Escena: House_Act3

1. **Corte de luz:** trigger inmediatamente después de cerrar el armario → `PowerOutageEvent` apaga todas las luces de la escena excepto una luz de emergencia tenue; habilita la linterna del jugador (`FlashlightController`).
2. **Pasillo con espejo:** un plano espejo simple (puede simularse con una segunda cámara renderizando a un `RenderTexture`, o con un shader de mirror) con `MirrorDelayEffect` (delay de ~0.5s en la reproducción del movimiento del jugador).
3. **Loop de pasillo:** al final del pasillo, un `TeleportTrigger` invisible que reposiciona al jugador de vuelta al dormitorio, cambiando 1 detalle del cuarto en cada vuelta (activar un GameObject distinto cada vez: foto rota, mensaje en el celular, mancha nueva). Usar un contador en `GameManager` para llevar cuántas vueltas lleva.
4. **Persecución:** tras la 2da o 3ra vuelta del loop, se activa un `ChaseAI` (NavMeshAgent) que empieza a perseguir al jugador. Necesita NavMesh baked en toda la casa. Puntos de escondite (`HidingSpot`) en el armario del dormitorio y debajo de la cama.
5. **Cuarto de la revelación:** habitación nueva (antes bloqueada/no explorada) con los cuerpos de la familia, el cuchillo, y el espejo final con línea de diálogo o animación del reflejo.
6. **Flashback:** puede implementarse como una escena/secuencia separada (`Flashback` scene) cargada de forma aditiva con post-processing extremo (desaturación, invertir audio) y control de cámara fijo (sin input del jugador), de 20-30s.
7. **Final:** vuelve a cargar `House_Act1` desde el estado inicial (reinicia `GameManager`), con el mismo evento de golpes en la ventana arrancando de nuevo → fade a negro tras unos segundos.

## Requisitos técnicos por escena

- NavMesh bakeado en House_Act3 (Window > AI > Navigation, o paquete `com.unity.ai.navigation`).
- Audio Mixer con grupos: Ambience, SFX, Voice, Music — para poder subir "intensidad" global fácilmente vía volumen de grupo en vez de tocar cada fuente.
- Post Processing Volume global (URP) con perfil base tenebroso, y un segundo perfil más extremo para el flashback.
