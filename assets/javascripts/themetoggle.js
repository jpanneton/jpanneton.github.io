// The initial theme is resolved by an inline script in the head, before the
// first paint. This file only handles switching after that.

function themer(theme) {
  document.getElementById('dark').disabled = theme !== 'dark';
}

function currentTheme() {
  return document.getElementById('dark').disabled ? 'light' : 'dark';
}

function storedTheme() {
  try {
    return localStorage.getItem('theme');
  } catch (e) {
    return null;
  }
}

// Theme toggle
function toggle() {
  var next = currentTheme() === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem('theme', next);
  } catch (e) {}
  themer(next);
}

// Keep following the system preference until a theme is picked explicitly.
if (window.matchMedia) {
  var query = window.matchMedia('(prefers-color-scheme: dark)');
  var follow = function (event) {
    if (!storedTheme()) {
      themer(event.matches ? 'dark' : 'light');
    }
  };

  if (query.addEventListener) {
    query.addEventListener('change', follow);
  } else if (query.addListener) {
    query.addListener(follow);
  }
}
