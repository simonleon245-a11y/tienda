using UnityEngine;
using UnityEngine.SceneManagement;

namespace Horror.UI
{
    public class MainMenuController : MonoBehaviour
    {
        [SerializeField] private string firstSceneName = "House_Act1";
        [SerializeField] private GameObject rootMenuPanel;
        [SerializeField] private GameObject settingsPanel;
        [SerializeField] private GameObject creditsPanel;
        [SerializeField] private ConfirmationDialog quitConfirmation;
        [SerializeField] private CanvasGroup fadeCanvasGroup;
        [SerializeField] private float fadeOutSeconds = 1.5f;

        private void Start()
        {
            ShowRootMenu();
        }

        public void ShowRootMenu()
        {
            SetPanel(rootMenuPanel, true);
            SetPanel(settingsPanel, false);
            SetPanel(creditsPanel, false);
        }

        public void OnPlayPressed()
        {
            StartCoroutine(FadeOutAndLoad());
        }

        public void OnSettingsPressed()
        {
            SetPanel(rootMenuPanel, false);
            SetPanel(settingsPanel, true);
        }

        public void OnCreditsPressed()
        {
            SetPanel(rootMenuPanel, false);
            SetPanel(creditsPanel, true);
        }

        public void OnBackFromSubPanel()
        {
            ShowRootMenu();
        }

        public void OnQuitPressed()
        {
            if (quitConfirmation != null)
            {
                quitConfirmation.Show(ConfirmQuit);
            }
            else
            {
                ConfirmQuit();
            }
        }

        private void ConfirmQuit()
        {
#if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
#else
            Application.Quit();
#endif
        }

        private System.Collections.IEnumerator FadeOutAndLoad()
        {
            if (fadeCanvasGroup != null)
            {
                float t = 0f;
                while (t < fadeOutSeconds)
                {
                    t += Time.deltaTime;
                    fadeCanvasGroup.alpha = Mathf.Clamp01(t / fadeOutSeconds);
                    yield return null;
                }
            }
            SceneManager.LoadScene(firstSceneName);
        }

        private static void SetPanel(GameObject panel, bool active)
        {
            if (panel != null)
            {
                panel.SetActive(active);
            }
        }
    }
}
