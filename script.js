document.addEventListener('DOMContentLoaded', function () {

    let isDarkMode = false;
    let isBaseline = false;

    let savedBgColor, savedTextColor;

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

