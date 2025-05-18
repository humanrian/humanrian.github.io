const allStrips = [...document.querySelectorAll('.clock-display .strip')];
const numberSize = "8";

const startPauseResumeBtn = document.getElementById('startPauseResumeBtn');
const resetBtn = document.getElementById('resetBtn');
const timerControlsDiv = document.querySelector('.timer-controls');
const timerContainer = document.querySelector('.timer-container');

const modeToggleBtn = document.getElementById('modeToggleBtn');
const bodyElement = document.body;
const tdnnElement = document.getElementById('themeToggleAnimated');
const moonElement = tdnnElement ? tdnnElement.querySelector('.moon') : null;
const fullscreenButton = document.getElementById('fullscreenBtn');
const docElement = document.documentElement;

// --- Application State ---
const APP_MODE = { CLOCK: 'clock', TIMER: 'timer' };
let currentAppMode = APP_MODE.CLOCK;

let clockIntervalId = null;
let clockHighlightTimeouts = [];

// Timer specific state
let timerInterval = null;
let totalSeconds = 0;
let initialSetTime = { hours: 0, minutes: 0, seconds: 0 };
const TIMER_STATE = { STOPPED: 'stopped', RUNNING: 'running', PAUSED: 'paused' };
let currentTimerState = TIMER_STATE.STOPPED;
let isSettingMode = true;

// --- Highlight Functions ---
function highlightForClock(stripRef, digit) {
  const stripElement = (typeof stripRef === 'number') ? allStrips[stripRef] : stripRef;
  if (!stripElement) return;
  const targetNumber = stripElement.querySelector(`.number:nth-of-type(${digit + 1})`);
  if (targetNumber) {
    const currentlyPopped = stripElement.querySelector('.number-pop');
    if (currentlyPopped && currentlyPopped !== targetNumber) {
      currentlyPopped.classList.remove('number-pop');
    }
    if (!targetNumber.classList.contains('number-pop')) {
      targetNumber.classList.add('number-pop');
      const timeoutId = setTimeout(() => {
        targetNumber.classList.remove('number-pop');
        clockHighlightTimeouts = clockHighlightTimeouts.filter(id => id !== timeoutId);
      }, 950);
      clockHighlightTimeouts.push(timeoutId);
    }
  }
}

function highlightForTimer(stripElement, digitValue) {
  if (!stripElement) return;
  const numbersInStrip = stripElement.querySelectorAll('.number');
  numbersInStrip.forEach(num => num.classList.remove('number-pop'));
  const targetNumber = stripElement.querySelector(`.number[data-value="${digitValue}"]`);
  if (targetNumber) {
    targetNumber.classList.add('number-pop');
  } else {
    const fallbackTarget = stripElement.querySelector(`.number:nth-of-type(${digitValue + 1})`);
    if (fallbackTarget) fallbackTarget.classList.add('number-pop');
  }
}

// --- Strip Sliding Functions ---
function slideStrip(stripElement, digit, isClockMode = false) {
  if (!stripElement) return;
  const numericDigit = parseInt(digit, 10);
  if (isNaN(numericDigit)) return;
  stripElement.style.transform = `translateY(${numericDigit * -parseFloat(numberSize)}vmin)`;
  if (isClockMode) {
    highlightForClock(stripElement, numericDigit);
  } else {
    highlightForTimer(stripElement, numericDigit);
  }
}

// --- Display Update Functions ---
function updateClockDisplayStrips() {
  const time = new Date();
  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  slideStrip(allStrips[0], Math.floor(h / 10), true);
  slideStrip(allStrips[1], h % 10, true);
  slideStrip(allStrips[2], Math.floor(m / 10), true);
  slideStrip(allStrips[3], m % 10, true);
  slideStrip(allStrips[4], Math.floor(s / 10), true);
  slideStrip(allStrips[5], s % 10, true);
}

function updateTimerDisplayStrips(hours, minutes, seconds) {
  slideStrip(allStrips[0], Math.floor(hours / 10), false);
  slideStrip(allStrips[1], hours % 10, false);
  slideStrip(allStrips[2], Math.floor(minutes / 10), false);
  slideStrip(allStrips[3], minutes % 10, false);
  slideStrip(allStrips[4], Math.floor(seconds / 10), false);
  slideStrip(allStrips[5], seconds % 10, false);
}

