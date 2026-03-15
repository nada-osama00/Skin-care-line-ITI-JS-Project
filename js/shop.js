var currentPage = 1;
const productsPerPage = 12;
var allProducts = [];
var displayMode = 'grid-view';
var xhr = new XMLHttpRequest()
xhr.open('GET', 'https://69b40edfe224ec066bddf1d0.mockapi.io/Scincareobjects/products')
xhr.responseType = "json"
xhr.send()
xhr.onload = function () {
    allProducts = xhr.response
    renderPage();
}
function renderPage() {
    document.getElementById("count-number").innerText = allProducts.length;
    var container = document.getElementById("product-container");
    container.innerHTML = "";
    var start = (currentPage - 1) * productsPerPage;
    var end = start + productsPerPage;
    var currentProducts = allProducts.slice(start, end);
    container.className = displayMode === 'grid-view' ? "product-grid" : "product-list";
    for (var product of currentProducts) {
        var card = createProductCard(product);
        container.append(card);
    }
    setupPagination();
}

function createProductCard(product) {
    var a = document.createElement("a")
    var image = document.createElement("img")
    var h4 = document.createElement("h4")
    a.classList.add('product-card')
    a.href = "./details.html?id=" + product.id

    var imgWrapper = document.createElement("div");
    imgWrapper.classList.add('product-image-wrapper');
    image.src = product.thumbnail

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
    <button class="add-to-cart" title="Add to Cart"><i class="fa-solid fa-cart-arrow-down"></i></button>
    <button class="quick-view" title="Quick View"><i class="far fa-eye"></i></button>
    <button class="add-to-wishlist" title="Add to Wishlist"><i class="far fa-heart"></i></button>`;

    var cartBtn = quickActions.querySelector(".add-to-cart");
    var viewBtn = quickActions.querySelector(".quick-view");
    var wishBtn = quickActions.querySelector(".add-to-wishlist");

    var wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.some(item => item.id === product.id)) {
        wishBtn.classList.add("active");
    }

    cartBtn.onclick = function (e) {
        e.preventDefault();
        addToCart(product);
    };

    viewBtn.onclick = function (e) {
        e.preventDefault();
        openQuickView(product);
    };
    
    wishBtn.onclick = function (e) {
        e.preventDefault();
        var result = addToWishlist(product);
        if (result) {
            this.classList.add("active");
        } else {
            this.classList.remove("active");
        }
    };

    imgWrapper.append(image, hoverImg);
    var h4 = document.createElement("h4");
    h4.classList.add("product-title");
    h4.innerText = product.name;

    var priceContainer = document.createElement("div");
    priceContainer.classList.add("price-container");
    var price = document.createElement("span");
    price.classList.add("product-price");

    if (product.variants && product.variants.length > 0) {
        var firstVariant = product.variants[0];
        price.innerText = "$" + firstVariant.price + ".00";

        if (product.issale && firstVariant.oldprice) {

            var discountPercent = Math.round(((firstVariant.oldprice - firstVariant.price) / firstVariant.oldprice) * 100);

            var oldPrice = document.createElement("span");
            oldPrice.classList.add("old-price");
            oldPrice.innerText = "$" + firstVariant.oldprice + ".00";

            var discountBadge = document.createElement("span");
            discountBadge.classList.add("discount-percent");
            discountBadge.innerText = `${discountPercent}% OFF`;

            var saleBadge = document.createElement("span");
            saleBadge.classList.add("badge", "sale-badge");
            saleBadge.innerText = "Sale";
            imgWrapper.appendChild(saleBadge);
            priceContainer.append(price, oldPrice, discountBadge);
        }
        else {
            priceContainer.append(price);
        }
    } else {
        price.innerText = "";
    }


    if (product.isnew) {
        var newBadge = document.createElement("span");
        newBadge.classList.add("badge", "new-badge");
        newBadge.innerText = "New";
        imgWrapper.appendChild(newBadge);
    }
    var infoContainer = document.createElement("div");
    infoContainer.classList.add("product-info");
    if (displayMode === 'grid-view') {
        imgWrapper.append(quickActions);
        infoContainer.append(h4, priceContainer);
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
    var pageCount = Math.ceil(allProducts.length / productsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        var btn = document.createElement("button");
        btn.innerText = i;
        btn.className = (i === currentPage) ? "page-btn active" : "page-btn";
        btn.onclick = function () {
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
        nextBtn.onclick = function () {
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
        allProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "Price, Low to High") {
        allProducts.sort((a, b) => {
            let priceA = a.variants[0] ? a.variants[0].price : 0;
            let priceB = b.variants[0] ? b.variants[0].price : 0;
            return priceA - priceB;
        });
    }
    currentPage = 1;
    renderPage();
});
var gridmode = document.getElementById("grid-view")
gridmode.addEventListener("click", function () {
    toggleView('grid');
    this.classList.add("active");
    document.getElementById("List-View").classList.remove("active");
});
var listmode = document.getElementById("List-View")
listmode.addEventListener("click", function () {
    toggleView('list');
    this.classList.add("active");
    document.getElementById("grid-view").classList.remove("active");
});
function toggleView(mode) {
    displayMode = mode === 'grid' ? 'grid-view' : 'list-view';
    renderPage();
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let exists = cart.find(item => item.id === product.id);
    if (exists) {
        exists.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}
function openQuickView(product) {
    let modal = document.getElementById("quickview-modal");
    if (!modal) {
        modal = document.createElement("dialog");
        modal.id = "quickview-modal";
        document.body.appendChild(modal);
    }

    var sizesHTML = '';
    if (product.variants && product.variants.length > 0) {
        sizesHTML = `
            <div class="modal-sizes">
                <p>SIZE:</p>
                <div class="size-options">
                    ${product.variants.map((variant, index) => `
                        <input type="radio" name="product-size" id="size-${index}" value="${variant.size}" ${index === 0 ? 'checked' : ''}>
                        <label for="size-${index}">${variant.size}</label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderPrice(variant) {
        let html = `<span class="modal-price">$${variant.price}.00</span>`;
        if (product.issale && variant.oldprice) {
            let discount = Math.round(((variant.oldprice - variant.price) / variant.oldprice) * 100);
            html = `
                <div class="price-container">
                    <span class="modal-price">$${variant.price}.00</span>
                    <span class="old-price" style="text-decoration: line-through; color: #999; margin-left: 10px;">$${variant.oldprice}.00</span>
                    <span class="discount-percent" style="color: #008a00; font-weight: bold; margin-left: 10px;">${discount}% OFF</span>
                </div>
            `;
        }
        return html;
    }

    modal.innerHTML = `
        <div class="modal-wrapper">
            <button onclick="this.closest('dialog').close()" class="close-btn">&times;</button>
            <div class="modal-content">
            <div class="modal-left">
                <div class="modal-image">
                    <img src="${product.thumbnail}" alt="${product.name}">
                </div>
          </div>
          <div class="modal-right">
                <div class="modal-info">
                    <div class="price-wrapper">
                        ${renderPrice(product.variants[0])}
                    </div>
                    <h2 class="modal-title">${product.name}</h2>
                    <p class="modal-desc">${product.description}</p>
                    <a href="./details.html?id=${product.id}" class="view-details">View details</a>
                    <div class="modal-options">${sizesHTML}</div>
                    <div class="modal-actions">
                        <div class="quantity-selector">
                            <button type="button" class="minus">-</button>
                            <input type="number" value="1" min="1">
                            <button type="button" class="plus">+</button>
                        </div>
                        <button class="add-to-cart" title="Add to Cart"><i class="fa-solid fa-cart-arrow-down"></i></button>
                        <button class="add-to-wishlist" title="Add to Wishlist"><i class="far fa-heart"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.showModal();

    const priceWrapper = modal.querySelector('.price-wrapper');
    const sizeRadios = modal.querySelectorAll('input[name="product-size"]');

    sizeRadios.forEach((radio, index) => {
        radio.addEventListener('change', function () {
            if (this.checked) {
                const selectedVariant = product.variants[index];
                priceWrapper.innerHTML = renderPrice(selectedVariant);
            }
        });
    });
    const qtyInput = modal.querySelector('input[type="number"]');
    modal.querySelector('.plus').onclick = () => qtyInput.value = parseInt(qtyInput.value) + 1;
    modal.querySelector('.minus').onclick = () => {
        if (qtyInput.value > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    };

    modal.querySelector('.add-to-cart').onclick = () => {
        addToCart(product);
        alert("Added to cart!");
    };

    var modalWishBtn = modal.querySelector('.add-to-wishlist');

    var currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (currentWishlist.some(item => item.id === product.id)) {
        modalWishBtn.classList.add("active");
    }

    modalWishBtn.onclick = function () {
        let result = addToWishlist(product);
        if (result) {
            this.classList.add("active");
        } else {
            this.classList.remove("active");
        }
        renderPage();
    };
}
function addToWishlist(product) {
    var wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    var existsIndex = wishlist.findIndex(item => item.id === product.id);

    if (existsIndex === -1) {
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        return true;
    } else {
        wishlist.splice(existsIndex, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        return false;
    }

}