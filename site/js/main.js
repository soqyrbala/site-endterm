
let favorites = [];


function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    return fallback; // storage blocked or data corrupted
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Could not save to localStorage:", error);
  }
}

// Returns a string like "$180".
function formatPrice(amount) {
  return "$" + amount.toLocaleString("en-US");
}

// Returns the tour object with the given id (or undefined).
function findDestination(id) {
  return destinations.find(function (tour) {
    return tour.id === id;
  });
}

/* ---------- Favorites ---------- */

function isFavorite(id) {
  return favorites.includes(id);
}

// Adds or removes a tour from favorites and updates the whole page.
function toggleFavorite(id) {
  if (isFavorite(id)) {
    favorites = favorites.filter(function (favId) {
      return favId !== id;
    });
  } else {
    favorites.push(id);
  }
  saveToStorage("favorites", favorites);
  updateFavoriteButtons();
  updateFavoriteBadge();
  // Other scripts (e.g. the favorites panel) listen for this event
  document.dispatchEvent(new CustomEvent("favoriteschanged"));

  const tour = findDestination(id);
  showToast(isFavorite(id) ? tour.name + " added to favorites" : tour.name + " removed from favorites");
}

// Repaints every heart button so it matches the favorites array.
function updateFavoriteButtons() {
  document.querySelectorAll(".btn-fav").forEach(function (button) {
    const active = isFavorite(button.dataset.id);
    button.classList.toggle("is-favorite", active);
    button.setAttribute("aria-pressed", String(active));
    button.textContent = active ? "\u2665" : "\u2661"; // ♥ / ♡
  });
}

function updateFavoriteBadge() {
  const badge = document.getElementById("fav-count");
  if (badge) {
    badge.textContent = favorites.length;
  }
}


function applyTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  const button = document.getElementById("theme-toggle");
  if (button) {
    button.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    button.setAttribute("aria-pressed", String(theme === "dark"));
  }
}

function initThemeToggle() {
  const button = document.getElementById("theme-toggle");
  applyTheme(loadFromStorage("theme", "light"));
  button.addEventListener("click", function () {
    const next = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    saveToStorage("theme", next);
  });
}


function createDestinationCard(tour) {
  const column = document.createElement("div");
  column.className = "col-12 col-md-6 col-lg-4";

  let highlightItems = "";
  for (const item of tour.highlights) {
    highlightItems += "<li>" + item + "</li>";
  }

  column.innerHTML =
    '<article class="card destination-card h-100">' +
      '<img src="' + tour.image + '" class="card-img-top" alt="' + tour.name + '" loading="lazy">' +
      '<div class="card-body d-flex flex-column">' +
        '<div class="d-flex justify-content-between align-items-start">' +
          '<h3 class="h5 card-title">' + tour.name + "</h3>" +
          '<button type="button" class="btn-fav" data-id="' + tour.id + '" ' +
            'aria-label="Toggle favorite: ' + tour.name + '" aria-pressed="false">\u2661</button>' +
        "</div>" +
        '<p class="small tour-meta">' + tour.category + " &middot; " + tour.difficulty +
          " &middot; " + tour.days + (tour.days === 1 ? " day" : " days") + "</p>" +
        '<p class="card-text">' + tour.description + "</p>" +
        '<div class="card-details"><ul class="small ps-3 mb-0">' + highlightItems + "</ul></div>" +
        '<div class="mt-auto pt-3 d-flex justify-content-between align-items-center">' +
          '<span class="tour-price">' + formatPrice(tour.price) + "</span>" +
          "<div>" +
            '<button type="button" class="btn btn-sm btn-outline-secondary btn-details" aria-expanded="false">Details</button> ' +
            '<a href="contact.html?tour=' + tour.id + '" class="btn btn-sm btn-saffron">Book</a>' +
          "</div>" +
        "</div>" +
      "</div>" +
    "</article>";

  return column;
}

function enableFavoriteClicks(container) {
  container.addEventListener("click", function (event) {
    const button = event.target.closest(".btn-fav");
    if (button) {
      toggleFavorite(button.dataset.id);
    }
  });
}


function renderFeaturedTours() {
  const container = document.getElementById("featured-list");
  if (!container) {
    return; // not the Home page
  }
  destinations
    .filter(function (tour) {
      return tour.featured;
    })
    .forEach(function (tour) {
      container.appendChild(createDestinationCard(tour));
    });
  enableFavoriteClicks(container);
}


document.addEventListener("DOMContentLoaded", function () {
  favorites = loadFromStorage("favorites", []);
  initThemeToggle();
  renderFeaturedTours();
  updateFavoriteButtons();
  updateFavoriteBadge();
});
