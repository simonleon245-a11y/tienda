using UnityEngine;

namespace Horror.Core
{
    /// Vive en la escena Flashback (cargada de forma aditiva). Al terminar la secuencia
    /// dispara el reinicio del ciclo: GameManager.RestartCycle() vuelve a cargar
    /// House_Act1 en modo Single, lo que descarga esta escena y la anterior automáticamente.
    public class FlashbackSequenceController : MonoBehaviour
    {
        [SerializeField] private float sequenceDurationSeconds = 25f;

        private void Start()
        {
            Invoke(nameof(EndSequence), sequenceDurationSeconds);
        }

        private void EndSequence()
        {
            GameManager.Instance?.RestartCycle();
        }
    }
}
