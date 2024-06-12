document.addEventListener('DOMContentLoaded', function () {
    const searchContainer = document.querySelector('.search-container');
    const searchField = document.getElementById('search-field');
    const searchButton = document.getElementById('search-button');
    const fullscreenText = document.getElementById('fullscreen-text');

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

    let originalContent = '';

    function toggleSearchField() {
        searchContainer.classList.toggle('hidden');
        // if (searchContainer.classList.contains('hidden')) {
        //     removeHighlights();
        // }
    }

    function storeOriginalContent() {
        originalContent = fullscreenText.innerHTML;
    }

    function restoreOriginalContent() {
        fullscreenText.innerHTML = originalContent;
    }

    function removeHighlights() {
        restoreOriginalContent();
    }

    function searchAndScroll() {
        const searchText = searchField.value.toLowerCase();
        if (!searchText) return;

        removeHighlights();
        let found = false;

        const paragraphs = fullscreenText.querySelectorAll('p');
        paragraphs.forEach(paragraph => {
            const paragraphText = paragraph.innerHTML.toLowerCase();
            if (paragraphText.includes(searchText)) {
                const regex = new RegExp(searchText, 'gi');
                const highlightedText = paragraph.innerHTML.replace(regex, match => `<span class="highlight">${match}</span>`);
                paragraph.innerHTML = highlightedText;

                if (!found) {
                    const highlight = paragraph.querySelector('.highlight');
                    if (highlight) {
                        highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        found = true;
                    }
                }
            }
        });

        if (!found) {
            alert('Text not found');
        }
    }

    storeOriginalContent();

    searchButton.addEventListener('click', searchAndScroll);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'f') {
            toggleSearchField();
        } else if (e.key === 'Escape') {
            removeHighlights();
            searchContainer.classList.toggle('hidden');
        } else if (e.key === 'h') {
            removeHighlights();
        } else if (e.key === 'i') {
            toggleDarkMode();
        } else if (e.key === 'b') {
            toggleBaseline();
        }
    });
});

