var container = document.getElementById("wish-products");
var message = document.getElementById("wish-message");

var wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function renderWishlist() {

    container.innerHTML = "";

    if (wishlist.length === 0) {

        message.style.display = "block";
        return;

    } else {

        message.style.display = "none";
    }

    for (var i = 0; i < wishlist.length; i++) {

        var product = wishlist[i];

        var price = product.variants[0].price;
        var oldPrice = product.variants[0].oldprice;

        var card = document.createElement("div");
        card.className = "wish-card";

        card.innerHTML = `

        <div class="wish-img">

            ${product.issale ? `<span class="wish-sale">Sale</span>` : ""}

            ${product.isnew ? `<span class="wish-new-badge">New</span>` : ""}

            <img src="${product.thumbnail}" alt="${product.name}">

        </div>

        <h3 class="wish-name">${product.name}</h3>

        <p class="wish-price">

            ${oldPrice ? `<span class="wish-old">$${oldPrice}</span>` : ""}

            <span class="wish-new">$${price}</span>

        </p>

        <button class="wish-remove" data-index="${i}">
            Remove
        </button>

        `;

        container.appendChild(card);
    }

    attachRemoveEvents();
}

function attachRemoveEvents() {

    var buttons = document.querySelectorAll(".wish-remove");

    for (var j = 0; j < buttons.length; j++) {

        buttons[j].addEventListener("click", function () {

            var index = this.dataset.index;

            var card = this.closest(".wish-card");

            card.style.transition = "all .3s ease";
            card.style.opacity = "0";
            card.style.transform = "scale(.9)";

            setTimeout(function () {

                wishlist.splice(index, 1);

                localStorage.setItem("wishlist", JSON.stringify(wishlist));

                renderWishlist();

            }, 300);

        });

    }
}

renderWishlist();