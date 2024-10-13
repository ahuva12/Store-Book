function loadBooksData() {
    const books = localStorage.getItem('books');
    if (books) {
        Gbooks = JSON.parse(books);
    } 
    Gbooks.sort((a, b) => a.bookName.localeCompare(b.bookName, undefined, { sensitivity: 'base' }));
    renderBooks();
    updateLocalStorage('books', Gbooks);
}

function loadData() {
    localStorage.removeItem('books');
    loadBooksData();
}

function main() {
    document.addEventListener("DOMContentLoaded", function() {
        loadBooksData();
    });
}

main();
