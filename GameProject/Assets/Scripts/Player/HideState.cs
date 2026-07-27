using UnityEngine;

namespace Horror.Player
{
    public class HideState : MonoBehaviour
    {
        [SerializeField] private PlayerController playerController;
        [SerializeField] private float maxHeldBreath = 8f;
        [SerializeField] private float breathDrainPerSecond = 1f;
        [SerializeField] private float breathRecoverPerSecond = 2f;
        [SerializeField] private KeyCode holdBreathKey = KeyCode.Space;

        public bool IsHiding { get; private set; }
        public float HeldBreathPercent => heldBreath / maxHeldBreath;
        public bool IsExposedByNoise { get; private set; }

        private float heldBreath;
        private Horror.Core.HidingSpot currentSpot;

        private void Awake()
        {
            heldBreath = maxHeldBreath;
        }

        public void EnterHiding(Horror.Core.HidingSpot spot)
        {
            currentSpot = spot;
            IsHiding = true;
            if (playerController != null)
            {
                playerController.MovementEnabled = false;
            }
        }

        public void ExitHiding()
        {
            IsHiding = false;
            currentSpot = null;
            if (playerController != null)
            {
                playerController.MovementEnabled = true;
            }
        }

        private void Update()
        {
            if (!IsHiding)
            {
                return;
            }

            bool holdingBreath = Input.GetKey(holdBreathKey);
            heldBreath += (holdingBreath ? -breathDrainPerSecond : breathRecoverPerSecond) * Time.deltaTime;
            heldBreath = Mathf.Clamp(heldBreath, 0f, maxHeldBreath);

            IsExposedByNoise = !holdingBreath;

            if (Input.GetKeyDown(KeyCode.Escape))
            {
                ExitHiding();
            }
        }
    }
}
