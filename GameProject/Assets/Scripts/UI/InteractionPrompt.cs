using UnityEngine;
using UnityEngine.UI;

namespace Horror.UI
{
    public class InteractionPrompt : MonoBehaviour
    {
        [SerializeField] private GameObject promptRoot;
        [SerializeField] private Text promptLabel;

        public void Show(string message)
        {
            if (promptRoot != null)
            {
                promptRoot.SetActive(true);
            }
            if (promptLabel != null)
            {
                promptLabel.text = message;
            }
        }

        public void Hide()
        {
            if (promptRoot != null)
            {
                promptRoot.SetActive(false);
            }
        }
    }
}
