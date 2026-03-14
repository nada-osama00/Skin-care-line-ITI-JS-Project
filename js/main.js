document.addEventListener("DOMContentLoaded", function () {

    var searchDialogMainScript = document.getElementById("search-dialog");
    var searchInputMainScript = document.getElementById("search-input");
    var searchResultsContainerMainScript = document.getElementById("search-results");
    var productsMainScript = [];

    openSearchMainScript = function () {
        searchDialogMainScript.showModal();
        setTimeout(function () {
            searchDialogMainScript.classList.add("active");
        }, 10);
    };

    closeSearchMainScript = function () {
        searchDialogMainScript.classList.remove("active");
        searchDialogMainScript.classList.add("closing");
        setTimeout(function () {
            searchDialogMainScript.close();
            searchDialogMainScript.classList.remove("closing");
        }, 400);
    };

    var xhrMainScript = new XMLHttpRequest();
    xhrMainScript.open("GET", "https://69b40edfe224ec066bddf1d0.mockapi.io/Scincareobjects/products");
    xhrMainScript.onload = function () {
        if (xhrMainScript.status === 200) {
            productsMainScript = JSON.parse(xhrMainScript.responseText);
            displayProductsMainScript(productsMainScript);
        }
    };
    xhrMainScript.send();

    searchInputMainScript.addEventListener("input", function () {
        var valueMainScript = searchInputMainScript.value.toLowerCase();
        var filteredProductsMainScript = productsMainScript.filter(function (product) {
            return product.name.toLowerCase().includes(valueMainScript);
        });
        displayProductsMainScript(filteredProductsMainScript);
    });

    function displayProductsMainScript(arrMainScript) {
        var htmlMainScript = "";

        if (arrMainScript.length === 0) {
            searchResultsContainerMainScript.innerHTML = "<p>No results found</p>";
            return;
        }

        for (var i = 0; i < arrMainScript.length; i++) {
            var productMainScript = arrMainScript[i];
            var variantMainScript = productMainScript.variants[0];

            var priceHTMLMainScript = variantMainScript.oldprice ?
                "<span class='old-price'>$" + variantMainScript.oldprice + "</span> <span class='price'>$" + variantMainScript.price + "</span>" :
                "$" + variantMainScript.price;

            htmlMainScript +=
                "<a href='product-details.html?id=" + productMainScript.id + "' class='most-search-product'>" +
                "<div class='image'>" +
                "<div class='img-box'>" +
                "<img src='" + productMainScript.images[0] + "' class='main'>" +
                "<img src='" + productMainScript.images[1] + "' class='hover-img'>" +
                "</div>" +
                "</div>" +
                "<div class='info-search-product'>" +
                "<h4>" + priceHTMLMainScript + "</h4>" +
                "<p>" + productMainScript.name + "</p>" +
                "</div>" +
                "</a>";
        }

        searchResultsContainerMainScript.innerHTML = htmlMainScript;
    }

});

// login

var dialogAccount = document.getElementById("accountDialog");
var openDialogAccount = document.getElementById("accountBtn");
var closeDialogAccount = document.getElementById("closeDialog");

var currentUser = JSON.parse(localStorage.getItem("currentUser"));


openDialogAccount.onclick = function (e) {
    e.preventDefault();

    if (currentUser) {
        window.location.href = "./pages/profile.html";

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


var userJson = "https://69b40edfe224ec066bddf1d0.mockapi.io/Scincareobjects/users";
function validateEmail(email) {
    var pattern = /\S+@\S+\.\S+/;
    return pattern.test(email);
}

function validatePhone(phone) {
    var pattern = /^01\d{9}$/;
    return pattern.test(phone);
}

function validatePassword(password) {
    return password.length >= 6;
}

registerForm.addEventListener("submit", function (e) {
    e.preventDefault();


    var firstName = document.getElementById("regFName").value.trim();
    var lastName = document.getElementById("regLName").value.trim();
    var email = document.getElementById("regEmail").value.trim();
    var phone = document.getElementById("regTel").value.trim();
    var address = document.getElementById("regAddress").value.trim();
    var password = document.getElementById("regPass").value;
    var confirmPassword = document.getElementById("regConfirmPass").value;

    if (firstName.length < 2) return showAlert("First name must be at least 2 characters");
    if (lastName.length < 2) return showAlert("Last name must be at least 2 characters");

    if (!validateEmail(email)) return showAlert("Invalid email");

    if (!validatePhone(phone)) return showAlert("Invalid phone number");

    if (address.length < 3) return showAlert("Address required");

    if (!validatePassword(password)) return showAlert("Password must be at least 6 characters");

    if (password !== confirmPassword) return showAlert("Passwords do not match");

    var regXhr = new XMLHttpRequest();
    regXhr.open("GET", userJson, true);
    regXhr.onload = function () {

        if (regXhr.status === 200) {
            var users = regXhr.responseType = 'json';

            var exists = false;
            for (var i = 0; i < users.length; i++) {
                if (users[i].email === email) {
                    exists = true;
                    break;
                }
            }

            if (exists) return showAlert("Email already exists");

            var newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                address: address,
                password: password
            };

            var regXhrPost = new XMLHttpRequest();
            regXhrPost.open("POST", userJson, true);
            regXhrPost.setRequestHeader("Content-Type", "application/json");
            regXhrPost.onload = function () {
                if (regXhrPost.status === 201 || regXhrPost.status === 200) {
                    showAlert("Account created successfully");
                    registerForm.reset();
                }
            }
            regXhrPost.send(JSON.stringify(newUser));
        }
    }
    regXhr.send();
});

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var logEmail = document.getElementById("logEmail").value.trim();
    var logPassword = document.getElementById("logPass").value;

    var logXhr = new XMLHttpRequest();
    logXhr.open("GET", userJson, true);
    logXhr.responseType = "json";
    logXhr.onload = function () {
        if (logXhr.status === 200) {
            var users = logXhr.response;
            var user = null;
            for (var i = 0; i < users.length; i++) {
                if (users[i].email === logEmail && users[i].password === logPassword) {
                    user = users[i];
                    break;
                }
            }

            if (!user) return showAlert("Invalid email or password");

            localStorage.setItem("currentUser", JSON.stringify(user));

            if (!localStorage.getItem("cart")) localStorage.setItem("cart", JSON.stringify([]));
            if (!localStorage.getItem("wishlist")) localStorage.setItem("wishlist", JSON.stringify([]));

            showAlert("Login successful");

            setTimeout(function () {
                location.reload();
            }, 1500);
        }
    }
    logXhr.send();
});


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