document.addEventListener("DOMContentLoaded", function() {
    var openBtn = document.querySelector(".filter-btn");
    var sidebar = document.getElementById("filter-sidebar");
    var overlay = document.getElementById("filter-overlay");
    var closeBtn = document.getElementById("close-sidebar");

    if(openBtn) {openBtn.addEventListener("click", function () {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("no-scroll");
});
    }

    if(closeBtn) {
closeBtn.addEventListener("click", function () {
    sidebar.classList.remove("active");
overlay.classList.remove("active");
document.body.classList.remove("no-scroll");
});}
});