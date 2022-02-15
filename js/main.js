const elNav = selectElement(".nav");
const elBurger = selectElement(".header__burger");
const elNavClose = selectElement(".nav__close-button", elNav);
const elMoviesList = selectElement(".last-movies__list");
const elModalInfo = selectElement(".modal-info");
const elForm = selectElement(".header__form");
const elFormInput = selectElement(".header__input");

const elMovieTemplate = selectElement("#movie-template").content;

const bookmarkArray = [];

// UPDATE LOCAL
const updateLocal = () =>
  window.localStorage.setItem("bookmarkArray", JSON.stringify(bookmarkArray));

elBurger.addEventListener("click", () => {
  elNav.classList.add("nav--active");
});

elNavClose.addEventListener("click", () => {
  elNav.classList.remove("nav--active");
});

API_KEY = "831c2068";

let imdbIdArrayas = [];

async function getMovies(searchQuery) {
  const response = await fetch("https://www.omdbapi.com/?apikey=" + API_KEY + "&s=" + searchQuery);

  const data = await response.json();

  moviesRender(data.Search, elMoviesList);
}

getMovies();

const moviesRender = (array, node) => {
  node.innerHTML = null;

  const moviesFragment = document.createDocumentFragment();
  array.forEach((movie) => {
    const movieTemplate = elMovieTemplate.cloneNode(true);

    selectElement(".movie__poster", movieTemplate).src = movie.Poster;
    selectElement(".movie__title__link", movieTemplate).textContent = movie.Title;
    selectElement(".movie__title__link", movieTemplate).title = movie.Title;
    selectElement(".movie__info-button", movieTemplate).onclick = () =>
      infoModal(array, movie.imdbID);

    selectElement(".movie__bookmark-button", movieTemplate).onclick = () =>
      addBookmark(array, movie.imdbID, bookmarkArray);

    moviesFragment.appendChild(movieTemplate);
  });

  node.append(moviesFragment);
};

const infoModal = (array, imdbId) => {
  const movieIndex = array.findIndex((movie) => movie.imdbID === imdbId);

  elModalInfo.classList.add("modal-info--active");
  selectElement(".moda-info__image", elModalInfo).src = array[movieIndex].Poster;
  selectElement(".modal-info__title__link", elModalInfo).textContent = array[movieIndex].Title;
  selectElement(".modal-info__item__date", elModalInfo).textContent = array[movieIndex].Year;
};

const addBookmark = (array, imdbId, bookmark) => {
  const movieIndex = array.findIndex((movie) => movie.imdbID === imdbId);

  if (bookmark.includes(array[movieIndex])) return;

  bookmark.unshift(array[movieIndex]);
  updateLocal();
};

elModalInfo.addEventListener("click", (evt) => {
  const target = evt.target;
  if (target.name === "modal-close" || target.matches(".modal-info"))
    elModalInfo.classList.remove("modal-info--active");
});

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const searchQuery = elFormInput.value.trim();

  if (!searchQuery) return;

  getMovies(searchQuery);
});
