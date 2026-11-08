

const galleryGrid = document.getElementById("gallery-grid");
const filterBar = document.getElementById("gallery-filters");
const galleryCount = document.getElementById("gallery-count");

let visibleItems = [];   
let currentIndex = 0;    
let lightboxEl = null;   
let lastFocused = null;  


function filterGallery(items, category) {
  if (category === "All") {
    return items;
  }
  return items.filter(function (item) {
    return item.category === category;
  });
}

function wrapIndex(index, length) {
  return (index + length) % length;
}

function renderGallery(items) {
  galleryGrid.innerHTML = "";
  items.forEach(function (item, index) {
    const figure = document.createElement("figure");
    if (item.wide) {
      figure.classList.add("wide");
    }
    figure.innerHTML =
      '<button type="button" class="gallery-btn" data-index="' + index + '" aria-label="Open photo: ' + item.caption + '">' +
        '<img src="' + item.src + '" alt="' + item.alt + '" loading="lazy">' +
      "</button>" +
      "<figcaption>" + item.caption + "</figcaption>";
    galleryGrid.appendChild(figure);
  });
  galleryCount.textContent = "Showing " + items.length + " of " + galleryItems.length + " photos";
}

function renderFilterButtons() {
  const categories = ["All"];
  for (const item of galleryItems) {
    if (!categories.includes(item.category)) {
      categories.push(item.category);
    }
  }
  categories.forEach(function (category) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-secondary btn-sm filter-btn";
    button.textContent = category;
    button.dataset.category = category;
    button.setAttribute("aria-pressed", "false");
    filterBar.appendChild(button);
  });
}

function setActiveFilter(category) {
  filterBar.querySelectorAll(".filter-btn").forEach(function (button) {
    const active = button.dataset.category === category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}


function showLightboxPhoto() {
  const item = visibleItems[currentIndex];
  lightboxEl.querySelector("img").src = item.src;
  lightboxEl.querySelector("img").alt = item.alt;
  lightboxEl.querySelector(".lightbox-caption").textContent =
    item.caption + " (" + (currentIndex + 1) + " / " + visibleItems.length + ")";
}

function openLightbox(index) {
  lastFocused = document.activeElement;
  currentIndex = index;

  lightboxEl = document.createElement("div");
  lightboxEl.className = "lightbox";
  lightboxEl.setAttribute("role", "dialog");
  lightboxEl.setAttribute("aria-modal", "true");
  lightboxEl.setAttribute("aria-label", "Photo viewer");
  lightboxEl.innerHTML =
    '<button type="button" class="lightbox-close btn btn-light" aria-label="Close photo viewer">&times;</button>' +
    '<button type="button" class="lightbox-nav lightbox-prev btn btn-light" aria-label="Previous photo">&#8249;</button>' +
    '<figure class="lightbox-figure"><img src="" alt=""><figcaption class="lightbox-caption"></figcaption></figure>' +
    '<button type="button" class="lightbox-nav lightbox-next btn btn-light" aria-label="Next photo">&#8250;</button>';

  lightboxEl.addEventListener("click", function (event) {
    if (event.target.closest(".lightbox-close") || event.target === lightboxEl) {
      closeLightbox();
    } else if (event.target.closest(".lightbox-prev")) {
      changePhoto(-1);
    } else if (event.target.closest(".lightbox-next")) {
      changePhoto(1);
    }
  });

  document.body.appendChild(lightboxEl);
  document.body.classList.add("no-scroll");
  showLightboxPhoto();
  lightboxEl.querySelector(".lightbox-close").focus();
}

function closeLightbox() {
  if (!lightboxEl) {
    return;
  }
  lightboxEl.remove(); 
  lightboxEl = null;
  document.body.classList.remove("no-scroll");
  if (lastFocused) {
    lastFocused.focus();
  }
}

function changePhoto(step) {
  currentIndex = wrapIndex(currentIndex + step, visibleItems.length);
  showLightboxPhoto();
}


document.addEventListener("DOMContentLoaded", function () {
  renderFilterButtons();
  visibleItems = galleryItems;
  renderGallery(visibleItems);
  setActiveFilter("All");

  filterBar.addEventListener("click", function (event) {
    const button = event.target.closest(".filter-btn");
    if (!button) {
      return;
    }
    visibleItems = filterGallery(galleryItems, button.dataset.category);
    renderGallery(visibleItems);
    setActiveFilter(button.dataset.category);
  });

  galleryGrid.addEventListener("click", function (event) {
    const button = event.target.closest(".gallery-btn");
    if (button) {
      openLightbox(Number(button.dataset.index));
    }
  });

  document.addEventListener("keydown", function (event) {
    if (!lightboxEl) {
      return;
    }
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      changePhoto(-1);
    } else if (event.key === "ArrowRight") {
      changePhoto(1);
    }
  });
});
