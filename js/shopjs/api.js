var allProducts = [];
var xhr=new XMLHttpRequest()
xhr.open('GET','https://69b40edfe224ec066bddf1d0.mockapi.io/Scincareobjects/products')
xhr.responseType="json"
xhr.send()
xhr.onload=function(){
    allProducts=xhr.response
    if (typeof renderPage === "function") {
        renderPage();
    }
}