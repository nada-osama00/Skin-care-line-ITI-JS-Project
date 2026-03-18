var currentPage = 1;
const productsPerPage = 12;
var displayMode = 'grid-view';

function renderPage() {
    document.getElementById("count-number").innerText = filteredProducts.length;
    var container = document.getElementById("product-container");
    container.innerHTML = "";
    var start = (currentPage - 1) * productsPerPage;
    var end = start + productsPerPage;
    var currentProducts = filteredProducts.slice(start, end);
    container.className = displayMode === 'grid-view' ? "product-grid" : "product-list";
    for(var product of currentProducts)
    {
        var card = createProductCard(product);
        container.append(card);
    }
    setupPagination();
}
   
function createProductCard(product) {
    var activeVariant = product.matchedVariant || (product.variants && product.variants.length > 0 ? product.variants[0] : null);

    var a = document.createElement("a");
    var image = document.createElement("img");
    var h4 = document.createElement("h4");
    a.classList.add('product-card');
    a.href = "./details.html?id=" + product.id;

    var imgWrapper = document.createElement("div");
    imgWrapper.classList.add('product-image-wrapper');
    image.src = product.thumbnail;

    var hoverImg = document.createElement("img");
    if (product.images && product.images.length > 0) {
        hoverImg.src = product.images[1];
    } else {
        hoverImg.src = product.thumbnail;
    }
    hoverImg.classList.add("hover-img");

    var desc = document.createElement("p");
    desc.classList.add("product-description");
    desc.innerHTML = `<strong>For:</strong> ${product.for}<br>${product.description}`;

    var quickActions = document.createElement("div");
    quickActions.classList.add("quick-actions");
    quickActions.innerHTML = `
        <button class="add-to-cart" title="Add to Cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M27 5.25h-22c-0.966 0.001-1.749 0.784-1.75 1.75v18c0.001 0.966 0.784 1.749 1.75 1.75h22c0.966-0.001 1.749-0.784 1.75-1.75v-18c-0.001-0.966-0.784-1.749-1.75-1.75h-0zM5 6.75h22c0.138 0 0.25 0.112 0.25 0.25v2.25h-22.5v-2.25c0-0.138 0.112-0.25 0.25-0.25h0zM27 25.25h-22c-0.138-0-0.25-0.112-0.25-0.25v-14.25h22.5v14.25c-0 0.138-0.112 0.25-0.25 0.25h-0zM21.75 14c0 3.176-2.574 5.75-5.75 5.75s-5.75-2.574-5.75-5.75v0c0-0.414 0.336-0.75 0.75-0.75s0.75 0.336 0.75 0.75v0c0 2.347 1.903 4.25 4.25 4.25s4.25-1.903 4.25-4.25v0c0-0.414 0.336-0.75 0.75-0.75s0.75 0.336 0.75 0.75v0z"></path></svg>
        </button>
        <button class="quick-view" title="Quick View"><i class="far fa-eye"></i></button>
        <button class="add-to-wishlist" title="Add to Wishlist"><i class="far fa-heart"></i></button>`;

    var cartBtn = quickActions.querySelector(".add-to-cart");
    var viewBtn = quickActions.querySelector(".quick-view");
    var wishBtn = quickActions.querySelector(".add-to-wishlist");

    var wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.some(item => item.id === product.id)) {
        wishBtn.classList.add("active");
    }

    cartBtn.onclick = function(e) {
        e.preventDefault();
        const selectedSize = activeVariant ? activeVariant.size : "Default";
        addToCart(product, selectedSize, 1);
    };

    viewBtn.onclick = function(e) {
        e.preventDefault();
        openQuickView(product);
    };

    wishBtn.onclick = function(e) {
        e.preventDefault();
        var result = addToWishlist(product);
        result ? this.classList.add("active") : this.classList.remove("active");
    };

    imgWrapper.append(image, hoverImg);

    var h4 = document.createElement("h4");
    h4.classList.add("product-title");
    h4.innerText = product.name;

    var priceContainer = document.createElement("div");
    priceContainer.classList.add("price-container");
    var price = document.createElement("span");
    price.classList.add("product-price");

    if (activeVariant) {
        price.innerText = "$" + activeVariant.price + ".00";

        if (product.issale && activeVariant.oldprice) {
            var discountPercent = Math.round(((activeVariant.oldprice - activeVariant.price) / activeVariant.oldprice) * 100);
            
            var oldPrice = document.createElement("span");
            oldPrice.classList.add("old-price");
            oldPrice.innerText = "$" + activeVariant.oldprice + ".00";

            var discountBadge = document.createElement("span");
            discountBadge.classList.add("discount-percent");
            discountBadge.innerText = `${discountPercent}% OFF`;

            var saleBadge = document.createElement("span");
            saleBadge.classList.add("badge", "sale-badge");
            saleBadge.innerText = "Sale";
            imgWrapper.appendChild(saleBadge);

            priceContainer.append(price, oldPrice, discountBadge);
        } else {
            priceContainer.append(price);
        }
    }

    if (product.isnew) {
        var newBadge = document.createElement("span");
        newBadge.classList.add("badge", "new-badge");
        newBadge.innerText = "New";
        imgWrapper.appendChild(newBadge);
    }

    var infoContainer = document.createElement("div");
    infoContainer.classList.add("product-info");
    
    if (activeVariant) {
        var sizeInfo = document.createElement("span");
        sizeInfo.classList.add("selected-size-label");
        sizeInfo.innerText = "Size: " + activeVariant.size;
        infoContainer.append(sizeInfo);
    }

    if (displayMode === 'grid-view') {
        imgWrapper.append(quickActions);
        infoContainer.prepend(h4);
        infoContainer.append(priceContainer);
    } else {
        infoContainer.append(h4, desc, priceContainer, quickActions);
    }

    a.append(imgWrapper, infoContainer);
    return a;
}
 function setupPagination() {
    var wrapper = document.getElementById("pagination-wrapper");
    if (!wrapper) return;
    wrapper.innerHTML = "";

    var pageCount = Math.ceil(filteredProducts.length / productsPerPage);

    if (pageCount <= 1) return;

    for (let i = 1; i <= pageCount; i++) {
        var btn = document.createElement("button");
        btn.innerText = i;
        btn.className = (i === currentPage) ? "page-btn active" : "page-btn";
        btn.onclick = function() {
            currentPage = i;
            renderPage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        wrapper.append(btn);
    }

    if (currentPage < pageCount) {
        var nextBtn = document.createElement("button");
        nextBtn.innerHTML = '<i class="fa-solid fa-angles-right"></i>';
        nextBtn.className = "page-btn next-btn";
        nextBtn.onclick = function() {
            currentPage++;
            renderPage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        wrapper.append(nextBtn);
    }
}
document.querySelector(".sort-select").addEventListener("change", function () {
    const sortValue = this.value;
    if (sortValue === "Alphabetically, A-Z") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "Price, Low to High") {
        filteredProducts.sort((a, b) => {
            let priceA = a.variants[0] ? a.variants[0].price : 0;
            let priceB = b.variants[0] ? b.variants[0].price : 0;
            return priceA - priceB;
        });
    }
    currentPage = 1; 
    renderPage();
});
var gridmode=document.getElementById("grid-view")
gridmode.addEventListener("click", function() {
    toggleView('grid');
    this.classList.add("active");
    document.getElementById("List-View").classList.remove("active");
});
var listmode=document.getElementById("List-View")
listmode.addEventListener("click", function() {
    toggleView('list');
    this.classList.add("active");
    document.getElementById("grid-view").classList.remove("active");
});
function toggleView(mode) {
    displayMode = mode === 'grid' ? 'grid-view' : 'list-view';
    renderPage();
}