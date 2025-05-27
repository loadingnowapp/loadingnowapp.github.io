// Global settings object
let settings = {
    theme: 'win9x', // Changed default theme
    animateBars: true,
    precision: 2,
};

// Helper function to update progress bar and text
function updateProgress(barId, textId, currentSeconds, totalSeconds) {
    // Prevent division by zero if totalSeconds is 0
    const percentage = totalSeconds === 0 ? 0 : (currentSeconds / totalSeconds) * 100;
    // Clamp percentage between 0 and 100
    const clampedPercentage = Math.min(100, Math.max(0, percentage));

    const loadingBar = document.getElementById(barId);
    const percentageText = document.getElementById(textId);

    if (loadingBar && percentageText) {
        // Ensure style updates respect transitions
        requestAnimationFrame(() => {
            loadingBar.style.width = clampedPercentage + '%';
        });
        // Use the precision setting
        percentageText.textContent = `${clampedPercentage.toFixed(settings.precision)}%`;
    }
}

// Helper function to check for leap year
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Helper function to format seconds into HH:MM:SS
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

function updateClocks() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11
    const dayOfMonth = now.getDate(); // 1-31
    const dayOfWeek = now.getDay(); // 0-6 (Sunday is 0)

    const millisecondsPerSecond = 1000;
    const secondsPerMinute = 60;
    const minutesPerHour = 60;
    const hoursPerDay = 24;
    const totalSecondsInDay = hoursPerDay * minutesPerHour * secondsPerMinute;
    const millisecondsPerDay = millisecondsPerSecond * totalSecondsInDay;

    // Calculate seconds passed today
    const secondsPassedToday = (hours * minutesPerHour * secondsPerMinute) + (minutes * secondsPerMinute) + seconds;

    // --- Day Progress ---
    updateProgress('day-progress-bar', 'day-percentage-text', secondsPassedToday, totalSecondsInDay);
    const dayTooltip = document.getElementById('day-progress-tooltip');
    if (dayTooltip) {
        dayTooltip.textContent = formatTime(secondsPassedToday);
    }

    // --- Week Progress ---
    const secondsPassedThisWeek = (dayOfWeek * totalSecondsInDay) + secondsPassedToday;
    const totalSecondsInWeek = 7 * totalSecondsInDay;
    updateProgress('week-progress-bar', 'week-percentage-text', secondsPassedThisWeek, totalSecondsInWeek);
    const weekTooltip = document.getElementById('week-progress-tooltip');
    if (weekTooltip) {
        weekTooltip.textContent = `Day ${dayOfWeek + 1} / 7 days`;
    }

    // --- Month Progress ---
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const secondsPassedThisMonth = ((dayOfMonth - 1) * totalSecondsInDay) + secondsPassedToday;
    const totalSecondsInMonth = daysInMonth * totalSecondsInDay;
    updateProgress('month-progress-bar', 'month-percentage-text', secondsPassedThisMonth, totalSecondsInMonth);
    const monthTooltip = document.getElementById('month-progress-tooltip');
    if (monthTooltip) {
        monthTooltip.textContent = `Day ${dayOfMonth} / ${daysInMonth} days`;
    }

    // --- Year Progress ---
    const startOfYear = new Date(year, 0, 1);
    const dayOfYearMs = now - startOfYear;
    const dayOfYear = Math.floor(dayOfYearMs / millisecondsPerDay) + 1;
    const secondsPassedThisYear = ((dayOfYear - 1) * totalSecondsInDay) + secondsPassedToday;
    const daysInYear = isLeapYear(year) ? 366 : 365;
    const totalSecondsInYear = daysInYear * totalSecondsInDay;
    updateProgress('year-progress-bar', 'year-percentage-text', secondsPassedThisYear, totalSecondsInYear);
    const yearTooltip = document.getElementById('year-progress-tooltip');
    if (yearTooltip) {
        yearTooltip.textContent = `Day ${dayOfYear} / ${daysInYear} days`;
    }

    // --- Decade Progress ---
    const startYearOfDecade = year - (year % 10);
    const startOfDecade = new Date(startYearOfDecade, 0, 1);
    const msPassedThisDecade = now - startOfDecade;
    const secondsPassedThisDecade = msPassedThisDecade / millisecondsPerSecond;
    let totalMsInDecade = 0;
    for (let i = 0; i < 10; i++) {
        const currentYear = startYearOfDecade + i;
        const days = isLeapYear(currentYear) ? 366 : 365;
        totalMsInDecade += days * millisecondsPerDay;
    }
    const totalSecondsInDecade = totalMsInDecade / millisecondsPerSecond;
    updateProgress('decade-progress-bar', 'decade-percentage-text', secondsPassedThisDecade, totalSecondsInDecade);
    const decadeTooltip = document.getElementById('decade-progress-tooltip');
    if (decadeTooltip) {
        const endYearOfDecade = startYearOfDecade + 9;
        const yearInDecade = year - startYearOfDecade + 1;
        decadeTooltip.textContent = `Year ${yearInDecade} / 10 years (${startYearOfDecade} - ${endYearOfDecade})`;
    }

    // --- Century Progress ---
    const startYearOfCentury = Math.floor((year - 1) / 100) * 100 + 1;
    const startOfCentury = new Date(startYearOfCentury, 0, 1);
    const msPassedThisCentury = now - startOfCentury;
    const secondsPassedThisCentury = msPassedThisCentury / millisecondsPerSecond;
    let totalMsInCentury = 0;
    for (let i = 0; i < 100; i++) {
        const currentYear = startYearOfCentury + i;
        const days = isLeapYear(currentYear) ? 366 : 365;
        totalMsInCentury += days * millisecondsPerDay;
    }
    const totalSecondsInCentury = totalMsInCentury / millisecondsPerSecond;
    updateProgress('century-progress-bar', 'century-percentage-text', secondsPassedThisCentury, totalSecondsInCentury);
    const centuryTooltip = document.getElementById('century-progress-tooltip');
    if (centuryTooltip) {
        const endYearOfCentury = startYearOfCentury + 99;
        const yearInCentury = year - startYearOfCentury + 1;
        centuryTooltip.textContent = `Year ${yearInCentury} / 100 years (${startYearOfCentury} - ${endYearOfCentury})`;
    }
}

