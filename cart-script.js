let cartTotal = 0;
let freeShippingGoal = 100;

function addAmount(amount) {

    cartTotal += amount;

    updateShippingBar();
}

function resetCart() {

    cartTotal = 0;

    updateShippingBar();
}

function updateShippingBar() {
    let remaining = freeShippingGoal - cartTotal;
    let percent = (cartTotal / freeShippingGoal) * 100;

    if (percent > 100) percent = 100;

    const progressBar = document.querySelector(".progress-bar");
    const truck = document.getElementById("truck");
    const progressFill = document.getElementById("progressFill");

    const barWidth = progressBar.offsetWidth;
    const truckWidth = truck.offsetWidth;

    // Truck position (leading the fill)
    let truckPos = (percent / 100) * barWidth - truckWidth / 2;

    // prevent truck from going outside the bar
    if (truckPos < 0) truckPos = 0;
    if (truckPos > barWidth - truckWidth) truckPos = barWidth - truckWidth;

    truck.style.left = truckPos + "px";

    // Fill width is just behind the truck
    let fillPercent = ((truckPos + truckWidth / 2) / barWidth) * 100;
    progressFill.style.width = fillPercent + "%";

    // Free shipping display logic
    if (cartTotal >= freeShippingGoal) {
        progressFill.classList.add("green");
        document.getElementById("shippingText").style.display = "none";
        document.getElementById("freeShippingBox").style.display = "flex";
    } else {
        progressFill.classList.remove("green");
        document.getElementById("freeShippingBox").style.display = "none";
        document.getElementById("shippingText").style.display = "block";
        document.getElementById("shippingText").innerText =
            "Spend $" + remaining.toFixed(2) + " more to reach free shipping!";
    }
}



let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");

function renderCart() {

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {

        const row = document.createElement("div");
        row.classList.add("cart-item");

        row.innerHTML = `

<div class="product-info">

<img src="${item.image}">

<div>

<div class="product-title">${item.name}</div>

<div class="product-price">$${item.price}</div>

<div class="product-color">Color : ${item.color}</div>

</div>

</div>


<div class="quantity-box">

<div class="quantity-controls">

<button onclick="decreaseQty(${index})">-</button>

<span>${item.qty}</span>

<button onclick="increaseQty(${index})">+</button>

</div>

</div>


<div class="price-area">

<span>$${item.price * item.qty}</span>

<span class="remove-item" onclick="removeItem(${index})">×</span>

</div>

`;

        cartItems.appendChild(row);

    });

    updateShipping();

    localStorage.setItem("cart", JSON.stringify(cart));

}

/* QUANTITY */

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

/* REMOVE */

function removeItem(i) {

    cart.splice(i, 1);

    renderCart();

}

/* CLEAR */

document.getElementById("clear-cart").onclick = () => {

    cart = [];

    renderCart();

};


/* SHIPPING PROGRESS */

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

        document.getElementById("shippingText").innerText = "You unlocked free shipping!";

    } else {

        let remaining = goal - total;

        document.getElementById("shippingText").innerText =

            "Spend $" + remaining + " more to get free shipping.";

    }

}

renderCart();