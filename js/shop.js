var currentPage = 1;
const productsPerPage = 12;
var allProducts = [];
var displayMode = 'grid-view';
var xhr=new XMLHttpRequest()
xhr.open('GET','https://69b40edfe224ec066bddf1d0.mockapi.io/Scincareobjects/products')
xhr.responseType="json"
xhr.send()
xhr.onload=function(){
    allProducts=xhr.response
    renderPage();
}
function renderPage() {
    document.getElementById("count-number").innerText = allProducts.length;
    var container = document.getElementById("product-container");
    container.innerHTML = "";
    var start = (currentPage - 1) * productsPerPage;
    var end = start + productsPerPage;
    var currentProducts = allProducts.slice(start, end);
    container.className = displayMode === 'grid-view' ? "product-grid" : "product-list";
    for(var product of currentProducts)
    {
        var card = createProductCard(product);
        container.append(card);
    }
    setupPagination();
}
   
function createProductCard(product) {
        var a= document.createElement("a")
        var image=document.createElement("img")
        var h4=document.createElement("h4")
         a.classList.add('product-card')
        a.href = "./details.html?id=" + product.id

        var imgWrapper = document.createElement("div");
        imgWrapper.classList.add('product-image-wrapper');
        image.src=product.thumbnail

        var hoverImg = document.createElement("img");
       if (product.images && product.images.length > 0) {
       hoverImg.src = product.images[0]; 
       } else {
         hoverImg.src = product.thumbnail;
        }
      hoverImg.classList.add("hover-img");

      var desc = document.createElement("p");
      desc.classList.add("product-description");
      desc.innerHTML = `<strong>For:</strong> ${product.for}<br>${product.description}`;

      var quickActions = document.createElement("div");
     quickActions.classList.add("quick-actions");
     quickActions.innerHTML = `
    <button><i class="fa-solid fa-cart-arrow-down"></i></button>
    <button><i class="far fa-eye"></i></button>
    <button><i class="far fa-heart"></i></button>`;

        imgWrapper.append(image,hoverImg);
        var h4 = document.createElement("h4");
        h4.classList.add("product-title");
        h4.innerText = product.name;

        var priceContainer = document.createElement("div");
        priceContainer.classList.add("price-container");
        var price = document.createElement("span");
        price.classList.add("product-price");

       if (product.variants && product.variants.length > 0) {
        var firstVariant = product.variants[0];
        price.innerText = "$" + firstVariant.price + ".00";

         if (product.issale && firstVariant.oldprice) {

          var discountPercent = Math.round(((firstVariant.oldprice - firstVariant.price) / firstVariant.oldprice) * 100);
          
           var oldPrice = document.createElement("span");
            oldPrice.classList.add("old-price");
            oldPrice.innerText = "$" + firstVariant.oldprice + ".00";
          
            var discountBadge = document.createElement("span");
            discountBadge.classList.add("discount-percent");
            discountBadge.innerText = `${discountPercent}% OFF`;
       
        var saleBadge = document.createElement("span");
        saleBadge.classList.add("badge", "sale-badge");
        saleBadge.innerText = "Sale";
        imgWrapper.appendChild(saleBadge);
        priceContainer.append(price,oldPrice, discountBadge);
    }
     else {
            priceContainer.append(price);
        }
    } else {
        price.innerText = ""; 
    }
   
    
    if (product.isnew) {
        var newBadge = document.createElement("span");
        newBadge.classList.add("badge", "new-badge");
        newBadge.innerText = "New";
        imgWrapper.appendChild(newBadge);
    }
       var infoContainer = document.createElement("div");
       infoContainer.classList.add("product-info");
    if (displayMode === 'grid-view') {
    imgWrapper.append(quickActions);
    infoContainer.append(h4, priceContainer); 
    } else {
    infoContainer.append(h4, desc, priceContainer, quickActions);
    }
       a.append(imgWrapper,infoContainer);    
       return a;
    }

    function setupPagination() {
    var wrapper = document.getElementById("pagination-wrapper");
    if(!wrapper) return;
    wrapper.innerHTML = "";
    var pageCount = Math.ceil(allProducts.length / productsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        var btn = document.createElement("button");
        btn.innerText = i;
        btn.className = (i === currentPage) ? "page-btn active" : "page-btn";
        btn.onclick = function() {
            currentPage = i;
            renderPage();
            window.scrollTo({top: 0, behavior: 'smooth'});
        };
        wrapper.append(btn);
    }
    if (currentPage < pageCount) {
        var nextBtn = document.createElement("button");
        nextBtn.innerHTML = '<i class="fa-solid fa-angles-right"></i>'; 
        nextBtn.className = "page-btn next-btn";
        nextBtn.onclick = function() {
            currentPage++;
            renderPage();
            window.scrollTo({top: 0, behavior: 'smooth'});
        };
        wrapper.append(nextBtn);
    }
}
document.querySelector(".sort-select").addEventListener("change", function () {
    const sortValue = this.value;
    if (sortValue === "Alphabetically, A-Z") {
        allProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "Price, Low to High") {
        allProducts.sort((a, b) => {
            let priceA = a.variants[0] ? a.variants[0].price : 0;
            let priceB = b.variants[0] ? b.variants[0].price : 0;
            return priceA - priceB;
        });
    }
    currentPage = 1; 
    renderPage();
});
var gridmode=document.getElementById("grid-view")
gridmode.addEventListener("click", function() {
    toggleView('grid');
    this.classList.add("active");
    document.getElementById("List-View").classList.remove("active");
});
var listmode=document.getElementById("List-View")
listmode.addEventListener("click", function() {
    toggleView('list');
    this.classList.add("active");
    document.getElementById("grid-view").classList.remove("active");
});
function toggleView(mode) {
    displayMode = mode === 'grid' ? 'grid-view' : 'list-view';
    renderPage();
}
