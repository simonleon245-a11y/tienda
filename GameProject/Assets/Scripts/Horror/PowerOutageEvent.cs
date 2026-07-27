using UnityEngine;

namespace Horror.Core
{
    public class PowerOutageEvent : MonoBehaviour
    {
        [SerializeField] private Light[] houseLights;
        [SerializeField] private Light emergencyLight;
        [SerializeField] private AudioSource powerDownAudioSource;

        private bool hasTriggered;

        private void OnTriggerEnter(Collider other)
        {
            if (hasTriggered || !other.CompareTag("Player"))
            {
                return;
            }
            hasTriggered = true;
            Trigger();
        }

        private void Trigger()
        {
            powerDownAudioSource?.Play();

            foreach (var light in houseLights)
            {
                if (light != null)
                {
                    light.enabled = false;
                }
            }

            if (emergencyLight != null)
            {
                emergencyLight.enabled = true;
            }

            GameManager.Instance?.SetAct(StoryAct.Act3_Truth);
            GameManager.Instance?.SetIntensityLevel(2);
        }
    }
}
