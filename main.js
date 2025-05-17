const strips = [...document.querySelectorAll('.strip')];
const numberSize = "8"; //in vmin, matches CSS .number height/width

//highlighting number i on strip s for 1 second
function highlight(strip, d) {
  const targetNumber = strips[strip].querySelector(`.number:nth-of-type(${d + 1})`);
  if (targetNumber) {
    targetNumber.classList.add('number-pop');

    setTimeout(() => {
      targetNumber.classList.remove('number-pop');
    }, 950); //causes ticking
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
    highlight (strip + 1, d2);
  }
}

setInterval(() => {
  //get new time
  const time = new Date();

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  //slide strips
  stripSlider(0, hours);
  stripSlider(2, minutes);
  stripSlider(4, seconds);

}, 1000);

// --- Dark Mode Toggle Functionality ---
const themeToggleButton = document.getElementById('themeToggle');
const bodyElement = document.body;

// Function to set the theme
function setTheme(theme) {
  if (theme === 'dark') {
    bodyElement.classList.add('dark-mode');
    themeToggleButton.textContent = 'Light Mode'; // Change button text
    localStorage.setItem('theme', 'dark'); // Save preference
  } else {
    bodyElement.classList.remove('dark-mode');
    themeToggleButton.textContent = 'Dark Mode'; // Change button text
    localStorage.setItem('theme', 'light'); // Save preference
  }
}

// Event listener for the toggle button
themeToggleButton.addEventListener('click', () => {
  if (bodyElement.classList.contains('dark-mode')) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
});

// Check for saved theme preference on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Optional: set a default theme if nothing is saved (e.g., light)
    setTheme('light'); 
  }
});
