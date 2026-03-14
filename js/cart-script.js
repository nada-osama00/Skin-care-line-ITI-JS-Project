let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItems = document.getElementById("cart-items");

let cartTotal = 0;
let freeShippingGoal = 100;


function addAmount(amount) {

    cartTotal += amount;

    updateShipping();
}

function resetCart() {

    cartTotal = 0;

    updateShipping();
}


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
        return;
    }

    emptyMessage.style.display = "none";

    cartHeader.style.display = "grid";
    shippingWidget.style.display = "block";
    cartActions.style.display = "flex";

    cart.forEach(function (item, index) {

        const row = document.createElement("div");
        row.classList.add("cart-item");

        row.innerHTML = `
        <div class="product">
            <img src="${item.image}" width="70">
            <span>${item.name}</span>
        </div>

        <div class="quantity">
            <button onclick="decreaseQty(${index})">-</button>
            <span>${item.qty}</span>
            <button onclick="increaseQty(${index})">+</button>
        </div>

        <div class="price">
            $${(item.price * item.qty).toFixed(2)}
        </div>

        <button onclick="removeItem(${index})">✕</button>
        `;

        cartItems.appendChild(row);

    });

    updateShipping();

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


function updateShipping() {

    let total = 0;

    cart.forEach(p => {
        total += p.price * p.qty;
    });

    const goal = 100;

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


renderCart();