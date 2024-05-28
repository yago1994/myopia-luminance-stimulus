document.addEventListener('DOMContentLoaded', function () {
    const bgSlider = document.getElementById('bg-lightness-slider');
    const textSlider = document.getElementById('text-lightness-slider');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const bgValueDisplay = document.getElementById('bg-lightness-value');
    const textValueDisplay = document.getElementById('text-lightness-value');
    const fontSizeValueDisplay = document.getElementById('font-size-value');
    const contrastRatioDisplay = document.getElementById('contrast-ratio');
    const root = document.documentElement;
    const fullscreenText = document.querySelector('.fullscreen-text');
    
    const textPixels = 408617;
    const bgPixels = 2272679;

    let isDarkMode = false;
    let isBaseline = false;

    let savedBgColor, savedTextColor;

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
    fontSizeSlider.addEventListener('input', updateFontSize);

    // Initialize the colors based on slider values
    updateColors();
    updateFontSize();
    detectDeviceAndSetFontSize();

    function toggleDarkMode() {
        if (isDarkMode) {
            document.querySelector('.fullscreen-text').style.backgroundColor = 'var(--bg-dark-color)';
            document.querySelector('.fullscreen-text').style.color = 'var(--text-white-color)';
        } else {
            document.querySelector('.fullscreen-text').style.backgroundColor = 'var(--bg-white-color)';
            document.querySelector('.fullscreen-text').style.color = 'var(--text-dark-color)';
        }
        isDarkMode = !isDarkMode;
    }

    function toggleBaseline(){
        if (isBaseline) {
            // Revert to saved colors
            document.querySelector('.fullscreen-text').style.backgroundColor = savedBgColor;
            document.querySelector('.fullscreen-text').style.color = savedTextColor;
        } else {
            // Save current colors
            savedBgColor =   document.querySelector('.fullscreen-text').style.backgroundColor;
            savedTextColor = document.querySelector('.fullscreen-text').style.color;

            document.querySelector('.fullscreen-text').style.backgroundColor = 'var(--baseline-color)';
            document.querySelector('.fullscreen-text').style.color = 'var(--baseline-color)';
        }
        isBaseline = !isBaseline;
    }

    function updateFontSize() {
        const fontSize = 30 + fontSizeSlider.value/10;
        fullscreenText.style.fontSize = `${fontSize}px`;
        fontSizeValueDisplay.textContent = `${fontSize}px`;
    }

    function detectDeviceAndSetFontSize() {
        const userAgent = navigator.userAgent;
        console.log(userAgent);
        // Detecting Vision Pro device
        if (userAgent.includes('VisionPro')) {
            // Assuming Vision Pro devices would have this user agent identifier
            fullscreenText.style.fontSize = '34.5px'; // Larger font size for Vision Pro
        } else {
            fullscreenText.style.fontSize = '4.0rem'; // Default font size for computers
        }

        // Initialize the slider with the detected font size
        fontSizeSlider.value = parseInt(fullscreenText.style.fontSize);
        fontSizeValueDisplay.textContent = userAgent;
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'i') {
            toggleDarkMode();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'b') {
            toggleBaseline();
        }
    });
});

