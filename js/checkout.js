const cart = JSON.parse(localStorage.getItem("cart")) || [];

const checkoutItems = document.getElementById("checkout-items");

let subtotal = 0;


/* DISPLAY PRODUCTS */

cart.forEach(item => {

    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 1;

    const itemTotal = price * qty;

    subtotal += itemTotal;

    const product = document.createElement("div");

    product.classList.add("checkout-item");

    product.innerHTML = `

        <div class="productImageBox">

            <img src="${item.thumbnail || item.images?.[0] || 'placeholder.jpg'}">

            <span class="qtyBadge">${qty}</span>

        </div>

        <div class="productInfo">

            <div class="productName">${item.name}</div>

        </div>

        <div class="productPrice">

            $${itemTotal.toFixed(2)}

        </div>

    `;

    checkoutItems.appendChild(product);

});


/* SHIPPING RULE */

let shipping = 0;

if (subtotal >= 100) {
    shipping = 0;
} else {
    shipping = 10;
}


/* TAX */

let tax = subtotal * 0.10;


/* TOTAL */

let total = subtotal + shipping + tax;


/* DISPLAY SUBTOTAL */

document.getElementById("checkout-subtotal").innerText =
    "$" + subtotal.toFixed(2);


/* DISPLAY TAX */

document.getElementById("checkout-tax").innerText =
    "$" + tax.toFixed(2);


/* DISPLAY TOTAL */

document.getElementById("checkout-total").innerText =
    "$" + total.toFixed(2);


/* DISPLAY SHIPPING */

if (shipping === 0) {

    document.getElementById("checkout-shipping").innerText = "FREE";
    document.getElementById("checkout-shipping-summary").innerText = "FREE";

} else {

    document.getElementById("checkout-shipping").innerText = "$10.00";
    document.getElementById("checkout-shipping-summary").innerText = "$10.00";

}


/* MODAL ELEMENTS */

const modal = document.getElementById("orderModal");
const continueBtn = document.getElementById("continueShoppingBtn");


/* FORM VALIDATION */

const form = document.getElementById("checkoutForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    if (cart.length === 0) {
        return;
    }

    modal.style.display = "flex";

    localStorage.removeItem("cart");

});


/* CONTINUE SHOPPING */

continueBtn.addEventListener("click", function () {

    window.location.href = "../index.html";

});