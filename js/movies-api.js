API_KEY = "831c2068";

async function getMovies(searchQuery = "shrek") {
  const response = await fetch("https://www.omdbapi.com/?apikey=" + API_KEY + "&s=" + searchQuery);

  const data = await response.json();

  console.log(data.Response);
  if (data.Response === "True") moviesRender(data.Search, elMoviesList);
  else (elMoviesList.innerHTML = null), (elMoviesList.textContent = "No Movie");
}

getMovies();
