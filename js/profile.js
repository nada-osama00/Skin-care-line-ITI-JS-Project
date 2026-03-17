// ══════════════════════════════════════
//   1. جيب البيانات من localStorage
// ══════════════════════════════════════
var user = JSON.parse(localStorage.getItem('currentUser'));

// ══════════════════════════════════════
//   2. لو مفيش user → روح للـ home
// ══════════════════════════════════════
if(!user) {
    location.href = '../index.html';
}

// ══════════════════════════════════════
//   3. displayProfile — الدالة الرئيسية
// ══════════════════════════════════════
function displayProfile() {
    buildHero();
    buildProfileCard();
    buildStats();
    buildRecentCart();
}

// ══════════════════════════════════════
//   4. buildHero
// ══════════════════════════════════════
function buildHero() {
    var section = document.querySelector('.profile-hero');

    var label = document.createElement('p');
    label.innerText = 'MY ACCOUNT';
    label.classList.add('hero-label');

    var heading = document.createElement('h1');
    heading.innerText = 'Welcome back, ' + user.firstName;
    heading.classList.add('hero-heading');

    var line = document.createElement('div');
    line.classList.add('hero-line');

    section.append(label, heading, line);
}

// ══════════════════════════════════════
//   5. buildProfileCard
// ══════════════════════════════════════
function buildProfileCard() {
    var card = document.getElementById('profileCard');

    // ── الجانب الأيسر: Avatar
    var leftSide = document.createElement('div');
    leftSide.classList.add('card-left');

    var avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M28.776 26.623c-1.94-3.298-5.031-5.742-8.709-6.8l-0.105-0.026c2.864-1.477 4.788-4.415 4.788-7.802 0-4.832-3.918-8.75-8.75-8.75s-8.75 3.918-8.75 8.75c0 3.387 1.924 6.324 4.739 7.779l0.049 0.023c-3.783 1.083-6.874 3.528-8.776 6.756l-0.038 0.069c-0.063 0.108-0.101 0.237-0.101 0.376 0 0.414 0.336 0.75 0.75 0.75 0.276 0 0.517-0.149 0.647-0.371l0.002-0.004c2.335-3.988 6.598-6.624 11.477-6.624s9.143 2.636 11.443 6.562l0.034 0.063c0.132 0.225 0.373 0.374 0.649 0.374 0.414 0 0.75-0.336 0.75-0.75 0-0.138-0.037-0.268-0.103-0.379l0.002 0.004z"/></svg>';

    var name = document.createElement('h2');
    name.innerText = user.firstName + ' ' + user.lastName;
    name.classList.add('avatar-name');

    var member = document.createElement('p');
    member.innerText = 'Member since 2025';
    member.classList.add('avatar-member');

    leftSide.append(avatar, name, member);

    // ── الجانب الأيمن: Info
    var rightSide = document.createElement('div');
    rightSide.classList.add('card-right');

    var infoItems = [
        { icon: '👤', label: 'FULL NAME', value: user.firstName + ' ' + user.lastName },
        { icon: '📧', label: 'EMAIL',     value: user.email    },
        { icon: '📞', label: 'PHONE',     value: user.phone    },
        { icon: '📍', label: 'ADDRESS',   value: user.address  }
    ];

    for(var item of infoItems) {
        var row = document.createElement('div');
        row.classList.add('info-row');

        var rowIcon = document.createElement('span');
        rowIcon.innerText = item.icon;
        rowIcon.classList.add('info-icon');

        var rowText = document.createElement('div');
        rowText.classList.add('info-text');

        var rowLabel = document.createElement('p');
        rowLabel.innerText = item.label;
        rowLabel.classList.add('info-label');

        var rowValue = document.createElement('p');
        rowValue.innerText = item.value;
        rowValue.classList.add('info-value');

        rowText.append(rowLabel, rowValue);
        row.append(rowIcon, rowText);
        rightSide.append(row);
    }

    // ── الأزرار
    var btns = document.createElement('div');
    btns.classList.add('card-btns');

    var editBtn = document.createElement('button');
    editBtn.innerText = 'EDIT PROFILE';
    editBtn.classList.add('btn-edit');

    var logoutBtn = document.createElement('button');
    logoutBtn.innerText = 'LOGOUT';
    logoutBtn.classList.add('btn-logout');

    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        location.href = '../index.html';
    });

    btns.append(editBtn, logoutBtn);
    rightSide.append(btns);

    card.append(leftSide, rightSide);
}

