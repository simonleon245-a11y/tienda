using UnityEngine;
using UnityEngine.Audio;

namespace Horror.Audio
{
    public class AudioIntensityManager : MonoBehaviour
    {
        public static AudioIntensityManager Instance { get; private set; }

        [SerializeField] private AudioMixer mixer;
        [SerializeField] private string whisperVolumeParam = "WhisperVolume";
        [SerializeField] private string footstepVolumeParam = "FootstepVolume";

        [Tooltip("Volumen en dB para whispers/pasos por nivel de intensidad (0, 1, 2...).")]
        [SerializeField] private float[] whisperDbByLevel = { -40f, -20f, -6f };
        [SerializeField] private float[] footstepDbByLevel = { -30f, -12f, 0f };

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public void ApplyIntensity(int level)
        {
            if (mixer == null)
            {
                return;
            }

            int clamped = Mathf.Clamp(level, 0, Mathf.Min(whisperDbByLevel.Length, footstepDbByLevel.Length) - 1);
            mixer.SetFloat(whisperVolumeParam, whisperDbByLevel[clamped]);
            mixer.SetFloat(footstepVolumeParam, footstepDbByLevel[clamped]);
        }
    }
}
