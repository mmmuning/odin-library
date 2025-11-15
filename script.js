const modal = document.querySelector(".modal");
const addBtn = document.querySelector(".btn-add");
const closeBtn = document.querySelector(".btn-close");
const statusBtn = document.querySelector(".btn-close");
const themeToggleBtn = document.querySelector("#theme-toggle");

const myLibrary = [];

function Book(id, title, author, pages, cover, status) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }

  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.cover = cover;
  this.status = status;
}

function addBookToLibrary() {
  // take params, create a book then store it in the array
}

// Change Book Status
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

    container.classList.remove("open");
  }
});

addBtn.onclick = function () {
  modal.style.display = "flex";
};

closeBtn.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

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
