var params = new URLSearchParams(location.search);
var id = params.get('id');

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://69b40edfe224ec066bddf1d0.mockapi.io/Scincareobjects/products');
xhr.send();
xhr.responseType = "json";

xhr.onload = function() {
    var products = xhr.response;

    var product;
    for(var prd of products) {
        if(prd.id == id) {
            product = prd;
            break;
        }
    }

    displayProduct(product, products);
}


function displayProduct(prd, allProducts) {
    buildGallery(prd.images);
    buildInfo(prd);
    buildTabsContent(prd);
    buildRelated(prd, allProducts);
}

// ======================================
//   buildGallery
// ======================================
function buildGallery(images) {

    var mainImage  = document.getElementById('mainImage');
    var thumbnails = document.getElementById('thumbnails');

    var mainImg = document.createElement('img');
    mainImg.src = images[0];
    mainImg.id  = 'activeImg';
    mainImage.append(mainImg);

    for(var i of images) {
        var thumb = document.createElement('img');
        thumb.src = i;
        thumb.classList.add('thumb');

        thumb.addEventListener('click', function() {
            document.getElementById('activeImg').src = this.src;

            var allThumbs = document.querySelectorAll('.thumb');
            for(var t of allThumbs) {
                t.classList.remove('active');
            }
            this.classList.add('active');
        });

        thumbnails.append(thumb);
    }

    document.querySelectorAll('.thumb')[0].classList.add('active');
}
// ======================================
//   updateStock
// ======================================
function updateStock(stockEl, stockNum) {
    stockEl.classList.remove('available', 'low', 'out');

    if(stockNum == 0) {
        stockEl.innerText = 'Out of Stock';
        stockEl.classList.add('out');
    } else if(stockNum == 1) {
        stockEl.innerText = 'Last Piece';
        stockEl.classList.add('low');
    } else {
        stockEl.innerText = stockNum + ' Pieces Available';
        stockEl.classList.add('available');
    }
}


