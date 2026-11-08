

const listEl = document.getElementById("destination-list");
const tableBodyEl = document.getElementById("price-table-body");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-filter");
const difficultySelect = document.getElementById("difficulty-filter");
const priceRange = document.getElementById("price-range");
const priceRangeValue = document.getElementById("price-range-value");
const sortSelect = document.getElementById("sort-select");
const resultsCount = document.getElementById("results-count");
const noResults = document.getElementById("no-results");
const resetButton = document.getElementById("reset-filters");


function filterDestinations(tours, filters) {
  const query = filters.query.trim().toLowerCase();
  return tours.filter(function (tour) {
    const text = (tour.name + " " + tour.region + " " + tour.description).toLowerCase();
    const matchesQuery = text.includes(query);
    const matchesCategory = filters.category === "all" || tour.category === filters.category;
    const matchesDifficulty = filters.difficulty === "all" || tour.difficulty === filters.difficulty;
    const matchesPrice = tour.price <= filters.maxPrice;
    return matchesQuery && matchesCategory && matchesDifficulty && matchesPrice;
  });
}

function sortDestinations(tours, sortBy) {
  const sorted = tours.slice();
  if (sortBy === "price-asc") {
    sorted.sort(function (a, b) { return a.price - b.price; });
  } else if (sortBy === "price-desc") {
    sorted.sort(function (a, b) { return b.price - a.price; });
  } else if (sortBy === "days") {
    sorted.sort(function (a, b) { return a.days - b.days; });
  } else if (sortBy === "name") {
    sorted.sort(function (a, b) { return a.name.localeCompare(b.name); });
  }
  return sorted;
}

function getUniqueValues(tours, property) {
  const values = [];
  for (const tour of tours) {
    if (!values.includes(tour[property])) {
      values.push(tour[property]);
    }
  }
  return values;
}

function fillSelect(select, values) {
  values.forEach(function (value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}


function renderCards(tours) {
  listEl.innerHTML = "";
  tours.forEach(function (tour) {
    listEl.appendChild(createDestinationCard(tour));
  });
  updateFavoriteButtons(); 
}

function renderPriceTable(tours) {
  tableBodyEl.innerHTML = "";
  for (const tour of tours) {
    const row = document.createElement("tr");
    row.innerHTML = "<td>" + tour.name + "</td><td>" + tour.days + "</td><td>" + tour.price + "</td>";
    tableBodyEl.appendChild(row);
  }
}

function applyFilters() {
  const filters = {
    query: searchInput.value,
    category: categorySelect.value,
    difficulty: difficultySelect.value,
    maxPrice: Number(priceRange.value)
  };
  const result = sortDestinations(filterDestinations(destinations, filters), sortSelect.value);

  renderCards(result);
  renderPriceTable(result);
  priceRangeValue.textContent = formatPrice(filters.maxPrice);
  resultsCount.textContent = "Showing " + result.length + " of " + destinations.length + " tours";
  noResults.classList.toggle("d-none", result.length > 0); // show/hide the empty message
}

function resetFilters() {
  searchInput.value = "";
  categorySelect.value = "all";
  difficultySelect.value = "all";
  priceRange.value = priceRange.max;
  sortSelect.value = "default";
  applyFilters();
}


function calculateFavoritesTotal(ids) {
  let total = 0;
  for (const id of ids) {
    total += findDestination(id).price;
  }
  return total;
}

function renderFavorites() {
  const list = document.getElementById("favorites-list");
  const emptyMessage = document.getElementById("favorites-empty");
  const summary = document.getElementById("favorites-summary");
  list.innerHTML = "";

  favorites.forEach(function (id) {
    const tour = findDestination(id);
    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML = "<span>" + tour.name + " <small class=\"text-muted\">(" + tour.days +
      "d, " + formatPrice(tour.price) + ")</small></span>";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-sm btn-outline-danger";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", "Remove " + tour.name + " from favorites");
    removeButton.addEventListener("click", function () {
      toggleFavorite(id);
    });

    item.appendChild(removeButton);
    list.appendChild(item); // add element
  });

  emptyMessage.classList.toggle("d-none", favorites.length > 0);
  summary.classList.toggle("d-none", favorites.length === 0);
  document.getElementById("favorites-total").textContent = formatPrice(calculateFavoritesTotal(favorites));
}


document.addEventListener("DOMContentLoaded", function () {
  fillSelect(categorySelect, getUniqueValues(destinations, "category"));
  fillSelect(difficultySelect, getUniqueValues(destinations, "difficulty"));

  // Slider range follows the most expensive tour in the array
  const maxTourPrice = Math.max(...destinations.map(function (tour) { return tour.price; }));
  priceRange.max = maxTourPrice;
  priceRange.value = maxTourPrice;

  // Three event types: input (typing, slider), change (selects), click (reset button)
  searchInput.addEventListener("input", applyFilters);
  priceRange.addEventListener("input", applyFilters);
  categorySelect.addEventListener("change", applyFilters);
  difficultySelect.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);
  resetButton.addEventListener("click", resetFilters);

  enableFavoriteClicks(listEl);
  document.addEventListener("favoriteschanged", renderFavorites);

  applyFilters();
  renderFavorites();
});
