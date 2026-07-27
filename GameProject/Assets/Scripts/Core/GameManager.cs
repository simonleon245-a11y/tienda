using UnityEngine;
using UnityEngine.SceneManagement;
using Horror.Audio;

namespace Horror.Core
{
    public enum StoryAct
    {
        Act1_Awakening,
        Act2_Trail,
        Act3_Truth
    }

    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [SerializeField] private string act1SceneName = "House_Act1";

        public StoryAct CurrentAct { get; private set; } = StoryAct.Act1_Awakening;
        public int IntensityLevel { get; private set; } = 0;
        public int LoopCount { get; private set; } = 0;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public void SetAct(StoryAct act)
        {
            CurrentAct = act;
        }

        public void SetIntensityLevel(int level)
        {
            IntensityLevel = level;
            AudioIntensityManager.Instance?.ApplyIntensity(level);
        }

        public int RegisterLoopPass()
        {
            LoopCount++;
            return LoopCount;
        }

        public void RestartCycle()
        {
            CurrentAct = StoryAct.Act1_Awakening;
            IntensityLevel = 0;
            LoopCount = 0;
            SceneManager.LoadScene(act1SceneName);
        }
    }
}
