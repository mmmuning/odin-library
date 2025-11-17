const booksContainer = document.querySelector(".books-container");
const form = document.querySelector("#add-book-form");
const modal = document.querySelector(".modal");
const addBtn = document.querySelector(".btn-add");
const closeBtn = document.querySelector(".btn-close");
const statusBtn = document.querySelector(".btn-close");
const themeToggleBtn = document.querySelector("#theme-toggle");
const filters = document.querySelectorAll(".filters li");

const myLibrary = [];

function Book(
  title,
  author,
  pages,
  status,
  cover = "img/book-cover-placeholder.jpg"
) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }

  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
  this.cover = cover;
}

// --- Dummy Books ---
myLibrary.push(
  new Book(
    "Emotional Intelligence",
    "Daniel Goleman",
    384,
    "reading",
    "https://ia800401.us.archive.org/view_archive.php?archive=/33/items/olcovers37/olcovers37-L.zip&file=370147-L.jpg"
  )
);

myLibrary.push(
  new Book(
    "The Three-Body Problem",
    "刘慈欣, Vincent Schmitt, Gwennaël Gaffric, and Marc Simonetti",
    400,
    "to-read",
    "https://ia800507.us.archive.org/view_archive.php?archive=/8/items/l_covers_0009/l_covers_0009_15.zip&file=0009157544-L.jpg"
  )
);

myLibrary.push(
  new Book(
    "The Humans",
    "Matt Haig",
    320,
    "read",
    "https://ia800404.us.archive.org/view_archive.php?archive=/33/items/l_covers_0010/l_covers_0010_31.zip&file=0010310735-L.jpg"
  )
);

function displayAllBooks() {
  // Clear previous books
  while (booksContainer.firstChild) {
    booksContainer.removeChild(booksContainer.firstChild);
  }

  // Append all books
  for (let book of myLibrary) {
    booksContainer.appendChild(renderBook(book));
  }
}

function displayFilteredBooks(filter) {
  while (booksContainer.firstChild) {
    booksContainer.removeChild(booksContainer.firstChild);
  }

  let booksToShow = myLibrary;
  if (filter !== "all") {
    booksToShow = myLibrary.filter((book) => book.status === filter);
  }

  booksToShow.forEach((book) => {
    booksContainer.appendChild(renderBook(book));
  });
}

function renderBook(bookObj) {
  const book = document.createElement("div");
  book.classList.add("book");
  book.dataset.id = bookObj.id;

  const cover = document.createElement("div");
  cover.classList.add("book-cover");
  cover.style.backgroundImage = `url(${bookObj.cover})`;

  const actions = document.createElement("div");
  actions.classList.add("btn-action");

  const dropdown = document.createElement("div");
  dropdown.classList.add("status-dropdown");

  const statusBtn = document.createElement("button");
  statusBtn.classList.add("btn-status");
  statusBtn.dataset.bookStatus = bookObj.status;
  statusBtn.textContent = capitalizeEachWord(
    replaceHyphenWithSpace(bookObj.status)
  );

  const menu = document.createElement("ul");
  menu.classList.add("dropdown-menu");

  ["to-read", "reading", "read"].forEach((status) => {
    const li = document.createElement("li");
    li.dataset.status = status;
    li.textContent = capitalizeEachWord(replaceHyphenWithSpace(status));
    menu.appendChild(li);
  });

  dropdown.appendChild(statusBtn);
  dropdown.appendChild(menu);

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("btn-remove");
  removeBtn.title = "Remove Book";

  removeBtn.addEventListener("click", () => {
    removeBookFromLibrary(bookObj, book);
  });

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "800px");
  svg.setAttribute("height", "800px");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "#000");

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute("clip-rule", "evenodd");
  path.setAttribute(
    "d",
    "M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z"
  );

  svg.appendChild(path);
  removeBtn.appendChild(svg);

  actions.appendChild(dropdown);
  actions.appendChild(removeBtn);

  cover.appendChild(actions);

  const details = document.createElement("div");
  details.classList.add("book-details");

  const title = document.createElement("h3");
  title.classList.add("book-title");
  title.textContent = bookObj.title;
  title.setAttribute("title", bookObj.title);

  const author = document.createElement("p");
  author.classList.add("book-author");
  author.textContent = bookObj.author;
  author.setAttribute("title", bookObj.author);

  details.appendChild(title);
  details.appendChild(author);

  book.appendChild(cover);
  book.appendChild(details);

  return book;
}

// --- Handle Form Submission ---
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);

  const title = data.get("title");
  const author = data.get("author");
  const pages = parseInt(data.get("pages"), 10);
  const status = data.get("status").toLowerCase();

  addBookToLibrary(title, author, pages, status);

  modal.style.display = "none";
  form.reset();
  displayAllBooks();
});

// --- Create a book then store it in the array ---
function addBookToLibrary(title, author, pages, status) {
  const newBook = new Book(title, author, pages, status);
  myLibrary.push(newBook);
}

function removeBookFromLibrary(bookObj, bookEl) {
  const index = myLibrary.findIndex((b) => b.id === bookObj.id);
  if (index > -1) myLibrary.splice(index, 1);
  bookEl.remove();
}

// --- Change Book Status ---
document.addEventListener("click", (e) => {
  const dropdown = e.target.closest(".status-dropdown");

  // Close all other dropdowns
  document.querySelectorAll(".status-dropdown.open").forEach((d) => {
    if (d !== dropdown) d.classList.remove("open");
  });

  // Toggle dropdown
  if (dropdown && e.target.classList.contains("btn-status")) {
    dropdown.classList.toggle("open");
  }

  // When user clicks an option
  if (e.target.matches(".dropdown-menu li")) {
    const newValue = e.target.dataset.status;
    const newLabel = e.target.textContent.trim();

    const container = e.target.closest(".status-dropdown");
    const btn = container.querySelector(".btn-status");

    btn.textContent = newLabel;
    btn.dataset.bookStatus = newValue;

    const bookEl = e.target.closest(".book");
    const bookId = bookEl.dataset.id;
    const bookObj = myLibrary.find((b) => b.id === bookId);
    if (bookObj) bookObj.status = newValue;

    container.classList.remove("open");
  }
});

// --- Filter Function ---
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.textContent.trim().toLowerCase();
    displayFilteredBooks(filter);
  });
});

// --- Modal Functions ---
addBtn.onclick = function () {
  modal.style.display = "flex";
};

closeBtn.onclick = function () {
  modal.style.display = "none";
};

// --- Helper Functions ---
function replaceHyphenWithSpace(str) {
  return str.replace(/-/g, " ");
}

function capitalizeEachWord(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

// --- Handle Theme Toggle ---
themeToggleBtn.addEventListener("click", () => {
  const html = document.documentElement;
  const currentMode = html.getAttribute("data-color-mode");

  if (currentMode === "light") {
    html.setAttribute("data-color-mode", "dark");
  } else {
    html.setAttribute("data-color-mode", "light");
  }

  themeToggleBtn.textContent =
    html.getAttribute("data-color-mode") === "dark" ? "🌙" : "☀️";
});

window.onload = () => {
  displayAllBooks();
};
