using UnityEngine;

namespace Horror.Core
{
    public class GlassBreakEvent : MonoBehaviour
    {
        [SerializeField] private Transform player;
        [SerializeField] private float triggerDistance = 3f;
        [SerializeField] private AudioSource glassBreakAudioSource;
        [SerializeField] private GameObject intactWindowVisual;
        [SerializeField] private GameObject brokenWindowVisual;
        [SerializeField] private ParticleSystem waterEntering;

        private bool hasTriggered;

        private void Update()
        {
            if (hasTriggered || player == null)
            {
                return;
            }

            if (Vector3.Distance(transform.position, player.position) >= triggerDistance)
            {
                Trigger();
            }
        }

        private void Trigger()
        {
            hasTriggered = true;
            glassBreakAudioSource?.Play();

            if (intactWindowVisual != null) intactWindowVisual.SetActive(false);
            if (brokenWindowVisual != null) brokenWindowVisual.SetActive(true);
            waterEntering?.Play();
        }
    }
}