// --- Settings Modal Logic ---
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsButton = document.getElementById('close-settings');
const themeButtons = document.querySelectorAll('.theme-options button');
const animationToggle = document.getElementById('toggle-animation');
const precisionSelect = document.getElementById('percentage-precision');
const container = document.querySelector('.container'); // For animation class

// Show modal
settingsButton.addEventListener('click', () => {
    // Ensure current settings are reflected in the modal controls
    animationToggle.checked = settings.animateBars;
    precisionSelect.value = settings.precision;
    setActiveButton('.theme-options', `[data-theme="${settings.theme}"]`);
    settingsModal.classList.add('visible');
});

// Hide modal
closeSettingsButton.addEventListener('click', () => {
    settingsModal.classList.remove('visible');
});

// Hide modal if clicking outside the content
settingsModal.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        settingsModal.classList.remove('visible');
    }
});

// Helper to visually mark active settings buttons
function setActiveButton(parentSelector, buttonSelector) {
    const parent = document.querySelector(parentSelector);
    if (parent) {
        parent.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        const activeButton = parent.querySelector(buttonSelector);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
}

// Apply Theme Function - Updated to change stylesheet link
function applyTheme(themeName) {
    const themeLink = document.getElementById('theme-style');
    if (themeLink) {
        themeLink.setAttribute('href', `themes/${themeName}.css`);
    }
    settings.theme = themeName;
    localStorage.setItem('selectedTheme', themeName);
    setActiveButton('.theme-options', `[data-theme="${themeName}"]`);
}

// Apply Animation Function
function applyAnimation(animate) {
    settings.animateBars = animate;
    if (animate) {
        container.classList.add('animate-bars');
    } else {
        container.classList.remove('animate-bars');
    }
    localStorage.setItem('animateBars', animate);
    animationToggle.checked = animate; // Sync checkbox state
}

// Apply Precision Function
function applyPrecision(precisionValue) {
    settings.precision = parseInt(precisionValue, 10);
    localStorage.setItem('percentagePrecision', settings.precision);
    // Update visible percentages immediately
    updateClocks();
    precisionSelect.value = settings.precision; // Sync dropdown state
}

// Add event listeners to theme buttons
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const themeName = button.getAttribute('data-theme');
        applyTheme(themeName);
    });
});

