using UnityEngine;
using Horror.Core;
using Horror.UI;

namespace Horror.Player
{
    public class PlayerInteractor : MonoBehaviour
    {
        [SerializeField] private Camera playerCamera;
        [SerializeField] private float interactRange = 2.5f;
        [SerializeField] private LayerMask interactableLayers;
        [SerializeField] private InteractionPrompt prompt;
        [SerializeField] private KeyCode interactKey = KeyCode.E;

        private Interactable currentTarget;

        private void Update()
        {
            UpdateLookTarget();

            if (currentTarget != null && Input.GetKeyDown(interactKey))
            {
                currentTarget.Interact();
            }
        }

        private void UpdateLookTarget()
        {
            Interactable found = null;

            if (playerCamera != null &&
                Physics.Raycast(playerCamera.transform.position, playerCamera.transform.forward, out RaycastHit hit, interactRange, interactableLayers))
            {
                found = hit.collider.GetComponentInParent<Interactable>();
            }

            if (found != currentTarget)
            {
                currentTarget = found;
                if (prompt != null)
                {
                    if (currentTarget != null)
                    {
                        prompt.Show(currentTarget.PromptMessage);
                    }
                    else
                    {
                        prompt.Hide();
                    }
                }
            }
        }
    }
}
