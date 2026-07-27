using UnityEngine;

namespace Horror.Core
{
    /// La primera ventana del Acto 1: el jugador mira afuera y no hay nada,
    /// solo tormenta. Puramente atmosférico, no desbloquea nada por sí solo.
    public class WindowLookEvent : Interactable
    {
        [SerializeField] private AudioSource windowRainBurstAudioSource;
        [SerializeField] private ParticleSystem rainSplatterOnGlass;

        public override void Interact()
        {
            windowRainBurstAudioSource?.Play();
            rainSplatterOnGlass?.Play();
        }
    }
}
