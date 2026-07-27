using UnityEngine;

namespace Horror.Core
{
    public abstract class Interactable : MonoBehaviour
    {
        [SerializeField] private string promptMessage = "Presiona E";

        public string PromptMessage => promptMessage;

        public abstract void Interact();
    }
}
