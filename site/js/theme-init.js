(function () {
  try {
    var saved = JSON.parse(localStorage.getItem("theme"));
    if (saved === "dark" || saved === "light") {
      document.documentElement.setAttribute("data-bs-theme", saved);
    }
  } catch (error) {
  }
})();
