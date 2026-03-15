let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");

let freeShippingGoal = 100;

cart = cart.map(item => ({
    ...item,
    qty: item.qty || 1,
    price: Number(item.price || item.variants?.[0]?.price) || 0
}));


function renderCart() {

    const emptyMessage = document.getElementById("empty-cart-message");
    const cartHeader = document.querySelector(".cart-header");
    const shippingWidget = document.querySelector(".shipping-widget");
    const cartActions = document.querySelector(".cart-actions");

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        emptyMessage.style.display = "block";

        cartHeader.style.display = "none";
        shippingWidget.style.display = "none";
        cartActions.style.display = "none";

        localStorage.setItem("cart", JSON.stringify(cart));
        updateShipping();
        return;
    }

    emptyMessage.style.display = "none";

    cartHeader.style.display = "grid";
    shippingWidget.style.display = "block";
    cartActions.style.display = "flex";

    cart.forEach((item, index) => {

        const row = document.createElement("div");
        row.classList.add("cart-item");

        row.innerHTML = `

    <div class="cart-left">

        <img class="cart-img"
        src="${item.thumbnail || item.images?.[0] || 'placeholder.jpg'}">

        <div class="product-info">

            <h4 class="product-title">${item.name}</h4>

            <p class="product-price">$${item.price.toFixed(2)}</p>

            <p class="product-variant">
                ${item.variant || ""}
            </p>

        </div>

    </div>


    <div class="cart-qty">

        <div class="qty-box">

            <button onclick="decreaseQty(${index})">−</button>

            <span>${item.qty}</span>

            <button onclick="increaseQty(${index})">+</button>

        </div>

    </div>


    <div class="cart-right">

        <span class="item-total">
            $${(item.price * item.qty).toFixed(2)}
        </span>

        <span class="remove-btn"
        onclick="removeItem(${index})">×</span>

    </div>

    `;

        cartItems.appendChild(row);
    });

    updateShipping();
    updateCartTotal();

    localStorage.setItem("cart", JSON.stringify(cart));
}


function increaseQty(i) {
    cart[i].qty++;
    renderCart();
}

function decreaseQty(i) {

    if (cart[i].qty > 1) {
        cart[i].qty--;
    }

    renderCart();
}

function removeItem(i) {

    cart.splice(i, 1);
    renderCart();
}


document.getElementById("clear-cart").onclick = () => {

    cart = [];
    renderCart();
};


/* CALCULATE CART TOTAL */

function getCartTotal() {

    let total = 0;

    cart.forEach(p => {
        total += (Number(p.price) || 0) * (p.qty || 1);
    });

    return total;
}


function updateCartTotal() {

    const total = getCartTotal();

    const subtotalElement = document.querySelector(".cartSubtotal");

    if (subtotalElement) {
        subtotalElement.innerText = "$" + total.toFixed(2);
    }
}


/* FREE SHIPPING */

function updateShipping() {

    const total = getCartTotal();

    const goal = freeShippingGoal;

    const percent = Math.min((total / goal) * 100, 100);

    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("truck").style.left = percent + "%";

    if (total >= goal) {

        document.getElementById("progressFill").classList.add("green");

        document.getElementById("freeShippingBox").style.display = "flex";

        document.getElementById("shippingText").innerText =
            "You unlocked free shipping!";

    } else {

        document.getElementById("progressFill").classList.remove("green");

        document.getElementById("freeShippingBox").style.display = "none";

        let remaining = goal - total;

        document.getElementById("shippingText").innerText =
            "Spend $" + remaining.toFixed(2) + " more to reach free shipping!";
    }
}


/* CHECKOUT BUTTON */

document.getElementById("cartCheckoutButton").addEventListener("click", function () {

    const country = document.querySelector(".cartCountryInput")?.value || "";
    const province = document.querySelector(".cartProvinceInput")?.value || "";
    const zip = document.querySelector(".cartZipInput")?.value || "";

    const checkoutData = {

        products: cart,
        total: getCartTotal(),
        shipping: {
            country: country,
            province: province,
            zip: zip
        }
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    window.location.href = "checkout.html";

});


/* SHIPPING CALCULATOR */
let shippingCost = 0;

const shippingBtn = document.querySelector(".cartShippingBtn");

if (shippingBtn) {

    shippingBtn.addEventListener("click", function () {

        const zip = document.querySelector(".cartZipInput").value.trim();
        const resultBox = document.querySelector(".shippingResult");
        const preview = document.querySelector(".shippingPreview");

        if (zip === "") {

            alert("Please enter zip code");
            return;

        }

        const cartTotal = getCartTotal();

        /* SHOW SHIPPING PREVIEW */
        preview.style.display = "block";

        if (cartTotal >= freeShippingGoal) {

            shippingCost = 0;

            preview.innerText = "Shipping is FREE.";

        } else {

            shippingCost = 10;

            preview.innerText = "Shipping: $10";

        }

        updateTotalWithShipping();

    });

}


renderCart();