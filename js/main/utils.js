function logout() {

    localStorage.removeItem("currentUser");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    location.reload();

}

function showAlert(message) {
    var alertBox = document.getElementById("customAlert");
    var msg = document.getElementById("alertMessage");

    msg.textContent = message;
    alertBox.style.display = "block";

    setTimeout(function () {
        alertBox.style.display = "none";
    }, 3000);
}

function refreshCartItemCount() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let totalQuantity = 0;

    cartItems.forEach(function(cartItem){
        totalQuantity += cartItem.quantity;
    });

    const cartCounterElement = document.querySelector(".cart-counter");
    if(cartCounterElement){
        cartCounterElement.textContent = totalQuantity;
    }
}

refreshCartItemCount();


function refreshWishlistItemCount() {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistCounterElement = document.querySelector(".wishlist-counter");

    if(wishlistCounterElement){
        wishlistCounterElement.textContent = wishlistItems.length;
    }
}

refreshWishlistItemCount();