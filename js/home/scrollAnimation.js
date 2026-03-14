    var sectionShow = document.querySelectorAll(".sectionShow");

    var observerSectionShow = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observerSectionShow.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sectionShow.forEach(section => {
        observerSectionShow.observe(section);
    });