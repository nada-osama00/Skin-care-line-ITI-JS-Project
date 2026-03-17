var dialogAccount = document.getElementById("accountDialog");
var openDialogAccount = document.getElementById("accountBtn");
var closeDialogAccount = document.getElementById("closeDialog");

var currentUser = JSON.parse(localStorage.getItem("currentUser"));

openDialogAccount.onclick = function (e) {
    e.preventDefault();

    if (currentUser) {
        window.location.href = "../pages/profile.html";

    } else {
        dialogAccount.showModal();
    }
}

closeDialogAccount.onclick = function () {
    dialogAccount.close();
}

var loginTab = document.getElementById("login-tab");
var registerTab = document.getElementById("register-tab");
var loginForm = document.getElementById("loginForm");
var registerForm = document.getElementById("registerForm");

loginTab.onclick = function () {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.classList.add("active");
    registerForm.classList.remove("active");
}
registerTab.onclick = function () {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.classList.add("active");
    loginForm.classList.remove("active");
}

var switchToRegister = document.getElementById("register");
switchToRegister.onclick = function () {
    registerTab.click();
}
var switchToLogin = document.getElementById("login");
switchToLogin.onclick = function () {
    loginTab.click();
}