// ══════════════════════════════════════
//   6. buildStats
// ══════════════════════════════════════
function buildStats() {

    // ✅ بيجيب الـ cart دلوقتي مش من الأول
    var cart     = JSON.parse(localStorage.getItem('cart'))     || [];
    var wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    var row = document.getElementById('statsRow');

    var total = 0;
    for(var item of cart) {
        total += item.price * item.qty;
    }

    var stats = [
        { icon: '🛒', value: cart.length,           label: 'CART ITEMS'  },
        { icon: '❤️', value: wishlist.length,        label: 'WISHLIST'    },
        { icon: '💰', value: '$' + total.toFixed(0), label: 'TOTAL IN CART' }
    ];

    for(var stat of stats) {
        var card = document.createElement('div');
        card.classList.add('stat-card');

        var icon = document.createElement('span');
        icon.innerText = stat.icon;
        icon.classList.add('stat-icon');

        var value = document.createElement('h2');
        value.innerText = stat.value;
        value.classList.add('stat-value');

        var label = document.createElement('p');
        label.innerText = stat.label;
        label.classList.add('stat-label');

        card.append(icon, value, label);
        row.append(card);
    }
}

// ══════════════════════════════════════
//   7. buildRecentCart
// ══════════════════════════════════════
function buildRecentCart() {

    // ✅ بيجيب الـ cart دلوقتي مش من الأول
    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    var section = document.getElementById('recentCart');

    // ── العنوان
    var titleRow = document.createElement('div');
    titleRow.classList.add('recent-title-row');

    var line1 = document.createElement('div');
    line1.classList.add('recent-line');

    var title = document.createElement('h3');
    title.innerText = 'RECENT CART ITEMS';
    title.classList.add('recent-title');

    var line2 = document.createElement('div');
    line2.classList.add('recent-line');

    titleRow.append(line1, title, line2);
    section.append(titleRow);

    // ── لو الـ cart فاضي
    if(cart.length === 0) {
        var empty = document.createElement('p');
        empty.innerText = 'Your cart is empty';
        empty.classList.add('empty-state');
        section.append(empty);
        return;
    }

    // ── عرض آخر 3 منتجات
    var recentItems = cart.slice(-3).reverse();

    var itemsCard = document.createElement('div');
    itemsCard.classList.add('recent-items-card');

    for(var item of recentItems) {
        var row = document.createElement('a');
        row.href = '../pages/cart.html';
        row.classList.add('recent-item');

        var img = document.createElement('img');
        img.src = item.thumbnail || '';
        img.alt = item.name;
        img.classList.add('recent-img');

        var info = document.createElement('div');
        info.classList.add('recent-info');

        var itemName = document.createElement('p');
        itemName.innerText = item.name;
        itemName.classList.add('recent-name');

        var sizeBadge = document.createElement('span');
        sizeBadge.innerText = item.size;
        sizeBadge.classList.add('recent-size');

        var qty = document.createElement('p');
        qty.innerText = 'Qty: ' + item.qty;
        qty.classList.add('recent-qty');

        info.append(itemName, sizeBadge, qty);

        var price = document.createElement('p');
        price.innerText = '$' + item.price;
        price.classList.add('recent-price');

        row.append(img, info, price);
        itemsCard.append(row);
    }

    section.append(itemsCard);
}

// ══════════════════════════════════════
//   RUN
// ══════════════════════════════════════
displayProfile();
//edit
editBtn.addEventListener('click', enableEditMode);

function enableEditMode() {
    var values = document.querySelectorAll('.info-value');

    values.forEach(function(val) {
        var text = val.innerText;

        var input = document.createElement('input');
        input.value = text;
        input.classList.add('edit-input');

        val.replaceWith(input);
    });

    // غير زرار Edit لـ Save
    var editBtn = document.querySelector('.btn-edit');
    editBtn.innerText = 'SAVE';
    editBtn.onclick = saveProfile;
}
function saveProfile() {
    var inputs = document.querySelectorAll('.edit-input');

    var updatedUser = {
        ...user,
        firstName: inputs[0].value.split(' ')[0] || user.firstName,
        lastName: inputs[0].value.split(' ')[1] || user.lastName,
        email: inputs[1].value,
        phone: inputs[2].value,
        address: inputs[3].value
    };

    // تحديث localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // تحديث MockAPI
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", userJson + "/" + user.id, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
        if (xhr.status === 200) {
            showAlert("Profile updated successfully");

            // ريـلود عشان يعرض البيانات الجديدة
            location.reload();
        }
    };

    xhr.send(JSON.stringify(updatedUser));
}