// ======================================
//   buildInfo
// ======================================
function buildInfo(prd) {

    var currentProduct = prd;
    var productInfo    = document.getElementById('productInfo');
    var staticContent  = document.getElementById('productActions');

    // ── Breadcrumb
    if(prd.category && prd.name) {
        var breadcrumb = document.querySelector('.breadcrumb');
        breadcrumb.innerText = 'Home → ' + prd.category + ' → ' + prd.name;
    }

    // ── Badges
    if(prd.issale || prd.isnew) {
        var badgesRow = document.createElement('div');
        badgesRow.classList.add('badges-row');

        if(prd.issale) {
            var saleBadge = document.createElement('span');
            saleBadge.innerText = 'Sale';
            saleBadge.classList.add('badge', 'badge-sale');
            badgesRow.append(saleBadge);
        }

        if(prd.isnew) {
            var newBadge = document.createElement('span');
            newBadge.innerText = 'New';
            newBadge.classList.add('badge', 'badge-new');
            badgesRow.append(newBadge);
        }

        productInfo.insertBefore(badgesRow, staticContent);
    }

    // ── Title
    var title = document.createElement('h1');
    title.innerText = prd.name;
    title.classList.add('product-title');
    productInfo.insertBefore(title, staticContent);

    // ── For
    if(prd.for) {
        var forEl = document.createElement('p');
        forEl.innerText = 'For: ' + prd.for;
        forEl.classList.add('product-for');
        productInfo.insertBefore(forEl, staticContent);
    }

    // ── Vendor
    if(prd.vendor) {
        var vendorEl = document.createElement('p');
        vendorEl.innerHTML = '<strong>Vendor:</strong> ' + prd.vendor;
        vendorEl.classList.add('vendor-info');
        productInfo.insertBefore(vendorEl, staticContent);
    }

    // ── Price Row
    var priceRow  = document.createElement('div');
    priceRow.classList.add('price-row');

    var price = document.createElement('h3');
    price.id  = 'activePrice';
    price.innerText = '$' + prd.variants[0].price;
    price.classList.add('product-price');
    priceRow.append(price);

    var oldPriceEl = document.createElement('span');
    oldPriceEl.id  = 'activeOldPrice';
    oldPriceEl.classList.add('old-price');
    if(prd.variants[0].oldprice && prd.variants[0].oldprice > prd.variants[0].price) {
        oldPriceEl.innerText = '$' + prd.variants[0].oldprice;
    }
    priceRow.append(oldPriceEl);
    productInfo.insertBefore(priceRow, staticContent);

    // ── Stock
    var stock = document.createElement('p');
    stock.id  = 'activeStock';
    stock.classList.add('stock');
    updateStock(stock, prd.variants[0].stock);
    productInfo.insertBefore(stock, staticContent);

    // ── Variants
    if(prd.variants && prd.variants.length > 0) {

        var sizeLabel = document.createElement('p');
        sizeLabel.innerText = 'Size';
        sizeLabel.classList.add('option-label');

        var sizesRow = document.createElement('div');
        sizesRow.classList.add('sizes-row');

        for(var v of prd.variants) {
            var sizeBtn = document.createElement('button');
            sizeBtn.innerText = v.size;
            sizeBtn.classList.add('size-btn');
            sizeBtn.dataset.price    = v.price;
            sizeBtn.dataset.oldprice = v.oldprice;
            sizeBtn.dataset.stock    = v.stock;

            sizeBtn.addEventListener('click', function() {
                var allSizes = document.querySelectorAll('.size-btn');
                for(var b of allSizes) {
                    b.classList.remove('active');
                }
                this.classList.add('active');

                document.getElementById('activePrice').innerText = '$' + this.dataset.price;

                var oldPEl = document.getElementById('activeOldPrice');
                if(this.dataset.oldprice && this.dataset.oldprice > this.dataset.price) {
                    oldPEl.innerText = '$' + this.dataset.oldprice;
                } else {
                    oldPEl.innerText = '';
                }

                updateStock(document.getElementById('activeStock'), this.dataset.stock);
            });

            sizesRow.append(sizeBtn);
        }

        sizesRow.children[0].classList.add('active');
        productInfo.insertBefore(sizeLabel, staticContent);
        productInfo.insertBefore(sizesRow, staticContent);
    }

    // ── Description
    var desc = document.createElement('p');
    desc.innerText = prd.description;
    desc.classList.add('product-desc');
    productInfo.insertBefore(desc, staticContent);

    // ── Quantity + Add to Cart
    var quantityRow = document.createElement('div');
    quantityRow.classList.add('quantity-row');

    var btnMinus = document.createElement('button');
    btnMinus.innerText = '-';
    btnMinus.classList.add('qty-btn');

    var qtyInput = document.createElement('input');
    qtyInput.type  = 'number';
    qtyInput.value = 1;
    qtyInput.min   = 1;
    qtyInput.classList.add('qty-input');

    var btnPlus = document.createElement('button');
    btnPlus.innerText = '+';
    btnPlus.classList.add('qty-btn');

    btnMinus.addEventListener('click', function() {
        if(qtyInput.value > 1) qtyInput.value--;
    });

    btnPlus.addEventListener('click', function() {
        qtyInput.value++;
    });

    var btnCart = document.createElement('button');
    btnCart.innerText = 'Add to Cart';
    btnCart.classList.add('btn-cart');

    btnCart.addEventListener('click', function() {
        var activeSize = document.querySelector('.size-btn.active');
        var size  = activeSize ? activeSize.innerText : '';
        var price = activeSize ? parseFloat(activeSize.dataset.price) : parseFloat(currentProduct.variants[0].price);
        var qty   = parseInt(qtyInput.value);

        var cart = JSON.parse(localStorage.getItem('cart')) || [];

        var existing = null;
        for(var i = 0; i < cart.length; i++) {
            if(cart[i].id == currentProduct.id && cart[i].size == size) {
                existing = i;
                break;
            }
        }

        if(existing !== null) {
            cart[existing].qty += qty;
        } else {
            cart.push({
                id:    currentProduct.id,
                name:  currentProduct.name,
                size:  size,
                price: price,
                qty:   qty,
                img:   currentProduct.thumbnail
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        location.href = '../pages/cart.html';
    });

    quantityRow.append(btnMinus, qtyInput, btnPlus, btnCart);
    productInfo.insertBefore(quantityRow, staticContent);

    // ── Buy it now
    var btnBuy = document.createElement('button');
    btnBuy.innerText = 'Buy it now';
    btnBuy.classList.add('btn-buy');
    productInfo.insertBefore(btnBuy, staticContent);

    // ── Share Popup
    var shareBtn   = document.getElementById('shareBtn');
    var sharePopup = document.getElementById('sharePopup');
    var copyBtn    = document.getElementById('copyBtn');
    var shareUrl   = document.getElementById('shareUrl');
    var copyMsg    = document.getElementById('copyMsg');

    shareUrl.value = window.location.href;

    shareBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        sharePopup.classList.toggle('show');
    });

    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(shareUrl.value);
        copyMsg.classList.add('show');
        setTimeout(function() { copyMsg.classList.remove('show'); }, 2000);
    });

    document.addEventListener('click', function(e) {
        if(!e.target.closest('.share-wrapper')) {
            sharePopup.classList.remove('show');
        }
    });

    // ── Delivery Date
    var today     = new Date();
    var startDate = new Date();
    var endDate   = new Date();

    startDate.setDate(today.getDate() + 5);
    endDate.setDate(today.getDate() + 9);

    var options = { month: 'long', day: 'numeric' };
    var start   = startDate.toLocaleDateString('en-US', options);
    var end     = endDate.toLocaleDateString('en-US', options);

    document.querySelector('#deliveryDate span').innerText = start + ' - ' + end;
}
// ======================================
//   buildTabsContent
// ======================================
function buildTabsContent(prd) {

    var tabDesc     = document.getElementById('tabDesc');
    var tabShip     = document.getElementById('tabShip');
    var contentDesc = document.getElementById('contentDesc');
    var contentShip = document.getElementById('contentShip');

    // ── محتوى Description من الـ API
    var descText = document.createElement('p');
    descText.innerText = prd.description;
    descText.classList.add('tab-text');

    if(prd.benefitsList && prd.benefitsList.length > 0) {

        var benefitsTitle = document.createElement('h3');
        benefitsTitle.innerText = prd.benefitsTitle || 'Benefits';
        benefitsTitle.classList.add('benefits-title');

        var benefitsList = document.createElement('ul');
        benefitsList.classList.add('benefits-list');

        for(var b of prd.benefitsList) {
            var li = document.createElement('li');
            li.innerText = b;
            benefitsList.append(li);
        }

        contentDesc.append(descText, benefitsTitle, benefitsList);

    } else {
        contentDesc.append(descText);
    }

    // ── منطق التبديل
    tabDesc.addEventListener('click', function() {
        tabDesc.classList.add('active');
        tabShip.classList.remove('active');
        contentDesc.classList.add('active');
        contentShip.classList.remove('active');
    });

    tabShip.addEventListener('click', function() {
        tabShip.classList.add('active');
        tabDesc.classList.remove('active');
        contentShip.classList.add('active');
        contentDesc.classList.remove('active');
    });
}
// ======================================
//   buildRelated
// ======================================
function buildRelated(prd, allProducts) {

    var section = document.getElementById('relatedGrid');

    // ── فلتر بنفس الـ category
    var related = [];
    for(var p of allProducts) {
        if(p.category == prd.category && p.id != prd.id) {
            related.push(p);
        }
    }

    // لو مفيش → خد أي منتجات
    if(related.length == 0) {
        for(var p of allProducts) {
            if(p.id != prd.id) related.push(p);
        }
    }

    // أول 4 بس
    related = related.slice(0, 4);

    for(var p of related) {

        var card = document.createElement('a');
        card.href = './details.html?id=' + p.id;
        card.classList.add('related-card');

        // ── صورة + badge
        var imgWrap = document.createElement('div');
        imgWrap.classList.add('related-img-wrap');

        var img = document.createElement('img');
        img.src = p.thumbnail;
        img.alt = p.name;
        imgWrap.append(img);

        if(p.issale || p.isnew) {
            var badge = document.createElement('span');
            badge.classList.add('related-badge');
            if(p.issale) {
                badge.innerText = 'Sale';
                badge.classList.add('badge-sale');
            } else {
                badge.innerText = 'New';
                badge.classList.add('badge-new');
            }
            imgWrap.append(badge);
        }

        // ── السعر
        var priceWrap = document.createElement('div');
        priceWrap.classList.add('related-price');

        var priceEl = document.createElement('span');
        priceEl.innerText = '$' + p.variants[0].price;
        priceEl.classList.add('r-price');
        priceWrap.append(priceEl);

        if(p.variants[0].oldprice && p.variants[0].oldprice > p.variants[0].price) {
            var oldPriceEl = document.createElement('span');
            oldPriceEl.innerText = '$' + p.variants[0].oldprice;
            oldPriceEl.classList.add('r-old-price');
            priceWrap.append(oldPriceEl);
        }

        // ── الاسم
        var nameEl = document.createElement('p');
        nameEl.innerText = p.name;
        nameEl.classList.add('related-name');

        card.append(imgWrap, priceWrap, nameEl);
        section.append(card);
    }
}
