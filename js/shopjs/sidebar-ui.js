document.addEventListener("DOMContentLoaded", function() {
    var openBtn = document.querySelector(".filter-btn");
    var sidebar = document.getElementById("filter-sidebar");
    var overlay = document.getElementById("filter-overlay");
    var closeBtn = document.getElementById("close-sidebar");


    function closeFilter() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        document.body.classList.remove("no-scroll");
        document.body.classList.remove("filter-open");
    }
    if(openBtn) {
        openBtn.addEventListener("click", function () {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("no-scroll");
    document.body.classList.add("filter-open");
});
    }

    if(closeBtn) {
closeBtn.addEventListener("click", closeFilter);  
}

if(overlay) {
   overlay.addEventListener("click", closeFilter);
    }
});

var sliderOne = document.getElementById("slider-1");
var sliderTwo = document.getElementById("slider-2");
var displayValOne = document.getElementById("range1");
var displayValTwo = document.getElementById("range2");
var minGap = 10;

function slideOne() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderOne.value = parseInt(sliderTwo.value) - minGap;
    }
    displayValOne.textContent = sliderOne.value + "$";
}

function slideTwo() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderTwo.value = parseInt(sliderOne.value) + minGap;
    }
    displayValTwo.textContent = sliderTwo.value + "$";
}

const sizeRanges = {
    "50":  { min: 0,   max: 69 },   //small
    "100": { min: 70,  max: 150 },  //madium
    "200": { min: 151, max: 1000 }  // large
};
document.getElementById("apply-filters").onclick = function() {
    const minPrice = parseInt(sliderOne.value);
    const maxPrice = parseInt(sliderTwo.value);
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(cb => cb.value);
    const inStockOnly = document.getElementById("instock-filter").checked;
    const isNewOnly = document.getElementById("isnew-filter").checked;
    const isSaleOnly = document.getElementById("issale-filter").checked;

    filteredProducts = allProducts.map(product => {
        const categoryMatch = selectedCategories.length === 0 || 
                             selectedCategories.some(cat => cat.toLowerCase() === product.category.toLowerCase());
        const newMatch = !isNewOnly || product.isnew;
        const saleMatch = !isSaleOnly || product.issale;

        if (!categoryMatch || !newMatch || !saleMatch) return null;

        const matchingVariant = product.variants.find(v => {
            const p = v.price;
            const numericSize = parseInt(v.size);
            
            const priceMatch = p >= minPrice && p <= maxPrice;
            const stockMatch = !inStockOnly || v.stock > 0;
            const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(sizeKey => {
                const range = sizeRanges[sizeKey];
                return numericSize >= range.min && numericSize <= range.max;
            });

            return priceMatch && sizeMatch && stockMatch;
        });

        return matchingVariant ? { ...product, matchedVariant: matchingVariant } : null;

    }).filter(p => p !== null);
    currentPage = 1;
    renderPage();
    
    document.getElementById("filter-sidebar").classList.remove("active");
    document.getElementById("filter-overlay").classList.remove("active");
    document.body.classList.remove("no-scroll");
};
document.getElementById("clear-filters").onclick = function() {
    document.querySelectorAll('.sidebar-content input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    sliderOne.value = 0;
    sliderTwo.value = 110;
    slideOne();
    slideTwo();
    filteredProducts = allProducts.map(product => {
        const newProduct = { ...product };
        delete newProduct.matchedVariant; 
        return newProduct;
    });

    currentPage = 1;
    renderPage();
};