// Add event listener for animation toggle
animationToggle.addEventListener('change', (event) => {
    applyAnimation(event.target.checked);
});

// Add event listener for precision select
precisionSelect.addEventListener('change', (event) => {
    applyPrecision(event.target.value);
});

// --- Tooltip Toggle Logic for Tap ---
const barContainers = document.querySelectorAll('.loading-bar-container');
let activeTooltip = null; // Track the currently visible tooltip

function hideAllTooltips() {
    document.querySelectorAll('.progress-tooltip').forEach(tooltip => {
        tooltip.classList.remove('visible');
    });
    activeTooltip = null;
}

barContainers.forEach(container => {
    container.addEventListener('click', () => {
        const tooltipId = container.getAttribute('data-tooltip-id');
        const tooltip = document.getElementById(tooltipId);

        if (tooltip) {
            if (tooltip.classList.contains('visible')) {
                // If this tooltip is already visible, hide it
                tooltip.classList.remove('visible');
                activeTooltip = null;
            } else {
                // If a different tooltip is visible, hide it first
                if (activeTooltip && activeTooltip !== tooltip) {
                    activeTooltip.classList.remove('visible');
                }
                // Show the tapped tooltip
                tooltip.classList.add('visible');
                activeTooltip = tooltip;
            }
        }
    });
});

// Optional: Hide tooltip when clicking outside any container
document.addEventListener('click', (event) => {
    // Check if the click was outside any loading-bar-container and not inside the modal
    let isInsideContainer = false;
    let targetElement = event.target;
    while (targetElement) {
        if (targetElement.classList && targetElement.classList.contains('loading-bar-container')) {
            isInsideContainer = true;
            break;
        }
        if (targetElement.closest('.settings-content')) {
             return; // Don't hide if clicking inside the modal content
        }
        if (targetElement.classList && targetElement.classList.contains('settings-modal')) {
            return;
        }
        targetElement = targetElement.parentElement;
    }

    if (!isInsideContainer) {
        hideAllTooltips();
    }
});

// --- Title Animation Logic ---
const baseTitle = "Loading Now"; // Updated base title
const dots = ['', '.', '..', '...'];
let dotIndex = 0;

function animateTitle() {
    document.title = `${baseTitle}${dots[dotIndex]}`;
    dotIndex = (dotIndex + 1) % dots.length;
    setTimeout(animateTitle, 500);
}

// Apply saved settings on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selectedTheme');
    const savedAnimate = localStorage.getItem('animateBars');
    const savedPrecision = localStorage.getItem('percentagePrecision');

    // Determine the theme to apply on load
    let initialTheme = settings.theme; // Start with the default theme
    if (savedTheme) {
        initialTheme = savedTheme;
    }
    applyTheme(initialTheme);

    const animate = savedAnimate !== null ? (savedAnimate === 'true') : true;
    applyAnimation(animate);

    const precision = savedPrecision !== null ? parseInt(savedPrecision, 10) : 2;
    applyPrecision(precision);

    animateTitle();
});

// Update every second (1000 milliseconds)
setInterval(updateClocks, 1000);

// Initial call to display the progress immediately on page load
updateClocks();