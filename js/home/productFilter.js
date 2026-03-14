    var homeFilterButtons = document.querySelectorAll(".filter-btn");

    homeFilterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            homeFilterButtons.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");

            var selectedFilterType = this.dataset.filter;

            if (selectedFilterType === "sale") {
                var homeSaleProducts = homeFilterProductsData.filter(
                    (product) => product.issale === true
                );
                renderHomeFilterProducts(homeSaleProducts);
            } else if (selectedFilterType === "new") {
                var homeNewProducts = homeFilterProductsData.filter(
                    (product) => product.isnew === true
                );
                renderHomeFilterProducts(homeNewProducts);
            } else {
                renderHomeFilterProducts(homeFilterProductsData);
            }
        });
    });
