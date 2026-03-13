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

    let truckPos = (percent / 100) * barWidth - truckWidth / 2;

    if (truckPos < 0) truckPos = 0;
    if (truckPos > barWidth - truckWidth) truckPos = barWidth - truckWidth;

    truck.style.left = truckPos + "px";

    let fillPercent = ((truckPos + truckWidth / 2) / barWidth) * 100;
    progressFill.style.width = fillPercent + "%";

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

        row.innerHTML = 


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

        document.getElementById("shippingText").innerText = "You unlocked free shipping!";

    } else {

        let remaining = goal - total;

        document.getElementById("shippingText").innerText =

            "Spend $" + remaining + " more to get free shipping.";

    }

}

renderCart();