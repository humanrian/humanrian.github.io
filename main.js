const strips = [...document.querySelectorAll('.strip')];
const numberSize = "8"; //in vmin, matches CSS .number height/width

function highlight(strip, d) {
  const targetNumber = strips[strip] ? strips[strip].querySelector(`.number:nth-of-type(${d + 1})`) : null;
  if (targetNumber) {
    targetNumber.classList.add('number-pop');
    setTimeout(() => {
      targetNumber.classList.remove('number-pop');
    }, 950);
  }
}

function stripSlider(strip, number) {
  let d1 = Math.floor(number / 10);
  let d2 = number % 10;

  if (strips[strip]) {
    strips[strip].style.transform = `translateY(${d1 * -numberSize}vmin)`;
    highlight(strip, d1);
  }
  if (strips[strip + 1]) {
    strips[strip + 1].style.transform = `translateY(${d2 * -numberSize}vmin)`;
    highlight(strip + 1, d2);
  }
}

setInterval(() => {
  const time = new Date();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  stripSlider(0, hours);
  stripSlider(2, minutes);
  stripSlider(4, seconds);
}, 1000);

// --- Dark Mode Toggle Functionality ---

// Get references to the body and the new animated toggle elements
const bodyElement = document.body;
const tdnnElement = document.getElementById('themeToggleAnimated'); // The main div of your animated toggle
const moonElement = tdnnElement ? tdnnElement.querySelector('.moon') : null; // The inner div that becomes sun/moon

/**
 * tdnn() - Called when the animated toggle is clicked.
 * Determines the target theme (light/dark) and calls setTheme.
 */
function tdnn() {
  if (!tdnnElement || !moonElement) {
    console.error("Animated toggle elements not found!");
    return;
  }

  const isCurrentlyDark = bodyElement.classList.contains('dark-mode');

  if (isCurrentlyDark) {
    setTheme('light'); // If it's dark, switch to light
  } else {
    setTheme('dark');  // If it's light, switch to dark
  }
}

/**
 * setTheme - Applies the chosen theme to the page.
 * @param {string} theme - The theme to set ('light' or 'dark').
 */
function setTheme(theme) {
  if (theme === 'dark') {
    bodyElement.classList.add('dark-mode');
    if (tdnnElement) tdnnElement.classList.remove('day'); // Visual state for toggle: night
    if (moonElement) moonElement.classList.remove('sun');  // Visual state for toggle: moon
    localStorage.setItem('theme', 'dark');
    console.log("Theme set to Dark");
  } else {
    bodyElement.classList.remove('dark-mode');
    if (tdnnElement) tdnnElement.classList.add('day');   // Visual state for toggle: day
    if (moonElement) moonElement.classList.add('sun');    // Visual state for toggle: sun
    localStorage.setItem('theme', 'light');
    console.log("Theme set to Light");
  }
}

// Check for saved theme preference on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme); // This will also set the animated toggle's initial state
  } else {
    setTheme('light'); // Default to light theme if no preference is saved
  }
  if (tdnnElement) {
    // The onclick in HTML already handles this, but this is an alternative:
    // tdnnElement.addEventListener('click', tdnn);
  } else {
      console.warn("#themeToggleAnimated element not found on DOMContentLoaded. The toggle might not work if tdnn() is not global or the element is missing.");
  }
});