// --- Timer Logic ---
function runTimerCountdown() {
  if (totalSeconds <= 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    alert("Timer Finished!");
    currentTimerState = TIMER_STATE.STOPPED;
    isSettingMode = true;
    initialSetTime = { hours: 0, minutes: 0, seconds: 0 };
    if (currentAppMode === APP_MODE.TIMER) {
      if (timerContainer) timerContainer.classList.add('timer-setting-mode');
      if (startPauseResumeBtn) startPauseResumeBtn.textContent = 'Start';
      updateTimerDisplayStrips(0, 0, 0);
    }
    return;
  }
  totalSeconds--;
  if (currentAppMode === APP_MODE.TIMER && currentTimerState === TIMER_STATE.RUNNING) {
    const displayHours = Math.floor(totalSeconds / 3600);
    const displayMinutes = Math.floor((totalSeconds % 3600) / 60);
    const displaySeconds = totalSeconds % 60;
    updateTimerDisplayStrips(displayHours, displayMinutes, displaySeconds);
  }
}

function startTimerOperation() {
  if (currentTimerState === TIMER_STATE.STOPPED) {
    totalSeconds = (initialSetTime.hours * 3600) + (initialSetTime.minutes * 60) + initialSetTime.seconds;
    if (totalSeconds <= 0) return;
  }
  isSettingMode = false;
  if (timerContainer) timerContainer.classList.remove('timer-setting-mode');
  currentTimerState = TIMER_STATE.RUNNING;
  if (startPauseResumeBtn) startPauseResumeBtn.textContent = 'Pause';
  clearInterval(timerInterval);
  timerInterval = setInterval(runTimerCountdown, 1000);
  if (currentAppMode === APP_MODE.TIMER) {
    const displayHours = Math.floor(totalSeconds / 3600);
    const displayMinutes = Math.floor((totalSeconds % 3600) / 60);
    const displaySeconds = totalSeconds % 60;
    updateTimerDisplayStrips(displayHours, displayMinutes, displaySeconds);
  }
}

function pauseTimerOperation() {
  clearInterval(timerInterval);
  currentTimerState = TIMER_STATE.PAUSED;
  if (startPauseResumeBtn) startPauseResumeBtn.textContent = 'Resume';
}

function handleStartPauseResumeClick() {
  if (currentAppMode !== APP_MODE.TIMER) return;
  switch (currentTimerState) {
    case TIMER_STATE.STOPPED:
    case TIMER_STATE.PAUSED:
      startTimerOperation();
      break;
    case TIMER_STATE.RUNNING:
      pauseTimerOperation();
      break;
  }
}

function resetTimer(setToZero = true) {
  clearInterval(timerInterval);
  timerInterval = null;
  currentTimerState = TIMER_STATE.STOPPED;
  isSettingMode = true;
  if (setToZero) {
    initialSetTime = { hours: 0, minutes: 0, seconds: 0 };
  }
  totalSeconds = (initialSetTime.hours * 3600) + (initialSetTime.minutes * 60) + initialSetTime.seconds;
  if (currentAppMode === APP_MODE.TIMER) {
    if (timerContainer) timerContainer.classList.add('timer-setting-mode');
    if (startPauseResumeBtn) startPauseResumeBtn.textContent = 'Start';
    updateTimerDisplayStrips(initialSetTime.hours, initialSetTime.minutes, initialSetTime.seconds);
  }
}

function handleTimerNumberClick(event) {
  if (currentAppMode !== APP_MODE.TIMER || !isSettingMode) return;
  const clickedNumberDiv = event.currentTarget;
  const stripElement = clickedNumberDiv.parentElement;
  const digitValue = parseInt(clickedNumberDiv.dataset.value, 10);
  slideStrip(stripElement, digitValue, false);
  const stripId = stripElement.id;
  let ht = initialSetTime.hours >= 10 ? Math.floor(initialSetTime.hours / 10) : 0;
  let ho = initialSetTime.hours % 10;
  let mt = initialSetTime.minutes >= 10 ? Math.floor(initialSetTime.minutes / 10) : 0;
  let mo = initialSetTime.minutes % 10;
  let st = initialSetTime.seconds >= 10 ? Math.floor(initialSetTime.seconds / 10) : 0;
  let so = initialSetTime.seconds % 10;
  switch (stripId) {
    case 'hours-tens-strip':   ht = digitValue; break;
    case 'hours-ones-strip':   ho = digitValue; break;
    case 'minutes-tens-strip': mt = digitValue; break;
    case 'minutes-ones-strip': mo = digitValue; break;
    case 'seconds-tens-strip': st = digitValue; break;
    case 'seconds-ones-strip': so = digitValue; break;
  }
  initialSetTime.hours = Math.min(23, (ht * 10 + ho));
  initialSetTime.minutes = Math.min(59, (mt * 10 + mo));
  initialSetTime.seconds = Math.min(59, (st * 10 + so));
  totalSeconds = (initialSetTime.hours * 3600) + (initialSetTime.minutes * 60) + initialSetTime.seconds;
  updateTimerDisplayStrips(initialSetTime.hours, initialSetTime.minutes, initialSetTime.seconds);
}

