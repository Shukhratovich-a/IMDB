const elNav = selectElement(".nav");
const elBurger = selectElement(".header__burger");
const elNavClose = selectElement(".nav__close-button", elNav);
const elMoviesList = selectElement(".movies__list");
const elModalInfo = selectElement(".modal-info");
const elForm = selectElement(".header__form");
const elFormInput = selectElement(".header__input");
const elFormSelect = selectElement(".header__select");
const elPagination = selectElement(".movies__pagination");

const elPrevButton = selectElement(".pagination__prev");
const elNextButton = selectElement(".pagination__next");

const elMovieTemplate = selectElement("#movie-template").content;
const elGenreTemplate = selectElement("#genre-template").content;

elBurger.addEventListener("click", () => {
  elNav.classList.add("nav--active");
});
elNavClose.addEventListener("click", () => {
  elNav.classList.remove("nav--active");
});

const bookmarkArray = JSON.parse(window.localStorage.getItem("bookmarkArray")) || [];
let paginationNumber = 1;
let moviesType = "";
let searchQuery = "shrek";

// UPDATE LOCAL
const updateLocal = () =>
  window.localStorage.setItem("bookmarkArray", JSON.stringify(bookmarkArray));

API_KEY = "831c2068";

async function getMovies() {
  const response = await fetch(
    "https://www.omdbapi.com/?apikey=" +
      API_KEY +
      "&s=" +
      searchQuery +
      "&page=" +
      paginationNumber +
      "&type=" +
      moviesType
  );

  const data = await response.json();

  paginationStyle(data.totalResults);

  if (data.Response === "True") moviesRender(data.Search, elMoviesList);
  else (elMoviesList.innerHTML = null), (elMoviesList.textContent = "No Movie");
}

getMovies();

const moviesRender = (array, node) => {
  node.innerHTML = null;

  const moviesFragment = document.createDocumentFragment();
  array.forEach((movie) => {
    const movieTemplate = elMovieTemplate.cloneNode(true);

    if (movie.Poster !== "N/A") selectElement(".movie__poster", movieTemplate).src = movie.Poster;

    selectElement(".movie__title__link", movieTemplate).textContent = movie.Title;
    selectElement(".movie__title__link", movieTemplate).title = movie.Title;
    selectElement(".movie__info-button", movieTemplate).onclick = () => infoModalOpen(movie.imdbID);

    selectElement(".movie__bookmark-button", movieTemplate).onclick = () =>
      addBookmark(array, movie.imdbID, bookmarkArray);
    selectElement(".movie__top__button", movieTemplate).onclick = () =>
      addBookmark(array, movie.imdbID, bookmarkArray);

    if (testBookmark(bookmarkArray, movie.imdbID)) {
      selectElement(".movie__top__button", movieTemplate).classList.add(
        "movie__top__button--bookmarked"
      );
      selectElement(".movie__bookmark-button", movieTemplate).classList.add(
        "movie__bookmark-button--bookmarked"
      );
    } else {
      selectElement(".movie__top__button", movieTemplate).classList.remove(
        "movie__top__button--bookmarked"
      );
      selectElement(".movie__bookmark-button", movieTemplate).classList.remove(
        "movie__bookmark-button--bookmarked"
      );
    }

    moviesFragment.appendChild(movieTemplate);
  });

  node.append(moviesFragment);
};

const findIndex = (array, id) => array.findIndex((movie) => movie.imdbID === id);

async function infoModalOpen(imdbId) {
  async function getMovieFullInfo() {
    const response = await fetch("https://www.omdbapi.com/?apikey=" + API_KEY + "&i=" + imdbId);

    const data = await response.json();

    elModalInfo.classList.add("modal-info--active");
    infoModalInner(data);
  }

  getMovieFullInfo();
}

const normalizeTime = (setTime) => {
  const time = Number(setTime.split(" ")[0]);
  const hour = Math.floor(time / 60);
  const minute = time - hour * 60;

  if (time < 60) return minute + "min";
  else return hour + "h" + " " + minute + "min";
};

const renderGernes = (data, element) => {
  const genres = data.split(", ");
  element.innerHTML = null;

  genres.forEach((genre) => {
    const newGenre = elGenreTemplate.cloneNode(true);
    selectElement("a", newGenre).textContent = genre;
    element.appendChild(newGenre);
  });
};

const infoModalInner = (data) => {
  const genresList = selectElement(".modal-info__genres");

  selectElement(".modal-info__image", elModalInfo).src = data.Poster;
  selectElement(".modal-info__title__link", elModalInfo).textContent = data.Title;
  selectElement(".modal-info__item__date", elModalInfo).textContent = data.Year;
  selectElement(".modal-info__item__runtime", elModalInfo).textContent = normalizeTime(
    data.Runtime
  );
  selectElement(".modal-info__item__rating", elModalInfo).textContent = data.Rated;
  selectElement(".modal-info__overview", elModalInfo).textContent = data.Plot;
  renderGernes(data.Genre, genresList);
};

const addBookmark = (array, imdbId, bookmark) => {
  if (testBookmark(bookmark, imdbId)) return;
  else bookmark.unshift(array[findIndex(array, imdbId)]);

  moviesRender(array, elMoviesList);
  updateLocal();
};

const testBookmark = (array, id) => {
  let summ = 0;
  array.forEach((movie) => {
    if (movie.imdbID === id) summ++;
  });
  return summ;
};

elModalInfo.addEventListener("click", (evt) => {
  const target = evt.target;
  if (target.name === "modal-close" || target.matches(".modal-info"))
    elModalInfo.classList.remove("modal-info--active");
});

const clearInput = (input) => (input.value = null);

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  searchQuery = elFormInput.value.trim();
  moviesType = elFormSelect.value.trim();

  if (!searchQuery) return;
  paginationNumber = 1;

  clearInput(elFormInput);
  getMovies(searchQuery);
});

const paginationController = (button) => {
  if (button.name === "next") paginationNumber++;
  else if (button.name === "prev") paginationNumber--;
};

const paginationStyle = (data) => {
  const paginationPage = Math.ceil(Number(data) / 10);

  if (paginationNumber <= 1) elPrevButton.disabled = true;
  else elPrevButton.disabled = false;

  if (paginationNumber === paginationPage) elNextButton.disabled = true;
  else elNextButton.disabled = false;
};

const pagination = (evt) => {
  const button = evt.target;

  paginationController(button);

  getMovies();
};

elPagination.addEventListener("click", pagination);
