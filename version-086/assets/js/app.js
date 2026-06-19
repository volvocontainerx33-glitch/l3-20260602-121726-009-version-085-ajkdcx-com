(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        setupMobileMenu();
        setupHeroCarousel();
        setupLocalSearch();
        setupCategoryFilters();
        setupImageFallbacks();
        setupYearSort();
        applyQuerySearch();
    });

    function setupMobileMenu() {
        var button = document.querySelector("[data-mobile-menu-button]");
        var nav = document.querySelector("[data-main-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHeroCarousel() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var activeIndex = 0;
        var timer = null;

        function show(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === activeIndex);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(activeIndex + 1);
            }, 5000);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(activeIndex - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(activeIndex + 1);
                restart();
            });
        }
        restart();
    }

    function setupLocalSearch() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-site-search]"));
        if (!inputs.length) {
            return;
        }
        inputs.forEach(function (input) {
            input.addEventListener("input", function () {
                filterCards(input.value);
            });
        });
    }

    function applyQuerySearch() {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (!query) {
            return;
        }
        var input = document.querySelector("[data-site-search]");
        if (input) {
            input.value = query;
        }
        filterCards(query);
    }

    function filterCards(query) {
        var value = String(query || "").trim().toLowerCase();
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        cards.forEach(function (card) {
            var text = String(card.getAttribute("data-search") || card.textContent || "").toLowerCase();
            card.classList.toggle("is-filtered-out", value && text.indexOf(value) === -1);
        });
    }

    function setupCategoryFilters() {
        var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-category-filter]"));
        if (!buttons.length) {
            return;
        }
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                var category = button.getAttribute("data-category-filter");
                var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
                cards.forEach(function (card) {
                    var cardCategory = card.getAttribute("data-category");
                    var shouldHide = category !== "all" && cardCategory !== category;
                    card.classList.toggle("is-filtered-out", shouldHide);
                });
            });
        });
    }

    function setupImageFallbacks() {
        var images = Array.prototype.slice.call(document.querySelectorAll("img"));
        images.forEach(function (image) {
            image.addEventListener("error", function () {
                var parent = image.closest(".poster-link, .category-card, .category-cover, .detail-poster, .hero-slide, .rank-poster");
                if (parent) {
                    parent.classList.add("image-missing");
                }
                image.style.opacity = "0";
            }, { once: true });
        });
    }

    function setupYearSort() {
        var button = document.querySelector("[data-sort-year]");
        if (!button) {
            return;
        }
        button.addEventListener("click", function () {
            var grid = document.querySelector(".movie-grid");
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
            cards.sort(function (a, b) {
                var ay = Number(a.getAttribute("data-year")) || 0;
                var by = Number(b.getAttribute("data-year")) || 0;
                return by - ay;
            });
            cards.forEach(function (card) {
                grid.appendChild(card);
            });
        });
    }
})();