// --- Mode Switching Logic ---
function switchToClockMode() {
  currentAppMode = APP_MODE.CLOCK;
  document.title = "Live Clock";
  if (typeof window.docTitle !== 'undefined') window.docTitle = "Live Clock";
  if (modeToggleBtn) modeToggleBtn.textContent = 'Switch to Timer';
  if (timerControlsDiv) timerControlsDiv.classList.add('hidden');
  if (timerContainer) timerContainer.classList.remove('timer-setting-mode');

  // Clear any PREVIOUS clock highlight timeouts before starting new ones
  clockHighlightTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
  clockHighlightTimeouts = [];

  clearInterval(clockIntervalId);
  updateClockDisplayStrips();
  clockIntervalId = setInterval(updateClockDisplayStrips, 1000);
}

function switchToTimerMode() {
  currentAppMode = APP_MODE.TIMER;
  document.title = "Interactive Timer";
  if (typeof window.docTitle !== 'undefined') window.docTitle = "Interactive Timer";
  if (modeToggleBtn) modeToggleBtn.textContent = 'Switch to Clock';
  if (timerControlsDiv) timerControlsDiv.classList.remove('hidden');

  clearInterval(clockIntervalId);
  clockIntervalId = null;

  // **** CRITICAL: Clear any pending timeouts from Clock Mode highlights ****
  clockHighlightTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
  clockHighlightTimeouts = [];

  let displayH, displayM, displayS;
  if (currentTimerState === TIMER_STATE.RUNNING) {
    if (startPauseResumeBtn) startPauseResumeBtn.textContent = 'Pause';
    isSettingMode = false;
    if (timerContainer) timerContainer.classList.remove('timer-setting-mode');
    displayH = Math.floor(totalSeconds / 3600);
    displayM = Math.floor((totalSeconds % 3600) / 60);
    displayS = totalSeconds % 60;
    updateTimerDisplayStrips(displayH, displayM, displayS);
  } else if (currentTimerState === TIMER_STATE.PAUSED) {
    if (startPauseResumeBtn) startPauseResumeBtn.textContent = 'Resume';
    isSettingMode = false;
    if (timerContainer) timerContainer.classList.remove('timer-setting-mode');
    displayH = Math.floor(totalSeconds / 3600);
    displayM = Math.floor((totalSeconds % 3600) / 60);
    displayS = totalSeconds % 60;
    updateTimerDisplayStrips(displayH, displayM, displayS);
  } else { // TIMER_STATE.STOPPED
    if (startPauseResumeBtn) startPauseResumeBtn.textContent = 'Start';
    isSettingMode = true;
    if (timerContainer) timerContainer.classList.add('timer-setting-mode');
    updateTimerDisplayStrips(initialSetTime.hours, initialSetTime.minutes, initialSetTime.seconds);
  }
}

function toggleAppMode() {
  if (currentAppMode === APP_MODE.CLOCK) {
    switchToTimerMode();
  } else {
    switchToClockMode();
  }
}

// --- Event Listeners ---
allStrips.forEach(strip => {
  strip.querySelectorAll('.number').forEach(numberDiv => {
    numberDiv.addEventListener('click', handleTimerNumberClick);
  });
});
if (startPauseResumeBtn) startPauseResumeBtn.addEventListener('click', handleStartPauseResumeClick);
if (resetBtn) resetBtn.addEventListener('click', () => resetTimer(true));
if (modeToggleBtn) modeToggleBtn.addEventListener('click', toggleAppMode);

