function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let exists = cart.find(item => item.id === product.id);
    if(exists) {
        exists.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}
function openQuickView(product) {
    let modal = document.getElementById("quickview-modal");
    if(!modal) {
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
                        <button class="add-to-cart" title="Add to Cart">Add To Cart</button>
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
        radio.addEventListener('change', function() {
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
    };

    var modalWishBtn = modal.querySelector('.add-to-wishlist');
    
    var currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (currentWishlist.some(item => item.id === product.id)) {
        modalWishBtn.classList.add("active");
    }

    modalWishBtn.onclick = function() {
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