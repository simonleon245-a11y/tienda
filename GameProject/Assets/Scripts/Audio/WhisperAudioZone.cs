using UnityEngine;

namespace Horror.Audio
{
    [RequireComponent(typeof(AudioSource))]
    public class WhisperAudioZone : MonoBehaviour
    {
        [SerializeField] private float fadeInSeconds = 3f;
        [SerializeField] private float baseVolume = 0.3f;

        private AudioSource source;

        private void Awake()
        {
            source = GetComponent<AudioSource>();
            source.loop = true;
            source.playOnAwake = false;
            source.volume = 0f;
        }

        private void OnTriggerEnter(Collider other)
        {
            if (other.CompareTag("Player"))
            {
                if (!source.isPlaying)
                {
                    source.Play();
                }
                StopAllCoroutines();
                StartCoroutine(FadeTo(baseVolume));
            }
        }

        private void OnTriggerExit(Collider other)
        {
            if (other.CompareTag("Player"))
            {
                StopAllCoroutines();
                StartCoroutine(FadeTo(0f));
            }
        }

        private System.Collections.IEnumerator FadeTo(float target)
        {
            float start = source.volume;
            float t = 0f;
            while (t < fadeInSeconds)
            {
                t += Time.deltaTime;
                source.volume = Mathf.Lerp(start, target, t / fadeInSeconds);
                yield return null;
            }
            source.volume = target;
        }
    }
}
