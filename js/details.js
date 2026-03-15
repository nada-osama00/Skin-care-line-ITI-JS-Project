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


// ══════════════════════════════════════
//   displayProduct — الدالة الرئيسية
// ══════════════════════════════════════
function displayProduct(prd, allProducts) {
    buildGallery(prd.images);
    buildInfo(prd);
    buildTabs(prd);
    buildRelated(prd, allProducts);
}


// =====================================
//   buildGallery
// =====================================
function buildGallery(images) {

    var mainImage  = document.getElementById('mainImage');
    var thumbnails = document.getElementById('thumbnails');

    // الصورة الكبيرة
    var mainImg = document.createElement('img');
    mainImg.src = images[0];
    mainImg.id  = 'activeImg';
    mainImage.append(mainImg);

    // الـ Thumbnails
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

    // أول thumbnail تكون active
    document.querySelectorAll('.thumb')[0].classList.add('active');
}


// ══════════════════════════════════════
//   updateStock — تحديث الستوك
// ══════════════════════════════════════
function updateStock(stockEl, stockNum) {
    // امسح الـ classes القديمة
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


// ══════════════════════════════════════
//   buildInfo
// ══════════════════════════════════════
function buildInfo(prd) {

    var currentProduct = prd;

    var productInfo = document.getElementById('productInfo');

    // ── Breadcrumb
    if(prd.category && prd.name) {
        var breadcrumb = document.querySelector('.breadcrumb');
        breadcrumb.innerText = 'Home → ' + prd.category + ' → ' + prd.name;
    }

    // ── Badges (issale / isnew)
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

        productInfo.append(badgesRow);
    }

    // ── Title
    var title = document.createElement('h1');
    title.innerText = prd.name;
    title.classList.add('product-title');
    productInfo.append(title);

    // ── For (مناسب لمين)
    if(prd.for) {
        var forEl = document.createElement('p');
        forEl.innerText = 'For: ' + prd.for;
        forEl.classList.add('product-for');
        productInfo.append(forEl);
    }

    // ── Vendor
    if(prd.vendor) {
        var vendorEl = document.createElement('p');
        vendorEl.innerHTML = '<strong>Vendor:</strong> ' + prd.vendor;
        vendorEl.classList.add('vendor-info');
        productInfo.append(vendorEl);
    }

    // ── Price Row (من أول variant)
    var priceRow = document.createElement('div');
    priceRow.classList.add('price-row');

    var price = document.createElement('h3');
    price.id = 'activePrice';
    price.innerText = '$' + prd.variants[0].price;
    price.classList.add('product-price');
    priceRow.append(price);

    var oldPriceEl = document.createElement('span');
    oldPriceEl.id = 'activeOldPrice';
    oldPriceEl.classList.add('old-price');
    if(prd.variants[0].oldprice && prd.variants[0].oldprice > prd.variants[0].price) {
        oldPriceEl.innerText = '$' + prd.variants[0].oldprice;
    }
    priceRow.append(oldPriceEl);

    productInfo.append(priceRow);

    // ── Stock (من أول variant)
    var stock = document.createElement('p');
    stock.id = 'activeStock';
    stock.classList.add('stock');
    updateStock(stock, prd.variants[0].stock);
    productInfo.append(stock);

    // ── Variants (Size Buttons)
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

            // حفظ بيانات الـ variant في الـ button
            sizeBtn.dataset.price    = v.price;
            sizeBtn.dataset.oldprice = v.oldprice;
            sizeBtn.dataset.stock    = v.stock;

            sizeBtn.addEventListener('click', function() {

                // شيل active من الكل
                var allSizes = document.querySelectorAll('.size-btn');
                for(var b of allSizes) {
                    b.classList.remove('active');
                }
                this.classList.add('active');

                // حدث السعر
                document.getElementById('activePrice').innerText = '$' + this.dataset.price;

                // حدث الـ oldprice
                var oldPriceEl = document.getElementById('activeOldPrice');
                if(this.dataset.oldprice && this.dataset.oldprice > this.dataset.price) {
                    oldPriceEl.innerText = '$' + this.dataset.oldprice;
                } else {
                    oldPriceEl.innerText = '';
                }

                // حدث الستوك
                var stockEl = document.getElementById('activeStock');
                updateStock(stockEl, this.dataset.stock);
            });

            sizesRow.append(sizeBtn);
        }

        // أول size تكون active تلقائياً
        sizesRow.children[0].classList.add('active');

        productInfo.append(sizeLabel, sizesRow);
    }

    // ── Description
    var desc = document.createElement('p');
    desc.innerText = prd.description;
    desc.classList.add('product-desc');
    productInfo.append(desc);

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
        if(qtyInput.value > 1) {
            qtyInput.value--;
        }
    });

    btnPlus.addEventListener('click', function() {
        qtyInput.value++;
    });

    var btnCart = document.createElement('button');
    btnCart.innerText = 'Add to Cart';
    btnCart.classList.add('btn-cart');

    btnCart.addEventListener('click', function() {

        // ── جيب الـ size والـ price المختارين
        var activeSize = document.querySelector('.size-btn.active');
        var size  = activeSize ? activeSize.innerText : '';
        var price = activeSize ? parseFloat(activeSize.dataset.price) : parseFloat(currentProduct.variants[0].price);
        var qty   = parseInt(qtyInput.value);

        // ── جيب الـ cart من localStorage
        var cart = JSON.parse(localStorage.getItem('cart')) || [];

        // ── شوف لو المنتج موجود بنفس الـ id والـ size
        var existing = null;
        for(var i = 0; i < cart.length; i++) {
            if(cart[i].id == currentProduct.id && cart[i].size == size) {
                existing = i;
                break;
            }
        }

        if(existing !== null) {
            // لو موجود زود الـ qty
            cart[existing].qty += qty;
        } else {
            // لو مش موجود ضيفه
            cart.push({
                id:    currentProduct.id,
                name:  currentProduct.name,
                size:  size,
                price: price,
                qty:   qty,
                img:   currentProduct.thumbnail
            });
        }

        // ── حفظ في localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // ── روح لصفحة الـ cart
        location.href = '../pages/cart.html';
    });

    quantityRow.append(btnMinus, qtyInput, btnPlus, btnCart);
    productInfo.append(quantityRow);

    // ── Buy it now
    var btnBuy = document.createElement('button');
    btnBuy.innerText = 'Buy it now';
    btnBuy.classList.add('btn-buy');
    productInfo.append(btnBuy);

    // ── Actions
    var actions = document.createElement('div');
    actions.classList.add('product-actions');

    var compare = document.createElement('span');
    compare.innerText = '⇄ Compare';
    compare.classList.add('action-btn');

    var wishlist = document.createElement('span');
    wishlist.innerText = '☆ Add To Wishlist';
    wishlist.classList.add('action-btn');

    var share = document.createElement('span');
    share.innerText = '⌥ Share';
    share.classList.add('action-btn');

    actions.append(compare, wishlist, share);
    productInfo.append(actions);

    // ── Divider
    var divider = document.createElement('div');
    divider.classList.add('divider');
    productInfo.append(divider);

    // ── Delivery
    var delivery = document.createElement('div');
    delivery.classList.add('delivery-info');

    var today     = new Date();
    var startDate = new Date();
    var endDate   = new Date();

    startDate.setDate(today.getDate() + 5);
    endDate.setDate(today.getDate() + 9);

    var options = { month: 'long', day: 'numeric' };
    var start   = startDate.toLocaleDateString('en-US', options);
    var end     = endDate.toLocaleDateString('en-US', options);

    var deliveryRow1 = document.createElement('p');
    deliveryRow1.innerHTML = '🚚 <strong>Estimated Delivery:</strong> <span>' + start + ' - ' + end + '</span>';
    deliveryRow1.classList.add('delivery-row');

    var deliveryRow2 = document.createElement('p');
    deliveryRow2.innerHTML = '📦 <strong>Free Shipping & Returns:</strong> <span>On all orders over $75</span>';
    deliveryRow2.classList.add('delivery-row');

    delivery.append(deliveryRow1, deliveryRow2);
    productInfo.append(delivery);
}


