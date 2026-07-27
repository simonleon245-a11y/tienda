using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace Horror.Core
{
    public static class ResolutionUtility
    {
        private static readonly (int w, int h) Res4K = (3840, 2160);
        private static readonly (int w, int h) Res1440p = (2560, 1440);
        private static readonly (int w, int h) Res1080p = (1920, 1080);
        private static readonly (int w, int h) Res720p = (1280, 720);

        /// Combina las resoluciones que reporta el monitor con las estándar (garantiza 4K/1440p/1080p/720p
        /// disponibles como opción aunque el monitor actual no las reporte, para no bloquear a nadie que
        /// quiera capturar en 4K o jugar en una pantalla externa).
        public static Resolution[] BuildResolutionList()
        {
            var seen = new HashSet<(int, int)>();
            var list = new List<Resolution>();

            void AddIfNew(int w, int h, double refreshRate = 60.0)
            {
                if (seen.Add((w, h)))
                {
                    list.Add(new Resolution
                    {
                        width = w,
                        height = h,
                        refreshRateRatio = new RefreshRate { numerator = (uint)(refreshRate * 1000), denominator = 1000 }
                    });
                }
            }

            foreach (var standard in new[] { Res720p, Res1080p, Res1440p, Res4K })
            {
                AddIfNew(standard.w, standard.h);
            }

            foreach (var r in Screen.resolutions)
            {
                AddIfNew(r.width, r.height, r.refreshRateRatio.value);
            }

            return list.OrderBy(r => r.width * r.height).ToArray();
        }

        public static int GetDefaultIndex(Resolution[] resolutions)
        {
            int currentIndex = System.Array.FindIndex(resolutions,
                r => r.width == Screen.currentResolution.width && r.height == Screen.currentResolution.height);
            return currentIndex >= 0 ? currentIndex : resolutions.Length - 1;
        }

        public static string FormatLabel(Resolution r)
        {
            string tag = (r.width, r.height) switch
            {
                (3840, 2160) => " (4K)",
                (2560, 1440) => " (1440p)",
                (1920, 1080) => " (1080p)",
                (1280, 720) => " (720p)",
                _ => ""
            };
            return $"{r.width} x {r.height}{tag}";
        }
    }
}
