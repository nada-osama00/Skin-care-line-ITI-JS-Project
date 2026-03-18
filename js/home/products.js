var homeFilterProductsRequest = new XMLHttpRequest();
homeFilterProductsRequest.open(
    "GET",
    "https://69b40edfe224ec066bddf1d0.mockapi.io/Scincareobjects/products"
);
homeFilterProductsRequest.responseType = "json";
homeFilterProductsRequest.send();

var homeFilterProductsContainer = document.querySelector(".product-container");

homeFilterProductsRequest.onload = function () {
    homeFilterProductsData = homeFilterProductsRequest.response;
    renderHomeFilterProducts(homeFilterProductsData);
};

function renderHomeFilterProducts(productsList) {
    homeFilterProductsContainer.innerHTML = "";

    for (var productItem of productsList) {
        homeFilterProductsContainer.innerHTML += `
    
    <div class="product" data-id="${productItem.id}">
    
        <div class="img-container">
        
            <img class="main-img" src="${productItem.thumbnail}">
            <img class="hover-img" src="${productItem.images[1] ? productItem.images[1] : productItem.images[0]}">

            ${productItem.issale ? `<span class="badge sale">Sale</span>` : ""}
            ${productItem.isnew ? `<span class="badge new">New</span>` : ""}

            <div class="product-actions">

           <button class="addcart-btn" onclick='addToCart(${JSON.stringify(productItem)})'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
		        <path d="M27 5.25h-22c-0.966 0.001-1.749 0.784-1.75 1.75v18c0.001 0.966 0.784 1.749 1.75 1.75h22c0.966-0.001 1.749-0.784 1.75-1.75v-18c-0.001-0.966-0.784-1.749-1.75-1.75h-0zM5 6.75h22c0.138 0 0.25 0.112 0.25 0.25v2.25h-22.5v-2.25c0-0.138 0.112-0.25 0.25-0.25h0zM27 25.25h-22c-0.138-0-0.25-0.112-0.25-0.25v-14.25h22.5v14.25c-0 0.138-0.112 0.25-0.25 0.25h-0zM21.75 14c0 3.176-2.574 5.75-5.75 5.75s-5.75-2.574-5.75-5.75v0c0-0.414 0.336-0.75 0.75-0.75s0.75 0.336 0.75 0.75v0c0 2.347 1.903 4.25 4.25 4.25s4.25-1.903 4.25-4.25v0c0-0.414 0.336-0.75 0.75-0.75s0.75 0.336 0.75 0.75v0z"></path>
                </svg>
                </button>

                <button class="preview-btn" onclick="previewProduct('${productItem.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" cursorshover="true">
                <path d="M30.685 15.695c-0.043-0.097-1.083-2.404-3.405-4.726-2.153-2.153-5.858-4.72-11.28-4.72s-9.127 2.567-11.28 4.72c-2.322 2.322-3.362 4.629-3.405 4.726-0.041 0.090-0.065 0.194-0.065 0.304s0.024 0.215 0.067 0.309l-0.002-0.005c0.043 0.097 1.083 2.404 3.405 4.725 2.153 2.153 5.858 4.719 11.28 4.719s9.127-2.566 11.28-4.719c2.322-2.322 3.362-4.628 3.405-4.725 0.041-0.090 0.065-0.194 0.065-0.305s-0.024-0.215-0.067-0.309l0.002 0.005zM16 24.249c-3.922 0-7.348-1.427-10.181-4.241-1.16-1.152-2.152-2.472-2.939-3.919l-0.044-0.089c0.83-1.536 1.823-2.856 2.982-4.008l0.001-0.001c2.833-2.815 6.259-4.242 10.181-4.242s7.348 1.427 10.181 4.242c1.16 1.153 2.152 2.472 2.939 3.92l0.044 0.089c-0.796 1.525-4.784 8.249-13.164 8.249zM16 10.25c-3.176 0-5.75 2.574-5.75 5.75s2.574 5.75 5.75 5.75c3.176 0 5.75-2.574 5.75-5.75v0c-0.004-3.174-2.576-5.746-5.75-5.75h-0zM16 20.25c-2.347 0-4.25-1.903-4.25-4.25s1.903-4.25 4.25-4.25c2.347 0 4.25 1.903 4.25 4.25v0c-0.003 2.346-1.904 4.247-4.25 4.25h-0z"></path>
                </svg>
                </button>

                <button class="wishlist-btn" onclick="toggleWishlist(this,'${productItem.id}')">
                <i class="far fa-heart"></i>
                </button>

            </div>

        </div>

        <p class="price">
        $${productItem.variants[0].price}

        ${productItem.variants[0].oldprice > productItem.variants[0].price
                ? `<span class="old">$${productItem.variants[0].oldprice}</span>`
                : ""
            }
        </p>

        <a href="../../pages/details.html?id=${productItem.id}" class="product-title">
        ${productItem.name}
        </a>

    </div>
    
    `;
    }

}


