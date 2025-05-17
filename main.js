const strips = [...document.querySelectorAll('.strip')];
const numberSize = "8";


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
const bodyElement = document.body;
const tdnnElement = document.getElementById('themeToggleAnimated');
const moonElement = tdnnElement ? tdnnElement.querySelector('.moon') : null;


function tdnn() {
  if (!tdnnElement || !moonElement) {
    console.error("Animated toggle elements not found!");
    return;
  }

  const isCurrentlyDark = bodyElement.classList.contains('dark-mode');

  if (isCurrentlyDark) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}


function setTheme(theme) {
  if (theme === 'dark') {
    bodyElement.classList.add('dark-mode');
    if (tdnnElement) tdnnElement.classList.remove('day');
    if (moonElement) moonElement.classList.remove('sun');
    localStorage.setItem('theme', 'dark');
    console.log("Theme set to Dark");
  } else {
    bodyElement.classList.remove('dark-mode');
    if (tdnnElement) tdnnElement.classList.add('day');
    if (moonElement) moonElement.classList.add('sun');
    localStorage.setItem('theme', 'light');
    console.log("Theme set to Light");
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme('light');
  }
  if (tdnnElement) {
    // tdnnElement.addEventListener('click', tdnn);
  } else {
      console.warn("#themeToggleAnimated element not found on DOMContentLoaded. The toggle might not work if tdnn() is not global or the element is missing.");
  }
  //--- Resize Alert ---
  const resizeAlertKey = 'resizeFixAlertShown_v1';
  const hasAlertBeenShown = localStorage.getItem(resizeAlertKey);
  const isLikelyDesktop = window.innerWidth > 1000;

  if (!hasAlertBeenShown && isLikelyDesktop) {
    alert(
      "Welcome! For the best visual experience with the clock animation on this page, " +
      "if you notice any elements not looking quite right on first load, " +
      "please try briefly resizing your browser window (e.g., make it a little smaller, then back to full screen or your preferred size). " +
      "This can help ensure all animations initialize perfectly.\n\n" +
      "(You'll only see this message once on larger screens.)"
    );
    localStorage.setItem(resizeAlertKey, 'true');
  }
  //--- Changelog Alert ---
  const currentAppVersion = "1.3";
  const changelogStorageKey = 'changelogViewedVersion';
  const lastViewedVersion = localStorage.getItem(changelogStorageKey);

  if (lastViewedVersion !== currentAppVersion) {
    const changelogText =
      "What's New - App Version " + currentAppVersion + ":\n\n" + 
      "- v1.0: Clock Launch\n" +
      "  Initial release of the digital clock because I am bored.\n\n" +
      "- v1.1: Dark Mode Introduced\n" +
      "  A sleek dark theme is now available for comfortable viewing in low-light conditions.\n\n" +
      "- v1.2: Upgraded Theme Toggle\n" +
      "  The dark mode button has been enhanced to a more intuitive toggle switch.\n\n" +
      "- v1.3: Fullscreen Mode Added\n" +
      "  Enjoy an immersive, distraction-free view with the new fullscreen option!";

    alert(changelogText);
    localStorage.setItem(changelogStorageKey, currentAppVersion);
  }
});


const fullscreenButton = document.getElementById('fullscreenBtn');
const docElement = document.documentElement;

function enterFullscreen() {
  if (docElement.requestFullscreen) {
    docElement.requestFullscreen();
  } else if (docElement.mozRequestFullScreen) { // Firefox
    docElement.mozRequestFullScreen();
  } else if (docElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
    docElement.webkitRequestFullscreen();
  } else if (docElement.msRequestFullscreen) { // IE/Edge
    docElement.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { // IE/Edge
    document.msExitFullscreen();
  }
}

function isFullscreen() {
  return document.fullscreenElement ||
         document.mozFullScreenElement ||
         document.webkitFullscreenElement ||
         document.msFullscreenElement;
}

function updateFullscreenButton() {
  if (fullscreenButton) {
    if (isFullscreen()) {
      fullscreenButton.textContent = 'Exit Fullscreen';
      fullscreenButton.setAttribute('aria-label', 'Exit Fullscreen');
    } else {
      fullscreenButton.textContent = 'Enter Fullscreen';
      fullscreenButton.setAttribute('aria-label', 'Enter Fullscreen');
    }
  }
}

if (fullscreenButton) {
  fullscreenButton.addEventListener('click', () => {
    if (isFullscreen()) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  });
}

// Listen for fullscreen changes (e.g., user pressing Esc key) to update button text
document.addEventListener('fullscreenchange', updateFullscreenButton);
document.addEventListener('mozfullscreenchange', updateFullscreenButton);
document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
document.addEventListener('msfullscreenchange', updateFullscreenButton);

updateFullscreenButton();
