const btn = document.getElementById("theme-toggle");
const html = document.documentElement;
const moonIcon = document.getElementById("moon-icon");
const sunIcon = document.getElementById("sun-icon");

function getPreferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  html.setAttribute("data-theme", theme);
  localStorage.setItem('theme', theme);

  if (theme === "dark") {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  } else {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  }
}

btn.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  setTheme(next);
});

setTheme(getPreferredTheme());
