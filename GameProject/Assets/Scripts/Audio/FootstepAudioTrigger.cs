using UnityEngine;

namespace Horror.Audio
{
    /// Pasos "detrás" del jugador que se detienen si él se gira hacia la fuente.
    public class FootstepAudioTrigger : MonoBehaviour
    {
        [SerializeField] private Transform player;
        [SerializeField] private AudioSource footstepAudioSource;
        [SerializeField] private float triggerRadius = 6f;
        [SerializeField] private float minIntervalSeconds = 8f;
        [SerializeField] private float maxIntervalSeconds = 20f;
        [SerializeField] private float lookAwayAngleThreshold = 100f;

        private float nextAllowedTime;

        private void Update()
        {
            if (player == null || footstepAudioSource == null || Time.time < nextAllowedTime)
            {
                return;
            }

            float distance = Vector3.Distance(transform.position, player.position);
            if (distance > triggerRadius)
            {
                return;
            }

            Vector3 toSource = transform.position - player.position;
            float angle = Vector3.Angle(player.forward, toSource);
            bool playerLookingAway = angle > lookAwayAngleThreshold;

            if (playerLookingAway && !footstepAudioSource.isPlaying)
            {
                footstepAudioSource.Play();
                nextAllowedTime = Time.time + Random.Range(minIntervalSeconds, maxIntervalSeconds);
            }
        }
    }
}
