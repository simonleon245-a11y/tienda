using UnityEngine;
using UnityEngine.AI;
using Horror.Player;

namespace Horror.Core
{
    [RequireComponent(typeof(NavMeshAgent))]
    public class ChaseAI : MonoBehaviour
    {
        [SerializeField] private Transform player;
        [SerializeField] private PlayerController playerController;
        [SerializeField] private HideState playerHideState;
        [SerializeField] private float sightRange = 12f;
        [SerializeField] private float sightAngle = 70f;
        [SerializeField] private float hearingNoiseThreshold = 0.4f;
        [SerializeField] private float catchDistance = 1.2f;
        [SerializeField] private LayerMask sightBlockingLayers;

        public bool IsHunting { get; private set; }

        private NavMeshAgent agent;

        private void Awake()
        {
            agent = GetComponent<NavMeshAgent>();
        }

        public void BeginHunt()
        {
            IsHunting = true;
        }

        public void StopHunt()
        {
            IsHunting = false;
            agent.ResetPath();
        }

        private void Update()
        {
            if (!IsHunting || player == null)
            {
                return;
            }

            if (playerHideState != null && playerHideState.IsHiding && !playerHideState.IsExposedByNoise)
            {
                agent.ResetPath();
                return;
            }

            if (CanSensePlayer())
            {
                agent.SetDestination(player.position);
            }

            float distance = Vector3.Distance(transform.position, player.position);
            if (distance <= catchDistance)
            {
                OnPlayerCaught();
            }
        }

        private bool CanSensePlayer()
        {
            Vector3 toPlayer = player.position - transform.position;
            float distance = toPlayer.magnitude;

            if (playerController != null && playerController.CurrentNoiseLevel >= hearingNoiseThreshold && distance <= sightRange * 1.5f)
            {
                return true;
            }

            if (distance > sightRange)
            {
                return false;
            }

            float angle = Vector3.Angle(transform.forward, toPlayer);
            if (angle > sightAngle * 0.5f)
            {
                return false;
            }

            if (Physics.Raycast(transform.position, toPlayer.normalized, out RaycastHit hit, sightRange, sightBlockingLayers))
            {
                return hit.transform == player || hit.transform.IsChildOf(player);
            }

            return true;
        }

        private void OnPlayerCaught()
        {
            IsHunting = false;
            agent.ResetPath();
            // Hook para disparar el jumpscare / secuencia de "casi te atrapa" desde el Editor (UnityEvent o animación).
        }
    }
}
