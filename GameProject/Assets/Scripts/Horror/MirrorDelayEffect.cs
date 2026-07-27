using System.Collections.Generic;
using UnityEngine;

namespace Horror.Core
{
    /// Graba la posición/rotación del jugador y reproduce el reflejo con un pequeño delay,
    /// para que el "reflejo" se mueva ligeramente distinto al jugador real.
    public class MirrorDelayEffect : MonoBehaviour
    {
        [SerializeField] private Transform player;
        [SerializeField] private Transform reflectionRig;
        [SerializeField] private float delaySeconds = 0.5f;

        private struct Sample
        {
            public float time;
            public Vector3 position;
            public Quaternion rotation;
        }

        private readonly Queue<Sample> history = new Queue<Sample>();

        private void Update()
        {
            if (player == null || reflectionRig == null)
            {
                return;
            }

            history.Enqueue(new Sample
            {
                time = Time.time,
                position = player.position,
                rotation = player.rotation
            });

            while (history.Count > 0 && Time.time - history.Peek().time > delaySeconds)
            {
                Sample sample = history.Dequeue();
                reflectionRig.position = sample.position;
                reflectionRig.rotation = sample.rotation;
            }
        }
    }
}
