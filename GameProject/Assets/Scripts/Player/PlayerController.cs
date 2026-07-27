using UnityEngine;

namespace Horror.Player
{
    [RequireComponent(typeof(CharacterController))]
    public class PlayerController : MonoBehaviour
    {
        [Header("Movement")]
        [SerializeField] private float walkSpeed = 2.5f;
        [SerializeField] private float runSpeed = 4.5f;
        [SerializeField] private float crouchSpeed = 1.2f;
        [SerializeField] private float gravity = -9.81f;

        [Header("Look")]
        [SerializeField] private Transform cameraPivot;
        [SerializeField] private float mouseSensitivity = 2f;
        [SerializeField] private float minPitch = -80f;
        [SerializeField] private float maxPitch = 80f;

        [Header("Noise")]
        [SerializeField] private float walkNoise = 0.3f;
        [SerializeField] private float runNoise = 1f;
        [SerializeField] private float crouchNoise = 0.05f;

        public bool MovementEnabled { get; set; } = false;
        public bool IsCrouching { get; private set; }
        public float CurrentNoiseLevel { get; private set; }

        private CharacterController controller;
        private Vector3 verticalVelocity;
        private float pitch;

        private void Awake()
        {
            controller = GetComponent<CharacterController>();
        }

        private void Update()
        {
            if (!MovementEnabled)
            {
                return;
            }

            HandleLook();
            HandleMovement();
        }

        private void HandleLook()
        {
            float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity;
            float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity;

            transform.Rotate(Vector3.up * mouseX);

            pitch = Mathf.Clamp(pitch - mouseY, minPitch, maxPitch);
            if (cameraPivot != null)
            {
                cameraPivot.localRotation = Quaternion.Euler(pitch, 0f, 0f);
            }
        }

        private void HandleMovement()
        {
            IsCrouching = Input.GetKey(KeyCode.LeftControl) || Input.GetKey(KeyCode.C);
            bool isRunning = Input.GetKey(KeyCode.LeftShift) && !IsCrouching;

            float speed = IsCrouching ? crouchSpeed : (isRunning ? runSpeed : walkSpeed);
            CurrentNoiseLevel = IsCrouching ? crouchNoise : (isRunning ? runNoise : walkNoise);

            float h = Input.GetAxis("Horizontal");
            float v = Input.GetAxis("Vertical");
            Vector3 move = (transform.right * h + transform.forward * v);
            move = Vector3.ClampMagnitude(move, 1f) * speed;

            if (controller.isGrounded && verticalVelocity.y < 0f)
            {
                verticalVelocity.y = -2f;
            }
            verticalVelocity.y += gravity * Time.deltaTime;

            if (move.sqrMagnitude < 0.0001f)
            {
                CurrentNoiseLevel = 0f;
            }

            controller.Move((move + verticalVelocity) * Time.deltaTime);
        }
    }
}
