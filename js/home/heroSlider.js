var homeFilterProductsData;
var currentProduct = null;

    var heroSlides = document.querySelectorAll(".slide");
    var heroDots = document.querySelectorAll(".dot");
    var heroCurrentIndex = 0;
    var autoSliderInterval;

    function showSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove("active"));
        heroDots.forEach(dot => dot.classList.remove("active"));

        heroSlides[index].classList.add("active");
        heroDots[index].classList.add("active");
    }

    heroDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            heroCurrentIndex = index;
            showSlide(heroCurrentIndex);
        });
    });

    function startAutoSlider() {
        autoSliderInterval = setInterval(() => {
            heroCurrentIndex++;
            if (heroCurrentIndex >= heroSlides.length) heroCurrentIndex = 0;
            showSlide(heroCurrentIndex);
        }, 5000);
    }

    function stopAutoSlider() {
        clearInterval(autoSliderInterval);
    }

    showSlide(heroCurrentIndex);
    startAutoSlider();
