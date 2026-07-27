using UnityEngine;

namespace Horror.Core
{
    /// El armario del Acto 2: al abrirlo está vacío, pero marca el punto donde
    /// los sonidos (pasos, susurros) suben de intensidad para el resto de la casa.
    public class ClosetCheckEvent : Interactable
    {
        [SerializeField] private Animator doorAnimator;
        [SerializeField] private string openTrigger = "Open";
        [SerializeField] private AudioSource doorAudioSource;
        [SerializeField] private int intensityLevelOnOpen = 1;

        private bool hasOpened;

        public override void Interact()
        {
            if (hasOpened)
            {
                return;
            }
            hasOpened = true;

            doorAudioSource?.Play();
            if (doorAnimator != null)
            {
                doorAnimator.SetTrigger(openTrigger);
            }

            GameManager.Instance?.SetIntensityLevel(intensityLevelOnOpen);
        }
    }
}
