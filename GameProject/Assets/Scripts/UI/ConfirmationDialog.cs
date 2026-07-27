using System;
using UnityEngine;
using UnityEngine.UI;

namespace Horror.UI
{
    public class ConfirmationDialog : MonoBehaviour
    {
        [SerializeField] private GameObject root;
        [SerializeField] private Text messageLabel;
        [SerializeField] private Button confirmButton;
        [SerializeField] private Button cancelButton;
        [SerializeField] private string defaultMessage = "¿Seguro que querés salir?";

        private Action onConfirmed;

        private void Awake()
        {
            confirmButton.onClick.AddListener(HandleConfirm);
            cancelButton.onClick.AddListener(Hide);
            Hide();
        }

        public void Show(Action onConfirm, string message = null)
        {
            onConfirmed = onConfirm;
            if (messageLabel != null)
            {
                messageLabel.text = string.IsNullOrEmpty(message) ? defaultMessage : message;
            }
            root.SetActive(true);
        }

        public void Hide()
        {
            root.SetActive(false);
        }

        private void HandleConfirm()
        {
            Hide();
            onConfirmed?.Invoke();
        }
    }
}
