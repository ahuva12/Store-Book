let currentPage = 1;
const booksPerPage = 5;

function renderBooks() {
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const booksToDisplay = Gbooks.slice(start, end);
    const listBooksHtml = getDivsBooks(booksToDisplay);
    document.getElementById('list-books').innerHTML = listBooksHtml;
    updatePagination();
}

function showRating(value) {
    document.getElementById('ratingValue').innerText = value;
}

function changeDisplayElement(element, display) {
    element.style.display = display;
}

function handleButtonAddBook() {
    setSubmitButton('Add Book');
    document.getElementById('bookId').readOnly = false; 
    changeDisplayElement(document.getElementById('add-book-form'), 'block');
}

function hideBookForm() {
    changeDisplayElement(document.getElementById('add-book-form'), 'none');
}

function renderNewBookToDisplay(newBook) {
    const divListBooks = document.getElementById('list-books')
    divListBooks.innerHTML += newBook;
}

function renderUpdateBook(oldBook, updatedBook) {
    oldBook.outerHTML = updatedBook;
}

function setSubmitButton(mode) {
    const submitButton = document.querySelector('#add-book-form button[type="submit"]');
    submitButton.textContent = mode; 
}

function RemoveRenderBook(bookId) {
    const deletedBook = document.getElementById(bookId);
    if (deletedBook) {
        deletedBook.remove(); 
    } else {
        console.log(`Book with ID ${bookId} not found.`);
    }
}

function renderCurrBook(bookToDisplayHtml) {
    const currBook = document.getElementsByClassName('curr-book')[0];
    currBook.outerHTML = bookToDisplayHtml;
}

function renderRatingOfCurrBook(ratingHtml) {
    const ratingBook = document.getElementById('rating-book');
    ratingBook.innerHTML = 'Rating: ' + ratingHtml;
}

function updatePagination() {
    document.getElementById('this-page').innerText = currentPage;
    document.getElementById('count-pages').innerText = Math.ceil(Gbooks.length / booksPerPage);
}

function updateNavigationButton (navButton, mode) {
    const navigationButton = document.getElementById(navButton);
    navigationButton.disabled = mode;
}