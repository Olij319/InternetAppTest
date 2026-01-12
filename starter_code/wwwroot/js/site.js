document.addEventListener('DOMContentLoaded', function () {
    // Your code here
   
    const fontEnlargeButton = document.querySelector("#font-enlarge");
    const fontDefaultButton = document.querySelector("#font-default");
    const fontReduceButton = document.querySelector("#font-reduce");

    const website = document.documentElement;

    const themeToggleButton = document.querySelector(".theme-controller")

    function enlargeFont() {
        website.classList.remove("font-small");
        website.classList.add("font-large");
        website.classList.remove("font-default");

        localStorage.setItem('font-size', 'large');
    }

    function resetFont() {
        website.classList.remove("font-large");
        website.classList.remove("font-small");
        website.classList.add("font-default");

        localStorage.setItem('font-size', 'default');
    }

    function reduceFont() {
        website.classList.remove("font-large");
        website.classList.add("font-small");
        website.classList.remove("font-default");

        localStorage.setItem('font-size', 'small');
    }

    function enableDarkMode() {
        website.setAttribute('data-theme', 'dark');
        if (themeToggleButton) themeToggleButton.checked = true;
        localStorage.setItem('colorMode', 'dark');
    }

    function disableDarkMode() {
        website.setAttribute('data-theme', 'light');
        if (themeToggleButton) themeToggleButton.checked = false;
        localStorage.setItem('colorMode', 'light');
    }

    function loadPreferences() {
        const savedFontSize = localStorage.getItem("font-size");
        const savedColorMode = localStorage.getItem("colorMode");
        if (savedFontSize === "large") {
            enlargeFont();
        }
        else if (savedFontSize === "small") {
            reduceFont();
        }
        else {
            resetFont();
        }
        if (savedColorMode === "dark") {
            enableDarkMode();
        }
        else {
            disableDarkMode();
        }
    }
    loadPreferences();

    // event listeners for font size buttons and color scheme buttons
    fontEnlargeButton.addEventListener("click", enlargeFont);
    fontDefaultButton.addEventListener("click", resetFont);
    fontReduceButton.addEventListener("click", reduceFont);

    if (themeToggleButton) {
        themeToggleButton.addEventListener('change', function (toggle) {
            if (toggle.target.checked) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        });
    }
    
    console.log('DOM fully loaded and parsed');
});