// ══════════════════════════════════════
//   buildTabs
// ══════════════════════════════════════
function buildTabs(prd) {

    var section = document.querySelector('.description-section');

    // ── Tab Buttons
    var tabRow = document.createElement('div');
    tabRow.classList.add('tab-row');

    var tabDesc = document.createElement('span');
    tabDesc.innerText = 'Description';
    tabDesc.classList.add('desc-tab', 'active');

    var tabShip = document.createElement('span');
    tabShip.innerText = 'Shipping & Return';
    tabShip.classList.add('desc-tab');

    tabRow.append(tabDesc, tabShip);

    // ── محتوى Description
    var contentDesc = document.createElement('div');
    contentDesc.classList.add('tab-content', 'active');

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

    // ── محتوى Shipping & Return
    var contentShip = document.createElement('div');
    contentShip.classList.add('tab-content');

    var shipText = document.createElement('p');
    shipText.innerText = 'We typically process and ship orders within 1 week. Free shipping is available for orders over $75. Standard shipping usually takes 5-7 business days. For returns, we accept items within 1 week, provided they are unused and in their original packaging. Refunds are processed within 3-5 business days.';
    shipText.classList.add('tab-text');

    contentShip.append(shipText);

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

    section.append(tabRow, contentDesc, contentShip);
}


// ══════════════════════════════════════
//   buildRelated — You May Also Like
// ══════════════════════════════════════
function buildRelated(prd, allProducts) {

    var section = document.querySelector('.related-products');

    // ── العنوان
    var title = document.createElement('h2');
    title.innerText = 'You May Also Like';
    title.classList.add('related-title');
    section.append(title);

    // ── فلتر المنتجات بنفس الـ category وشيل المنتج الحالي
    var related = [];
    for(var p of allProducts) {
        if(p.category == prd.category && p.id != prd.id) {
            related.push(p);
        }
    }

    // لو مفيش في نفس الـ category خد أي منتجات تانية
    if(related.length == 0) {
        for(var p of allProducts) {
            if(p.id != prd.id) {
                related.push(p);
            }
        }
    }

    // خد أول 4 بس
    related = related.slice(0, 4);

    // ── الـ Grid
    var grid = document.createElement('div');
    grid.classList.add('related-grid');

    for(var p of related) {

        // الـ Card كلها link
        var card = document.createElement('a');
        card.href = './details.html?id=' + p.id;
        card.classList.add('related-card');

        // ── الصورة + badges
        var imgWrap = document.createElement('div');
        imgWrap.classList.add('related-img-wrap');

        var img = document.createElement('img');
        img.src = p.thumbnail;
        img.alt = p.name;
        imgWrap.append(img);

        // badge لو issale أو isnew
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
        grid.append(card);
    }

    section.append(grid);
}