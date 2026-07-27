using UnityEngine;
using Horror.Player;

namespace Horror.Core
{
    public class WindowKnockEvent : MonoBehaviour
    {
        [SerializeField] private PlayerController playerController;
        [SerializeField] private AudioSource knockAudioSource;
        [SerializeField] private float delayBeforeKnock = 4f;

        private void Start()
        {
            if (playerController != null)
            {
                playerController.MovementEnabled = false;
            }
            Invoke(nameof(TriggerKnock), delayBeforeKnock);
        }

        private void TriggerKnock()
        {
            knockAudioSource?.Play();
            if (playerController != null)
            {
                playerController.MovementEnabled = true;
            }
        }
    }
}
