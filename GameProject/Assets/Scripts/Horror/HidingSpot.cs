using UnityEngine;
using Horror.Player;

namespace Horror.Core
{
    [RequireComponent(typeof(Collider))]
    public class HidingSpot : MonoBehaviour
    {
        [SerializeField] private KeyCode interactKey = KeyCode.E;

        private bool playerInRange;
        private HideState hideState;

        private void OnTriggerEnter(Collider other)
        {
            hideState = other.GetComponentInParent<HideState>();
            if (hideState != null)
            {
                playerInRange = true;
            }
        }

        private void OnTriggerExit(Collider other)
        {
            if (other.GetComponentInParent<HideState>() == hideState)
            {
                playerInRange = false;
            }
        }

        private void Update()
        {
            if (!playerInRange || hideState == null)
            {
                return;
            }

            if (!hideState.IsHiding && Input.GetKeyDown(interactKey))
            {
                hideState.EnterHiding(this);
            }
        }
    }
}
