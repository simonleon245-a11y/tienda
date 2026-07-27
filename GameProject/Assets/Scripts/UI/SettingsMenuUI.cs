using UnityEngine;
using UnityEngine.UI;
using Horror.Core;

namespace Horror.UI
{
    public class SettingsMenuUI : MonoBehaviour
    {
        [Header("Tabs")]
        [SerializeField] private GameObject videoTabPanel;
        [SerializeField] private GameObject audioTabPanel;
        [SerializeField] private GameObject controlsTabPanel;

        [Header("Video")]
        [SerializeField] private Dropdown resolutionDropdown;
        [SerializeField] private Toggle fullscreenToggle;
        [SerializeField] private Dropdown qualityDropdown;
        [SerializeField] private Toggle vsyncToggle;
        [SerializeField] private Dropdown fpsLimitDropdown;
        [SerializeField] private Slider brightnessSlider;

        [Header("Audio")]
        [SerializeField] private Slider masterVolumeSlider;
        [SerializeField] private Slider ambienceVolumeSlider;
        [SerializeField] private Slider sfxVolumeSlider;
        [SerializeField] private Slider voiceVolumeSlider;

        [Header("Controles")]
        [SerializeField] private Slider mouseSensitivitySlider;
        [SerializeField] private Toggle invertYToggle;

        private bool isInitializing;

        private void OnEnable()
        {
            ShowTab(videoTabPanel);
            PopulateFromCurrentSettings();
        }

        public void ShowVideoTab() => ShowTab(videoTabPanel);
        public void ShowAudioTab() => ShowTab(audioTabPanel);
        public void ShowControlsTab() => ShowTab(controlsTabPanel);

        private void ShowTab(GameObject target)
        {
            videoTabPanel.SetActive(target == videoTabPanel);
            audioTabPanel.SetActive(target == audioTabPanel);
            controlsTabPanel.SetActive(target == controlsTabPanel);
        }

        private void PopulateFromCurrentSettings()
        {
            var settings = GameSettingsManager.Instance;
            if (settings == null)
            {
                return;
            }

            isInitializing = true;

            resolutionDropdown.ClearOptions();
            var options = new System.Collections.Generic.List<string>();
            foreach (var r in settings.AvailableResolutions)
            {
                options.Add(ResolutionUtility.FormatLabel(r));
            }
            resolutionDropdown.AddOptions(options);
            resolutionDropdown.value = ResolutionUtility.GetDefaultIndex(settings.AvailableResolutions);

            fullscreenToggle.isOn = Screen.fullScreenMode != FullScreenMode.Windowed;
            vsyncToggle.isOn = QualitySettings.vSyncCount > 0;
            qualityDropdown.value = QualitySettings.GetQualityLevel();

            fpsLimitDropdown.ClearOptions();
            var fpsOptions = new System.Collections.Generic.List<string>();
            foreach (int fps in GameSettingsManager.FpsLimitOptions)
            {
                fpsOptions.Add(GameSettingsManager.FormatFpsLabel(fps));
            }
            fpsLimitDropdown.AddOptions(fpsOptions);
            fpsLimitDropdown.value = System.Array.IndexOf(GameSettingsManager.FpsLimitOptions, 60);
            fpsLimitDropdown.interactable = !vsyncToggle.isOn;

            brightnessSlider.value = PlayerPrefs.GetFloat("brightness", 0.5f);
            masterVolumeSlider.value = PlayerPrefs.GetFloat("vol_master", 0.8f);
            ambienceVolumeSlider.value = PlayerPrefs.GetFloat("vol_ambience", 0.8f);
            sfxVolumeSlider.value = PlayerPrefs.GetFloat("vol_sfx", 0.8f);
            voiceVolumeSlider.value = PlayerPrefs.GetFloat("vol_voice", 1f);

            mouseSensitivitySlider.value = settings.MouseSensitivity;
            invertYToggle.isOn = settings.InvertYAxis;

            isInitializing = false;
        }

        public void OnResolutionChanged(int index)
        {
            if (isInitializing) return;
            var mode = fullscreenToggle.isOn ? FullScreenMode.FullScreenWindow : FullScreenMode.Windowed;
            GameSettingsManager.Instance.ApplyResolution(index, mode);
        }

        public void OnFullscreenToggled(bool isFullscreen)
        {
            if (isInitializing) return;
            var mode = isFullscreen ? FullScreenMode.FullScreenWindow : FullScreenMode.Windowed;
            GameSettingsManager.Instance.ApplyResolution(resolutionDropdown.value, mode);
        }

        public void OnQualityChanged(int level)
        {
            if (isInitializing) return;
            GameSettingsManager.Instance.ApplyQualityLevel(level);
        }

        public void OnVSyncToggled(bool enabled)
        {
            if (isInitializing) return;
            GameSettingsManager.Instance.ApplyVSync(enabled);
            fpsLimitDropdown.interactable = !enabled;
        }

        public void OnFpsLimitChanged(int optionIndex)
        {
            if (isInitializing) return;
            GameSettingsManager.Instance.ApplyFpsLimit(optionIndex);
        }

        public void OnBrightnessChanged(float value)
        {
            if (isInitializing) return;
            GameSettingsManager.Instance.ApplyBrightness(value);
        }

        public void OnMasterVolumeChanged(float value)
        {
            if (isInitializing) return;
            GameSettingsManager.Instance.ApplyMasterVolume(value);
        }

        public void OnAmbienceVolumeChanged(float value)
        {
            if (isInitializing) return;
            GameSettingsManager.Instance.ApplyAmbienceVolume(value);
        }

        public void OnSfxVolumeChanged(float value)
        {
            if (isInitializing) return;
            GameSettingsManager.Instance.ApplySfxVolume(value);
        }

        public void OnVoiceVolumeChanged(float value)
        {
            if (isInitializing) return;
            GameSettingsManager.Instance.ApplyVoiceVolume(value);
        }

        public void OnMouseSensitivityChanged(float value)
        {
            if (isInitializing) return;
            GameSettingsManager.Instance.ApplyMouseSensitivity(value);
        }

        public void OnInvertYToggled(bool value)
        {
            if (isInitializing) return;
            GameSettingsManager.Instance.ApplyInvertY(value);
        }

        public void OnResetToDefaultsPressed()
        {
            GameSettingsManager.Instance.ResetToDefaults();
            PopulateFromCurrentSettings();
        }
    }
}
