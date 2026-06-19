document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var nav = document.querySelector("[data-nav]");

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  var filterInput = document.querySelector("[data-card-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-text]"));

  function normalizeText(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyFilter(value) {
    var keyword = normalizeText(value);

    cards.forEach(function (card) {
      var source = normalizeText(card.getAttribute("data-search-text"));
      card.classList.toggle("hidden", Boolean(keyword) && source.indexOf(keyword) === -1);
    });
  }

  if (filterInput && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    if (query) {
      filterInput.value = query;
      applyFilter(query);
    }

    filterInput.addEventListener("input", function () {
      applyFilter(filterInput.value);
    });
  }

  var images = Array.prototype.slice.call(document.querySelectorAll("img"));

  images.forEach(function (image) {
    image.addEventListener("error", function () {
      image.style.opacity = "0";
    }, { once: true });
  });
});
