//mainPageList.js e pt prima pagina cand trb sa dea doar primele 8 filme + primele 8 seriale
//in selection.js o sa se faca o cautare multi-criteriala a datelor
const apiKey = 'f44d1cab4cfa09f296ab19d09156ce1c';

document.addEventListener('DOMContentLoaded', () => {

  var moviesSection = document.getElementById('movies');
  var moviesContainer = moviesSection.querySelector('.movies_section');
  var tvShowsSection = document.getElementById('tv-shows');
  var tvShowsContainer = tvShowsSection.querySelector('.tv-shows_section');

  async function tmdbData(path) {
    try {
      const res = await fetch(path);
      const cardData = await res.json();
      return cardData;
    } catch (err) {
      console.log("Failed loading tmdb", err);
      throw err;
    }
  }

  async function addMovie(movie) { 
    
    var movieCard = document.createElement('div');
    movieCard.className = 'movies_card';

    const overview = document.createElement('div');
    overview.className = 'overview';

    const title = document.createElement('h2');
    title.textContent = movie.title;

    const grade = document.createElement('span');
    grade.className = 'tmdb_grade';
    const data = await tmdbData(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${movie.title}`
    ); 

    if( data.results.length != 0 ){
      grade.textContent = data.results[0].vote_average;
    }

    const description = document.createElement('p');
    description.textContent = movie.description;

    const poster = document.createElement('img');
    if(data.results.length !=0 && data.results[0].poster_path != null){
      poster.src = `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`; 
      // cand este apasata imaginea -> redirectionare catre pagina filmului
      poster.setAttribute("onClick", `location.href="/src/views/movie.html?id=${movie._id}"`)
    } 

    overview.appendChild(title);
    title.appendChild(grade);
    overview.appendChild(description);
    movieCard.appendChild(poster);
    movieCard.appendChild(overview);
    moviesContainer.appendChild(movieCard);
    
  }

 async function addTVShow(show){
    var showCard = document.createElement('div');
    showCard.className = 'tv-shows_card';

    const overview = document.createElement('div');
    overview.className = 'overview';

    const title = document.createElement('h2');
    title.textContent = show.title;

    const grade = document.createElement('span');
    grade.className = 'tmdb_grade';
    const data = await tmdbData(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${show.title}`
    ); 

    if( data.results.length != 0 ){
      grade.textContent = data.results[0].vote_average;
    }

    const description = document.createElement('p');
    description.textContent = show.description;

    const poster = document.createElement('img');
    if(data.results.length !=0 && data.results[0].poster_path != null){
      poster.src = `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`; 
      // cand este apasata imaginea -> redirectionare catre pagina filmului
      poster.setAttribute("onClick", `location.href="/src/views/movie.html?id=${show._id}"`)
    } 

    overview.appendChild(title);
    title.appendChild(grade);
    overview.appendChild(description);
    showCard.appendChild(poster);
    showCard.appendChild(overview);
    tvShowsContainer.appendChild(showCard);
 }

const url = 'http://localhost:5500/get-movies';
let loadedMovies = 0; // Track the number of movies loaded so far
let loadedTVShows = 0; // Track the number of movies loaded so far

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Incorrect URL: The URL is incorrect and the server returned a ' + response.status + ' status');
      }
      return response.json();
    })
    .then(json => {
      // Loop through the data and load 40 more movies
      let i = 0;
      while((loadedMovies < 8 && i <= json.length) || (loadedTVShows < 8 && i <= json.length)) {
        const movie = json[i];
        if(movie.type === "Movie"){
          addMovie(movie);
          loadedMovies++;
          i++;
        }else {
          addTVShow(movie);
          loadedTVShows++;
          i++;
        }
        
      }
    })
    .catch(err => {
      console.log(err);
    });

});



















 