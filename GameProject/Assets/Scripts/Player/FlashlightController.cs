using UnityEngine;

namespace Horror.Player
{
    public class FlashlightController : MonoBehaviour
    {
        [SerializeField] private Light flashlightLight;
        [SerializeField] private float maxBattery = 100f;
        [SerializeField] private float drainPerSecond = 4f;
        [SerializeField] private float rechargeWhenOffPerSecond = 0.5f;
        [SerializeField] private KeyCode toggleKey = KeyCode.F;

        public bool IsOn { get; private set; }
        public float BatteryPercent => currentBattery / maxBattery;

        private float currentBattery;

        private void Awake()
        {
            currentBattery = maxBattery;
            if (flashlightLight != null)
            {
                flashlightLight.enabled = false;
            }
        }

        private void Update()
        {
            if (Input.GetKeyDown(toggleKey) && currentBattery > 0f)
            {
                IsOn = !IsOn;
                if (flashlightLight != null)
                {
                    flashlightLight.enabled = IsOn;
                }
            }

            if (IsOn)
            {
                currentBattery -= drainPerSecond * Time.deltaTime;
                if (currentBattery <= 0f)
                {
                    currentBattery = 0f;
                    IsOn = false;
                    if (flashlightLight != null)
                    {
                        flashlightLight.enabled = false;
                    }
                }
            }
            else
            {
                currentBattery = Mathf.Min(maxBattery, currentBattery + rechargeWhenOffPerSecond * Time.deltaTime);
            }
        }
    }
}
