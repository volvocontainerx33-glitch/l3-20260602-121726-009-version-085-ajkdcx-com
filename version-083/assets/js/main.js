document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    var thumbs = Array.from(hero.querySelectorAll('[data-hero-thumb]'));
    var title = hero.querySelector('[data-hero-title]');
    var desc = hero.querySelector('[data-hero-desc]');
    var meta = hero.querySelector('[data-hero-meta]');
    var link = hero.querySelector('[data-hero-link]');
    var image = hero.querySelector('[data-hero-image]');
    var activeIndex = 0;

    function setHero(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;
      var slide = slides[activeIndex];
      var imageUrl = slide.dataset.image;

      hero.style.setProperty('--hero-image', 'url("' + imageUrl + '")');
      if (title) {
        title.textContent = slide.dataset.title;
      }
      if (desc) {
        desc.textContent = slide.dataset.desc;
      }
      if (meta) {
        meta.textContent = slide.dataset.meta;
      }
      if (link) {
        link.href = slide.dataset.href;
      }
      if (image) {
        image.src = imageUrl;
        image.alt = slide.dataset.title;
      }

      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle('is-active', thumbIndex === activeIndex);
      });
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('click', function () {
        setHero(index);
      });
    });

    setHero(0);
    window.setInterval(function () {
      setHero(activeIndex + 1);
    }, 5200);
  }

  var heroSearch = document.querySelector('[data-hero-search]');
  if (heroSearch) {
    heroSearch.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = heroSearch.querySelector('input');
      var query = input ? input.value.trim() : '';
      window.location.href = 'search.html?q=' + encodeURIComponent(query);
    });
  }

  var filterForm = document.querySelector('[data-filter-form]');
  if (filterForm) {
    var cards = Array.from(document.querySelectorAll('[data-title]'));
    var empty = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var qInput = filterForm.querySelector('[name="q"]');

    if (qInput && q) {
      qInput.value = q;
    }

    function normalize(value) {
      return (value || '').toString().trim().toLowerCase();
    }

    function applyFilter() {
      var keyword = normalize((filterForm.querySelector('[name="q"]') || {}).value);
      var year = normalize((filterForm.querySelector('[name="year"]') || {}).value);
      var region = normalize((filterForm.querySelector('[name="region"]') || {}).value);
      var type = normalize((filterForm.querySelector('[name="type"]') || {}).value);
      var visibleCount = 0;

      cards.forEach(function (card) {
        var text = normalize(card.textContent + ' ' + card.dataset.title + ' ' + card.dataset.genre + ' ' + card.dataset.region + ' ' + card.dataset.type);
        var ok = true;

        if (keyword && text.indexOf(keyword) === -1) {
          ok = false;
        }
        if (year && normalize(card.dataset.year) !== year) {
          ok = false;
        }
        if (region && normalize(card.dataset.region).indexOf(region) === -1) {
          ok = false;
        }
        if (type && normalize(card.dataset.type).indexOf(type) === -1) {
          ok = false;
        }

        card.style.display = ok ? '' : 'none';
        if (ok) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.style.display = visibleCount ? 'none' : 'block';
      }
    }

    filterForm.addEventListener('input', applyFilter);
    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter();
    });
    applyFilter();
  }
});
