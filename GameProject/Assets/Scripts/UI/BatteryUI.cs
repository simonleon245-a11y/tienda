using UnityEngine;
using UnityEngine.UI;
using Horror.Player;

namespace Horror.UI
{
    public class BatteryUI : MonoBehaviour
    {
        [SerializeField] private FlashlightController flashlight;
        [SerializeField] private Image batteryFillImage;

        private void Update()
        {
            if (flashlight == null || batteryFillImage == null)
            {
                return;
            }

            batteryFillImage.fillAmount = flashlight.BatteryPercent;
        }
    }
}
