const searchDialog = document.getElementById("search-dialog");

function openSearch(){
    searchDialog.showModal();
     setTimeout(() => {
        searchDialog.classList.add("active");
    }, 10);

}

function closeSearch(){
    searchDialog.classList.remove("active");
    searchDialog.classList.add("closing");

    setTimeout(() => {
        searchDialog.close();
        searchDialog.classList.remove("closing");
    }, 400); 
}