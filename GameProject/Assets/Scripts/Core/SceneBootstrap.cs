using UnityEngine;

namespace Horror.Core
{
    /// Colocar en la raíz de House_Act1. Si la escena se abre directo en el Editor
    /// (sin pasar por MainMenu, algo habitual mientras se prueba solo esa escena),
    /// crea los singletons persistentes que normalmente ya existirían.
    [DefaultExecutionOrder(-1000)]
    public class SceneBootstrap : MonoBehaviour
    {
        [SerializeField] private GameManager gameManagerPrefab;
        [SerializeField] private GameSettingsManager gameSettingsManagerPrefab;

        private void Awake()
        {
            if (GameManager.Instance == null && gameManagerPrefab != null)
            {
                Instantiate(gameManagerPrefab);
            }

            if (GameSettingsManager.Instance == null && gameSettingsManagerPrefab != null)
            {
                Instantiate(gameSettingsManagerPrefab);
            }
        }
    }
}
