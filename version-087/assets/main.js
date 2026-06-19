(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var siteNav = document.querySelector('[data-site-nav]');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      siteNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    show(0);
    start();
  }

  var searchInput = document.querySelector('.site-search');
  var typeSelect = document.querySelector('.filter-select');
  var sortSelect = document.querySelector('.sort-select');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var empty = document.querySelector('[data-empty]');

  function getYear(card) {
    var value = card.getAttribute('data-year') || '';
    var match = value.match(/(19|20)\d{2}/);
    return match ? Number(match[0]) : 0;
  }

  function applySearch() {
    if (!cards.length) {
      return;
    }

    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var type = typeSelect ? typeSelect.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = card.getAttribute('data-search') || '';
      var cardType = card.getAttribute('data-type') || '';
      var ok = (!query || haystack.indexOf(query) !== -1) && (!type || cardType.indexOf(type) !== -1);
      card.style.display = ok ? '' : 'none';
      if (ok) {
        visible += 1;
      }
    });

    if (empty) {
      empty.style.display = visible ? 'none' : 'block';
    }
  }

  function applySort() {
    if (!sortSelect || !cards.length) {
      return;
    }

    var grid = cards[0].parentNode;
    var sorted = cards.slice();
    var mode = sortSelect.value;

    if (mode === 'year-desc') {
      sorted.sort(function (a, b) {
        return getYear(b) - getYear(a);
      });
    }

    if (mode === 'year-asc') {
      sorted.sort(function (a, b) {
        return getYear(a) - getYear(b);
      });
    }

    sorted.forEach(function (card) {
      grid.appendChild(card);
    });

    applySearch();
  }

  if (searchInput && searchInput.getAttribute('data-search-link')) {
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && searchInput.value.trim()) {
        window.location.href = searchInput.getAttribute('data-search-link') + '?q=' + encodeURIComponent(searchInput.value.trim());
      }
    });
  }

  if (searchInput && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (q) {
      searchInput.value = q;
    }

    searchInput.addEventListener('input', applySearch);
  }

  if (typeSelect && cards.length) {
    typeSelect.addEventListener('change', applySearch);
  }

  if (sortSelect && cards.length) {
    sortSelect.addEventListener('change', applySort);
  }

  applySearch();
})();
