document.addEventListener('DOMContentLoaded', function () {
    const bgSlider = document.getElementById('bg-lightness-slider');
    const textSlider = document.getElementById('text-lightness-slider');
    const bgValueDisplay = document.getElementById('bg-lightness-value');
    const textValueDisplay = document.getElementById('text-lightness-value');
    const contrastRatioDisplay = document.getElementById('contrast-ratio');
    const root = document.documentElement;

    const textPixels = 408617;
    const bgPixels = 2272679;

    function hslToRgb(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color);
        };
        return [f(0), f(8), f(4)];
    }

    function calculateAverageIntensity(rgb, pixelCount) {
        const [r, g, b] = rgb.map(v => v / 255);
        return (r + g + b) / 3;
    }

    function calculateRmsContrast(bgRgb, textRgb, textPixels, bgPixels) {
        const totalPixels = textPixels + bgPixels;
        const bgIntensity = calculateAverageIntensity(bgRgb, bgPixels);
        const textIntensity = calculateAverageIntensity(textRgb, textPixels);
        const avgIntensity = (bgIntensity * bgPixels + textIntensity * textPixels) / totalPixels;

        const varianceBg = ((bgRgb[0] / 255 - avgIntensity) ** 2 + (bgRgb[1] / 255 - avgIntensity) ** 2 + (bgRgb[2] / 255 - avgIntensity) ** 2) / 3;
        const varianceText = ((textRgb[0] / 255 - avgIntensity) ** 2 + (textRgb[1] / 255 - avgIntensity) ** 2 + (textRgb[2] / 255 - avgIntensity) ** 2) / 3;

        const totalVariance = (varianceBg * bgPixels + varianceText * textPixels) / totalPixels;

        return Math.sqrt(totalVariance);
    }

    function updateColors() {
        const bgLightness = bgSlider.value;
        const textLightness = textSlider.value;

        const bgRgb = hslToRgb(0, 0, bgLightness);
        const textRgb = hslToRgb(0, 0, textLightness);

        root.style.setProperty('--bg-white-color', `hsl(0, 0%, ${bgLightness}%)`);
        root.style.setProperty('--text-white-color', `hsl(0, 0%, ${textLightness}%)`);

        bgValueDisplay.textContent = `${bgLightness}% (rgb(${bgRgb.join(', ')}))`;
        textValueDisplay.textContent = `${textLightness}% (rgb(${textRgb.join(', ')}))`;

        const rmsContrast = calculateRmsContrast(bgRgb, textRgb, textPixels, bgPixels);
        contrastRatioDisplay.textContent = `Contrast Ratio (RMS): ${rmsContrast.toFixed(2)}`;
    }

    bgSlider.addEventListener('input', updateColors);
    textSlider.addEventListener('input', updateColors);

    // Initialize the colors based on slider values
    updateColors();
});


