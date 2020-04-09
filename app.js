// Book constructor

function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI() {}

// Add book to list
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById('book-list');

  //  create tr element

  const row = document.createElement('tr');

  // Insert cols

  row.innerHTML = `
<td>${book.title}</td>
<td>${book.author}</td>
<td>${book.isbn}</td>
<td><a href="" class="delete"> X </a></td>`;


  list.appendChild(row);
}


// Show alert
UI.prototype.showAlert = function (message, className) {
  // Create a div

  const div = document.createElement('div');
  // add classes

  div.className = `alert ${className}`;

  // add text
  div.appendChild(document.createTextNode(message));

  // get parent

  const container = document.querySelector('.container');

  const form = document.querySelector('#book-form');
  // insert alert
  container.insertBefore(div, form);

  // Timeout after 3 s
  setTimeout(function () {
    document.querySelector('.alert').remove();
  }, 3000);
}


//Delete Book

UI.prototype.deleteBook = function (target) {
  if (target.className === 'delete') {
    target.parentElement.parentElement.remove();
  }
}

// Clear fields

UI.prototype.clearFields = function () {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
}

// Local storage class

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (book) {
      const ui = new UI;

      //Add book to UI
      ui.addBookToList(book);

    });

  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {

    const books = Store.getBooks();

    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));

  }
}


// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);



// Event listeners for add book

document.getElementById('book-form').addEventListener('submit', function (e) {
  // Get form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  // Instantiating a book
  const book = new Book(title, author, isbn);

  //  Instantiate UI
  const ui = new UI();

  // Validate

  if (title === '' || author === '' || isbn === '') {
    // error alert

    ui.showAlert('Please fill in all fields', 'error');


  } else {
    // Add book to list
    ui.addBookToList(book);

    //add to local storage
    Store.addBook(book);

    // Show success
    ui.showAlert('Book Added!', 'success');

    // clear field
    ui.clearFields();

  }

  e.preventDefault();
});


// Event listener for delete book

document.getElementById('book-list').addEventListener('click', function (e) {


  // Instantiate the UI
  const ui = new UI();


  // Delete book
  ui.deleteBook(e.target);

  //Remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);


  // show message
  ui.showAlert('Booked Removed', 'success');

  e.preventDefault;
})