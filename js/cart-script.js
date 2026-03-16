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
        document.querySelector(".Shopping-header").innerText = "";

        cartHeader.style.display = "none";
        shippingWidget.style.display = "none";
        cartActions.style.display = "none";

        updateCartTotal();
        updateShipping();

        localStorage.setItem("cart", JSON.stringify(cart));
        return;
    }

    document.querySelector(".Shopping-header").innerText = "YOUR SHOPPING CART";

    emptyMessage.style.display = "none";

    cartHeader.style.display = "block";
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

    const items = document.querySelectorAll(".cart-item");

    if (items[i]) {

        items[i].style.transition = "transform .25s ease";
        items[i].style.transform = "scale(1.02)";

        setTimeout(function () {

            items[i].style.transform = "scale(1)";

        }, 200);
    }

    cart[i].qty++;

    setTimeout(function () {

        renderCart();

    }, 200);
}

function decreaseQty(i) {

    const items = document.querySelectorAll(".cart-item");

    if (cart[i].qty > 1) {

        items[i].style.transition = "transform .25s ease";
        items[i].style.transform = "scale(0.97)";

        setTimeout(function () {

            cart[i].qty--;
            renderCart();

        }, 200);

    } else {

        /* shake instead of deleting */

        items[i].classList.add("shake");

        setTimeout(function () {

            items[i].classList.remove("shake");

        }, 350);

    }
}

function removeItem(i) {

    const items = document.querySelectorAll(".cart-item");

    items[i].classList.add("removing");

    setTimeout(() => {

        cart.splice(i, 1);
        renderCart();

    }, 350);
}


document.getElementById("clear-cart").onclick = () => {

    const items = document.querySelectorAll(".cart-item");

    items.forEach(item => {
        item.classList.add("removing");
    });

    setTimeout(() => {

        cart = [];
        renderCart();

    }, 350);
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

    const progressFill = document.getElementById("progressFill");
    const truck = document.getElementById("truck");
    const freeBox = document.getElementById("freeShippingBox");

    if (cart.length === 0) {

        progressFill.style.width = "0%";
        truck.style.left = "0%";

        freeBox.classList.remove("show");

        document.getElementById("shippingText").innerText = "";

        return;
    }

    const percent = Math.min((total / goal) * 100, 100);

    progressFill.style.width = percent + "%";
    truck.style.left = percent + "%";

    if (total >= goal) {

        progressFill.classList.add("green");

        freeBox.classList.add("show");

        document.querySelector("#freeShippingBox span").innerText =
            "You unlocked free shipping!";

        document.getElementById("shippingText").innerText = "";

        truck.querySelector("i").style.color = "#2ecc71";
        truck.style.borderColor = "#2ecc71";

    } else {

        progressFill.classList.remove("green");

        freeBox.classList.remove("show");

        let remaining = goal - total;

        document.getElementById("shippingText").innerText =
            "Spend $" + remaining.toFixed(2) + " more to reach free shipping!";

        truck.querySelector("i").style.color = "#f7b500";
        truck.style.borderColor = "#f7b500";
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