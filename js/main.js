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