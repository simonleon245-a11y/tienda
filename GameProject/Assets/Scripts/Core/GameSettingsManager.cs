using UnityEngine;
using UnityEngine.Audio;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace Horror.Core
{
    /// Singleton persistente: aplica y guarda todas las opciones de video/audio/control.
    /// Vive en la primera escena que se carga (MainMenu) con DontDestroyOnLoad.
    public class GameSettingsManager : MonoBehaviour
    {
        public static GameSettingsManager Instance { get; private set; }

        [Header("Audio")]
        [SerializeField] private AudioMixer mixer;
        [SerializeField] private string masterParam = "MasterVolume";
        [SerializeField] private string ambienceParam = "AmbienceVolume";
        [SerializeField] private string sfxParam = "SFXVolume";
        [SerializeField] private string voiceParam = "VoiceVolume";

        [Header("Brillo (calibración)")]
        [SerializeField] private Volume postProcessVolume;
        [SerializeField] private float minExposure = -3f;
        [SerializeField] private float maxExposure = 1f;

        private const string KeyResolutionIndex = "res_index";
        private const string KeyFullscreenMode = "fullscreen_mode";
        private const string KeyQualityLevel = "quality_level";
        private const string KeyVSync = "vsync";
        private const string KeyMaster = "vol_master";
        private const string KeyAmbience = "vol_ambience";
        private const string KeySfx = "vol_sfx";
        private const string KeyVoice = "vol_voice";
        private const string KeyBrightness = "brightness";
        private const string KeySensitivity = "mouse_sensitivity";
        private const string KeyInvertY = "invert_y";

        public Resolution[] AvailableResolutions { get; private set; }
        public float MouseSensitivity { get; private set; } = 2f;
        public bool InvertYAxis { get; private set; }

        private ColorAdjustments colorAdjustments;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            AvailableResolutions = ResolutionUtility.BuildResolutionList();

            if (postProcessVolume != null && postProcessVolume.profile != null)
            {
                postProcessVolume.profile.TryGet(out colorAdjustments);
            }

            LoadAndApplyAll();
        }

        private void LoadAndApplyAll()
        {
            int resIndex = PlayerPrefs.GetInt(KeyResolutionIndex, ResolutionUtility.GetDefaultIndex(AvailableResolutions));
            FullScreenMode fsMode = (FullScreenMode)PlayerPrefs.GetInt(KeyFullscreenMode, (int)FullScreenMode.FullScreenWindow);
            ApplyResolution(resIndex, fsMode);

            ApplyQualityLevel(PlayerPrefs.GetInt(KeyQualityLevel, QualitySettings.GetQualityLevel()));
            ApplyVSync(PlayerPrefs.GetInt(KeyVSync, 1) == 1);

            ApplyMasterVolume(PlayerPrefs.GetFloat(KeyMaster, 0.8f));
            ApplyAmbienceVolume(PlayerPrefs.GetFloat(KeyAmbience, 0.8f));
            ApplySfxVolume(PlayerPrefs.GetFloat(KeySfx, 0.8f));
            ApplyVoiceVolume(PlayerPrefs.GetFloat(KeyVoice, 1f));

            ApplyBrightness(PlayerPrefs.GetFloat(KeyBrightness, 0.5f));

            MouseSensitivity = PlayerPrefs.GetFloat(KeySensitivity, 2f);
            InvertYAxis = PlayerPrefs.GetInt(KeyInvertY, 0) == 1;
        }

        public void ApplyResolution(int index, FullScreenMode fullScreenMode)
        {
            if (AvailableResolutions == null || AvailableResolutions.Length == 0)
            {
                return;
            }
            index = Mathf.Clamp(index, 0, AvailableResolutions.Length - 1);
            Resolution r = AvailableResolutions[index];
            Screen.SetResolution(r.width, r.height, fullScreenMode, r.refreshRateRatio);

            PlayerPrefs.SetInt(KeyResolutionIndex, index);
            PlayerPrefs.SetInt(KeyFullscreenMode, (int)fullScreenMode);
        }

        public void ApplyQualityLevel(int level)
        {
            QualitySettings.SetQualityLevel(level, true);
            PlayerPrefs.SetInt(KeyQualityLevel, level);
        }

        public void ApplyVSync(bool enabled)
        {
            QualitySettings.vSyncCount = enabled ? 1 : 0;
            PlayerPrefs.SetInt(KeyVSync, enabled ? 1 : 0);
        }

        public void ApplyMasterVolume(float linear01)
        {
            SetMixerVolume(masterParam, linear01);
            PlayerPrefs.SetFloat(KeyMaster, linear01);
        }

        public void ApplyAmbienceVolume(float linear01)
        {
            SetMixerVolume(ambienceParam, linear01);
            PlayerPrefs.SetFloat(KeyAmbience, linear01);
        }

        public void ApplySfxVolume(float linear01)
        {
            SetMixerVolume(sfxParam, linear01);
            PlayerPrefs.SetFloat(KeySfx, linear01);
        }

        public void ApplyVoiceVolume(float linear01)
        {
            SetMixerVolume(voiceParam, linear01);
            PlayerPrefs.SetFloat(KeyVoice, linear01);
        }

        private void SetMixerVolume(string param, float linear01)
        {
            if (mixer == null)
            {
                return;
            }
            float dB = linear01 <= 0.0001f ? -80f : Mathf.Log10(linear01) * 20f;
            mixer.SetFloat(param, dB);
        }

        public void ApplyBrightness(float linear01)
        {
            if (colorAdjustments != null)
            {
                colorAdjustments.postExposure.value = Mathf.Lerp(minExposure, maxExposure, linear01);
            }
            PlayerPrefs.SetFloat(KeyBrightness, linear01);
        }

        public void ApplyMouseSensitivity(float sensitivity)
        {
            MouseSensitivity = sensitivity;
            PlayerPrefs.SetFloat(KeySensitivity, sensitivity);
        }

        public void ApplyInvertY(bool invert)
        {
            InvertYAxis = invert;
            PlayerPrefs.SetInt(KeyInvertY, invert ? 1 : 0);
        }

        public void ResetToDefaults()
        {
            PlayerPrefs.DeleteKey(KeyResolutionIndex);
            PlayerPrefs.DeleteKey(KeyFullscreenMode);
            PlayerPrefs.DeleteKey(KeyQualityLevel);
            PlayerPrefs.DeleteKey(KeyVSync);
            PlayerPrefs.DeleteKey(KeyMaster);
            PlayerPrefs.DeleteKey(KeyAmbience);
            PlayerPrefs.DeleteKey(KeySfx);
            PlayerPrefs.DeleteKey(KeyVoice);
            PlayerPrefs.DeleteKey(KeyBrightness);
            PlayerPrefs.DeleteKey(KeySensitivity);
            PlayerPrefs.DeleteKey(KeyInvertY);
            LoadAndApplyAll();
        }
    }
}
