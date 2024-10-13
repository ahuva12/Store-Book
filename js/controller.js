function getDivBook(book) {
    return `
        <tr class="row-in-list-books" id=${book.bookId}>
            <td>${book.bookId}</td>
            <td style="cursor: pointer; color: black;" onmouseover="this.style.color='green';" onmouseout="this.style.color='black';" onClick="displayBookDetails(${book.bookId})">${book.bookName}</td>
            <td>$${book.price}</td>
            <td>${book.action}</td>
            <td style="cursor: pointer; color: black;" onmouseover="this.style.color='green';" onmouseout="this.style.color='black';" onClick="handleUpdateBook(${JSON.stringify(book).replace(/"/g, '&quot;')})">update</td>
            <td><img style="cursor: pointer;" onClick="handleDeleteBook(${book.bookId})" id="garbage_icon" src='img/garbage_icon.png' alt="garbage icon"></td>
        </tr>
    `;
}

function getDivsBooks(books) {
    booksInhtml = books.map(book => getDivBook(book));
    return booksInhtml.join("");
}

function getDisplayRatingHtml(rating) {
    let starsHtml = "";
    let i = 1;
    for (i; i <= rating; i++) {
        starsHtml += `<span class="rating-book" id=${i} style="cursor: pointer; color: gold; text-shadow: 0px 0px 1px black;" onClick="updateRating(this)">★</span>`;
    }
    for (i; i <= 5; i++) {
        starsHtml += `<span class="rating-book" id=${i} style="cursor: pointer;" onClick="updateRating(this)">☆</span>`
    }
    return starsHtml;
}

function handleFormBook(event) {
    const submitButton = document.querySelector('#add-book-form button[type="submit"]');
    if (submitButton.textContent === 'Add Form')
        addBook(event)
    else
        handleUpdateBook()
}

function displayBookDetails(bookId) {
    const currBook= Gbooks.find(book => book.bookId === bookId);
    const bookToDisplayHtml = `
        <div class="curr-book" id=${bookId}>
            <div id="details-curr-book">
                <h2>${currBook.bookName}</h2>
                <p>Price: ${currBook.price}</p>
                <p id="rating-book">
                </p>    
            </div>
            <img src='../${currBook.img}' alt=${currBook.bookName}>
        </div>
    `
    renderCurrBook(bookToDisplayHtml);
    const ratingHtml = getDisplayRatingHtml(currBook.rating);
    renderRatingOfCurrBook(ratingHtml);
}

function handleFormBook(event) {
    event.preventDefault();
    let newBook = {
        bookId: Number(event.target.bookId.value),
        bookName: event.target.bookName.value,
        price: Number(event.target.price.value),
        rating: Number(event.target.ratingBook.value),
        img: event.target.img.value,
        author: event.target.author.value,
        action: event.target.action.value
    }
    const submitButton = document.querySelector('#add-book-form button[type="submit"]');
    if (submitButton.textContent === 'Add Book') {
        addBook(newBook);
    }
    else {
        updateBook(newBook);
    }
    document.getElementById('add-book-form').reset(); 
    updateLocalStorage('books', Gbooks);
    hideBookForm();
}

function addBook(newBook) {
    const bookExists = Gbooks.some(book => book.bookId === newBook.bookId);    
    if (bookExists) {
        newBook.bookId = Gbooks.length + 1;
        alert(`A book with this ID already exists. I entered id ${Gbooks.length + 1}.`);
    }
    Gbooks.push(newBook);
    renderBooks();
    // renderNewBookToDisplay(getDivBook(newBook));
}

function updateBook(updatedBook) {
    const index = Gbooks.findIndex(book => book.bookId === updatedBook.bookId);
    if (index !== -1) {
        Gbooks[index] = updatedBook;
        let updatedBookHTML = getDivBook(updatedBook);
        let oldBook = document.getElementById(updatedBook.bookId);
        renderUpdateBook(oldBook, updatedBookHTML);
    } else {
        alert(`Book with ID ${updatedBook.bookId} not found.`);
    }
}

function handleUpdateBook(book) {
    document.getElementById('bookId').value = book.bookId;
    document.getElementById('bookId').readOnly = true; 
    document.getElementById('bookName').value = book.bookName;
    document.getElementById('price').value = book.price;
    document.getElementById('ratingBook').value = book.rating;
    document.getElementById('img').value = book.img;
    document.getElementById('author').value = book.author;
    document.getElementById('action').value = book.action;
    showRating(book.rating);
    setSubmitButton('Update Book');
    changeDisplayElement(document.getElementById('add-book-form'), 'block');
}

function handleDeleteBook(bookId) {
    Gbooks = Gbooks.filter(book => book.bookId !== bookId);
    updateLocalStorage('books', Gbooks);
    RemoveRenderBook(bookId);
}

function sortAccordintToTitle(arrowElement) {
    const direcriotArrow = arrowElement.textContent;
    if (direcriotArrow === '▲') {
        Gbooks.sort((a, b) => {
            return a.bookName.localeCompare(b.bookName, undefined, { sensitivity: 'base' });
        });
        arrowElement.textContent = '▼'
    }
    else {
        Gbooks.sort((a, b) => {
            return b.bookName.localeCompare(a.bookName, undefined, { sensitivity: 'base' });
        });
        arrowElement.textContent = '▲'
    }
    renderBooks(getDivsBooks(Gbooks));
}

function sortAccordingToPrice(arrowElement) {
    const direcriotArrow = arrowElement.textContent;
    if (direcriotArrow === '▲') {
        Gbooks.sort((a, b) => b.price - a.price);
        arrowElement.textContent = '▼'
    }
    else {
        Gbooks.sort((a, b) => a.price - b.price);
        arrowElement.textContent = '▲'
    }
    renderBooks(getDivsBooks(Gbooks));
}

function updateRating(spanStar) {
    const currBook = document.getElementsByClassName('curr-book')[0];
    const newRating = Number(spanStar.id);
    const bookId = Number(currBook.id);
    const indexThisBook = Gbooks.findIndex(book => book.bookId === bookId);
    if (indexThisBook !== -1)
    {
        Gbooks[indexThisBook].rating = newRating;
        updateLocalStorage('books', Gbooks);
        const ratingHtml = getDisplayRatingHtml(newRating);
        renderRatingOfCurrBook(ratingHtml);
    }
}

function nextPage() {
    if (currentPage === 1) {
        updateNavigationButton('prevPageButton', false);
    }
    if (currentPage < Math.ceil(Gbooks.length / booksPerPage)) {
        currentPage++;
        updateNavigationButton('nextPageButton', false);
        renderBooks();
    }
    else {
        updateNavigationButton('nextPageButton', true);
    }
}

function previousPage() {
    if (currentPage === Math.ceil(Gbooks.length / booksPerPage)) {
        updateNavigationButton('nextPageButton', false);
    }
    if (currentPage > 1) {
        currentPage--;
        updateNavigationButton('prevPageButton', false);
        renderBooks();
    }
    else {
        updateNavigationButton('prevPageButton', true);
    }
}
