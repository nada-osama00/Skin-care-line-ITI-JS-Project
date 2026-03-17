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
    regXhr.responseType = "json";
    regXhr.onload = function () {

        if (regXhr.status === 200) {

            var users = regXhr.response;

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