function addToCart(product, size, quantity) {
    const finalSize = size || product.variants[0].size;
    const finalQuantity = parseInt(quantity) || 1;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartItemId = `${product.id}-${finalSize}`;
    let exists = cart.find(item => item.cartItemId === cartItemId);

    if (exists) {
        exists.qty = (parseInt(exists.qty) || 0) + finalQuantity;
    } else {
        const variant = product.variants.find(v => v.size === finalSize) || product.variants[0];
        cart.push({
            id: product.id,
            name: product.name,
            thumbnail: product.thumbnail,
            cartItemId: cartItemId,
            variant: finalSize,
            price: variant.price,
            qty: finalQuantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    refreshCartItemCount();
    showCartModal(`Added ${finalQuantity} units of ${product.name} (${finalSize}) to cart!`);
}

function showCartModal(message) {
    const modal = document.getElementById("cart-modal");
    document.getElementById("modal-message").innerText = message;
    modal.classList.add("active");
}

function closeCartModal() {
    document.getElementById("cart-modal").classList.remove("active");
}
function previewProduct(id) {
    var product = homeFilterProductsData.find(function (p) {
        return p.id == id;
    });

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
                           <input type="number" value="1" min="1" 
                           onkeydown="if(['e', 'E', '+', '-'].includes(event.key)) event.preventDefault();">
                           <button type="button" class="plus">+</button>
                        </div>
                        <button class="add-to-cart" title="Add to Cart">Add To Cart</button>
                        <button class="add-to-wishlist" title="Add to Wishlist"><i class="far fa-heart"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.showModal();

    const priceWrapper = modal.querySelector('.price-wrapper');
    // priceWrapper.innerHTML = renderPrice(product.variants[0]);
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
    qtyInput.addEventListener('input', function () {
        if (this.value < 1) this.value = 1;
    });
    modal.querySelector('.plus').onclick = () => qtyInput.value = parseInt(qtyInput.value) + 1;
    modal.querySelector('.minus').onclick = () => {
        if (qtyInput.value > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    };

    modal.querySelector('.add-to-cart').onclick = () => {
        const selectedSize = modal.querySelector('input[name="product-size"]:checked').value;
        const quantity = parseInt(qtyInput.value);

        addToCart(product, selectedSize, quantity);
        modal.close();
    };

    var modalWishBtn = modal.querySelector('.add-to-wishlist');

    var currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (currentWishlist.some(item => item.id === product.id)) {
        modalWishBtn.classList.add("active");
    }

    modalWishBtn.onclick = function () {
        let result = addToWishlist(product.id);
        if (result) {
            this.classList.add("active");
        } else {
            this.classList.remove("active");
        }
    };
}
function toggleWishlist(btn, id) {

    var result = addToWishlist(id);

    if (result) {
        btn.classList.add("active");
    } else {
        btn.classList.remove("active");
    }

}
function addToWishlist(id) {

    var product = homeFilterProductsData.find(function (p) {
        return p.id == id;
    });
    var wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    var existsIndex = wishlist.findIndex(item => item.id === product.id);

    if (existsIndex === -1) {
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        refreshWishlistItemCount();

        return true;
    } else {
        wishlist.splice(existsIndex, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        refreshWishlistItemCount();

        return false;
    }

} function refreshCartItemCount() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let totalQuantity = 0;

    cartItems.forEach(function (cartItem) {
        totalQuantity += cartItem.qty;
    });

    const cartCounterElement = document.querySelector(".cart-counter");
    if (cartCounterElement) {
        cartCounterElement.textContent = totalQuantity;
    }
}



function refreshWishlistItemCount() {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistCounterElement = document.querySelector(".wishlist-counter");

    if (wishlistCounterElement) {
        wishlistCounterElement.textContent = wishlistItems.length;
    }
}
