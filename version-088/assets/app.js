(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!button || !panel) return;
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector(".hero");
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector(".hero-prev");
    var next = hero.querySelector(".hero-next");
    if (!slides.length) return;
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function restart() {
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }

    restart();
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupCatalog() {
    var sections = Array.prototype.slice.call(document.querySelectorAll(".catalog-section"));
    sections.forEach(function (section) {
      var input = section.querySelector(".filter-input");
      var typeSelect = section.querySelector(".type-select");
      var sortSelect = section.querySelector(".sort-select");
      var grid = section.querySelector(".movie-grid");
      var empty = section.querySelector(".empty-state");
      if (!grid) return;
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";

      if (input && query) {
        input.value = query;
      }

      function cardText(card) {
        return normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.tags
        ].join(" "));
      }

      function apply() {
        var keyword = normalize(input ? input.value : "");
        var typeValue = normalize(typeSelect ? typeSelect.value : "");
        var visible = [];

        cards.forEach(function (card) {
          var matchKeyword = !keyword || cardText(card).indexOf(keyword) !== -1;
          var matchType = !typeValue || normalize(card.dataset.type + " " + card.dataset.genre).indexOf(typeValue) !== -1;
          var matched = matchKeyword && matchType;
          card.style.display = matched ? "" : "none";
          if (matched) visible.push(card);
        });

        if (sortSelect) {
          var mode = sortSelect.value;
          visible.sort(function (a, b) {
            if (mode === "score") return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
            if (mode === "year") return Number((b.dataset.year || "").match(/\d{4}/) || 0) - Number((a.dataset.year || "").match(/\d{4}/) || 0);
            if (mode === "title") return String(a.dataset.title || "").localeCompare(String(b.dataset.title || ""), "zh-Hans-CN");
            return cards.indexOf(a) - cards.indexOf(b);
          });
          visible.forEach(function (card) {
            grid.appendChild(card);
          });
        }

        if (empty) {
          empty.classList.toggle("is-visible", visible.length === 0);
        }
      }

      if (input) input.addEventListener("input", apply);
      if (typeSelect) typeSelect.addEventListener("change", apply);
      if (sortSelect) sortSelect.addEventListener("change", apply);
      apply();
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupCatalog();
  });
})();
