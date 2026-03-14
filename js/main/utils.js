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