// --- Initialization (`DOMContentLoaded`) ---
document.addEventListener('DOMContentLoaded', () => {

  const hourContainer = document.querySelector('.clock-display .hour');
  const minuteContainer = document.querySelector('.clock-display .minute');
  const secondContainer = document.querySelector('.clock-display .second');
  const timePartContainers = [hourContainer, minuteContainer, secondContainer].filter(el => el != null);
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) setTheme(savedTheme); else setTheme('light');
  if (tdnnElement && typeof tdnn === 'undefined' && tdnnElement.getAttribute('onclick')?.includes('tdnn()')) {
    window.tdnn = actualTdnnFunction;
  } else if (tdnnElement && !window.tdnn && !tdnnElement.getAttribute('onclick')) {
    tdnnElement.addEventListener('click', actualTdnnFunction);
  }

  updateFullscreenButton();
  if (fullscreenButton) fullscreenButton.addEventListener('click', toggleFullscreenHandler);
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  document.addEventListener('mozfullscreenchange', updateFullscreenButton);
  document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
  document.addEventListener('msfullscreenchange', updateFullscreenButton);

  setTimeout(() => {
    timePartContainers.forEach(container => {
      if (container) {
        container.style.overflow = 'visible';
      }
    });
    console.log("Overflow set to 'visible' for hour, minute, second containers.");
  }, 50);
  
  switchToClockMode();
  resetTimer(true);

  /* alert("This is a test site, features are still being developed and tested on this page."); */
  
  const resizeAlertKey = 'resizeFixAlertShown_v2';
  const hasResizeAlertBeenShown = localStorage.getItem(resizeAlertKey);
  const isLikelyDesktop = window.innerWidth > 1000;
  if (!hasResizeAlertBeenShown && isLikelyDesktop) {
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
  const currentAppVersion = "1.8.1";
  const changelogStorageKey = 'changelogViewedVersion';
  const lastViewedVersion = localStorage.getItem(changelogStorageKey);

  if (lastViewedVersion !== currentAppVersion) {
    const changelogText =
      "What's New - App Version " + currentAppVersion + ":\n\n" +
     /* "- v1.0: Clock Launch\n" +
      "  Initial release of the digital flip clock.\n\n" +
      "- v1.1: Dark Mode Introduced\n" +
      "  A sleek dark theme is now available for comfortable viewing in low-light conditions.\n\n" +
      "- v1.2: Upgraded Theme Toggle\n" +
      "  The dark mode button has been enhanced to a more intuitive toggle switch.\n\n" +
      "- v1.3: Fullscreen Mode Added\n" +
      "  Enjoy an immersive, distraction-free view with the new fullscreen option!\n\n" + */
      "- v1.4: Changelog Created\n" +
      "  Added this 'What's New' section to keep you updated!\n\n" +
      "- v1.5: Timer Created\n" +
      "  Introducing a handy timer function.\n\n" +
      "- v1.6: Timer Input Enhanced\n" +
      "  Timer input now uses direct clicks on numbers for easier setting.\n\n" +
      "- v1.7: Timer Bug Fix\n" +
      "  Resolved an issue where the timer page could freeze when switching from the clock while the timer was active.\n\n" +
      "- v1.7.1: Visual Bug Fix\n" +
      "  Corrected a visual bug related to highlighting appearing at the top of the page.\n\n" +
      "- v1.8: Timer Background Operation\n" +
      "  The timer is now able to continue running in the background.\n\n" +
      "- v1.8.1: Delayed Overflow Clipping (Experiment)\n" +
      "  Experimenting with delaying the `overflow:hidden` on time segments.";

    alert(changelogText);
    localStorage.setItem(changelogStorageKey, currentAppVersion);
  }
  if (typeof window.docTitle !== 'undefined') window.docTitle = document.title;
});

// --- Helper functions for Dark Mode & Fullscreen ---
function actualTdnnFunction() {
    if (!tdnnElement || !moonElement) { console.error("Theme toggle elements not found!"); return; }
    const isCurrentlyDark = bodyElement.classList.contains('dark-mode');
    setTheme(isCurrentlyDark ? 'light' : 'dark');
}
if (tdnnElement && tdnnElement.getAttribute('onclick')?.includes('tdnn()') && typeof tdnn === 'undefined') {
    window.tdnn = actualTdnnFunction;
}

function setTheme(theme) {
    if (!bodyElement) return;
    if (theme === 'dark') {
        bodyElement.classList.add('dark-mode');
        if (tdnnElement) tdnnElement.classList.remove('day');
        if (moonElement) moonElement.classList.remove('sun');
        localStorage.setItem('theme', 'dark');
    } else {
        bodyElement.classList.remove('dark-mode');
        if (tdnnElement) tdnnElement.classList.add('day');
        if (moonElement) moonElement.classList.add('sun');
        localStorage.setItem('theme', 'light');
    }
}


function toggleFullscreenHandler() {
    if (isFullscreen()) exitFullscreen(); else enterFullscreen();
}


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
