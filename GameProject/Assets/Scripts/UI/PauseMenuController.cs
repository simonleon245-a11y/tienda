using UnityEngine;
using UnityEngine.SceneManagement;
using Horror.Player;

namespace Horror.UI
{
    public class PauseMenuController : MonoBehaviour
    {
        [SerializeField] private HideState playerHideState;
        [SerializeField] private PlayerController playerController;
        [SerializeField] private GameObject pausePanel;
        [SerializeField] private GameObject settingsSubPanel;
        [SerializeField] private ConfirmationDialog quitToMenuConfirmation;
        [SerializeField] private string mainMenuSceneName = "MainMenu";

        public bool IsPaused { get; private set; }

        private void Update()
        {
            bool playerIsHiding = playerHideState != null && playerHideState.IsHiding;
            if (!playerIsHiding && Input.GetKeyDown(KeyCode.Escape))
            {
                TogglePause();
            }
        }

        public void TogglePause()
        {
            SetPaused(!IsPaused);
        }

        private void SetPaused(bool paused)
        {
            IsPaused = paused;
            Time.timeScale = paused ? 0f : 1f;

            if (pausePanel != null) pausePanel.SetActive(paused);
            if (settingsSubPanel != null) settingsSubPanel.SetActive(false);

            if (playerController != null)
            {
                playerController.MovementEnabled = !paused;
            }

            Cursor.lockState = paused ? CursorLockMode.None : CursorLockMode.Locked;
            Cursor.visible = paused;
        }

        public void OnResumePressed()
        {
            SetPaused(false);
        }

        public void OnSettingsPressed()
        {
            if (pausePanel != null) pausePanel.SetActive(false);
            if (settingsSubPanel != null) settingsSubPanel.SetActive(true);
        }

        public void OnBackFromSettingsPressed()
        {
            if (settingsSubPanel != null) settingsSubPanel.SetActive(false);
            if (pausePanel != null) pausePanel.SetActive(true);
        }

        public void OnQuitToMainMenuPressed()
        {
            if (quitToMenuConfirmation != null)
            {
                quitToMenuConfirmation.Show(GoToMainMenu, "¿Seguro que querés salir al menú principal? Perdés el progreso de esta partida.");
            }
            else
            {
                GoToMainMenu();
            }
        }

        private void GoToMainMenu()
        {
            Time.timeScale = 1f;
            SceneManager.LoadScene(mainMenuSceneName);
        }
    }
}
