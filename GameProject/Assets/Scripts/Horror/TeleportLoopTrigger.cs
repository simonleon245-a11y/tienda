using UnityEngine;

namespace Horror.Core
{
    /// Al cruzar el final del pasillo, el jugador reaparece en el dormitorio.
    /// A partir de cierta cantidad de vueltas, arma la persecución.
    public class TeleportLoopTrigger : MonoBehaviour
    {
        [SerializeField] private Transform bedroomReturnPoint;
        [SerializeField] private CharacterController playerCharacterController;
        [SerializeField] private GameObject[] loopDetailsInOrder;
        [SerializeField] private int loopsBeforeChaseBegins = 2;
        [SerializeField] private ChaseAI chaseAI;

        private void OnTriggerEnter(Collider other)
        {
            if (!other.CompareTag("Player"))
            {
                return;
            }

            int loopIndex = GameManager.Instance != null ? GameManager.Instance.RegisterLoopPass() : 0;

            TeleportPlayer(other);
            ActivateLoopDetail(loopIndex);

            if (loopIndex >= loopsBeforeChaseBegins && chaseAI != null && !chaseAI.IsHunting)
            {
                chaseAI.BeginHunt();
            }
        }

        private void TeleportPlayer(Collider playerCollider)
        {
            if (bedroomReturnPoint == null)
            {
                return;
            }

            CharacterController cc = playerCharacterController != null
                ? playerCharacterController
                : playerCollider.GetComponent<CharacterController>();

            if (cc != null)
            {
                cc.enabled = false;
                cc.transform.SetPositionAndRotation(bedroomReturnPoint.position, bedroomReturnPoint.rotation);
                cc.enabled = true;
            }
        }

        private void ActivateLoopDetail(int loopIndex)
        {
            int detailIndex = loopIndex - 1;
            if (detailIndex >= 0 && detailIndex < loopDetailsInOrder.Length && loopDetailsInOrder[detailIndex] != null)
            {
                loopDetailsInOrder[detailIndex].SetActive(true);
            }
        }
    }
}
