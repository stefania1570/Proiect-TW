const apiKey = 'f44d1cab4cfa09f296ab19d09156ce1c';
const moviesSection = document.getElementById('shows');
const moviesContainer = moviesSection.querySelector('.movies_section');
var selectedGenres = [];
var sortBy ; 
var selectedTypes = [];


window.addEventListener('pageshow', function(event) {
    getFilters()
    console.log(selectedGenres)
});


async function addMovie(movie) { 
  console.log("[movie-js]", movie); 

  const movieCard = document.createElement('div');
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

  if(data.results.length !=0 ){
    poster.src = data.results[0].poster_path ? `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`: `https://via.placeholder.com/500x750.png?text=Movie+Poster`; 
  } 
    movieCard.setAttribute("onClick", `location.href="/src/views/movie.html?id=${movie._id}"`)

    overview.appendChild(title);
    title.appendChild(grade);
    overview.appendChild(description);
    movieCard.appendChild(poster);
    movieCard.appendChild(overview);
    moviesContainer.appendChild(movieCard);
  
}

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

const url = 'http://localhost:5500/get-movies';
var loadedMovies = 0; // Track the number of movies loaded so far

function loadMoreMovies() {
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
      // Filter the movies based on genres if selectedGenres is not empty
      let filteredMovies = json;
      if (selectedGenres.length > 0) {
        filteredMovies = json.filter(movie => {
          for (const genre of selectedGenres) {
            if (movie.listed_in.includes(genre)) {
              return true;
            }
          }
          return false;
        });
        console.log(selectedGenres)
      }

      // Filter the movies based on movie/TV show type if selectedTypes is not empty
      if (selectedTypes.length == 1) {
        filteredMovies = filteredMovies.filter(movie => {
            if (movie.type === selectedTypes[0]) {
              return true;
            }
          return false;
        });
      }
      switch (sortBy) {
        case 'option7': //title asc
          filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'option8': //title desc
          filteredMovies.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'option5': //newest
          filteredMovies.sort((a, b) => b.release_year - a.release_year);
          break;
        case 'option6': //oldest
          filteredMovies.sort((a, b) => a.release_year - b.release_year);
          break;
        default:
          // No sorting option specified, use the default order
          break;
      }
      // Load 40 more movies at a time
      const endIndex = loadedMovies + 40;
      for (let i = loadedMovies; i < endIndex && i < filteredMovies.length; i++) {
        const movie = filteredMovies[i];
        addMovie(movie);
      }
      loadedMovies += 40; // Increment the count of loaded movies
    })
    .catch(err => {
      console.log(err);
    });
}


// Intersection Observer callback function
function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMoreMovies();
    }
  });
}

// Create the Intersection Observer
const observer = new IntersectionObserver(handleIntersection, {
  root: null,
  rootMargin: '0px',
  threshold: 0
});

function getFilters(){
  //Genre selector 
  const genreCheckboxes = document.querySelectorAll('.characters input[type="checkbox"]:checked');
   genreCheckboxes.forEach(checkbox => {
    selectedGenres.push(checkbox.id);
  });

  //Sort by selector  
  
  const sortByOption = document.querySelector('#sort input[name="option"]:checked');
  if(sortByOption!=null){
    sortBy = sortByOption.id;
    //console.log(sortBy);
  }

  // type (movie/tvshow)
  const typeCheckboxes = document.querySelectorAll('#tip input[type="checkbox"]:checked');
  typeCheckboxes.forEach(checkbox => {
    selectedTypes.push(checkbox.id);
  });

}

// Start observing the target element 
const targetElement = document.getElementById('footer');
observer.observe(targetElement);


  // Search button event listener - AICI SE FACE FILTRAREA
  const searchBtn = document.getElementById('search-btn');
  searchBtn.addEventListener('click', () => {

    loadedMovies = 0;
    getFilters()
    // Clear all children of moviesContainer
    while (moviesContainer.firstChild) {
      moviesContainer.removeChild(moviesContainer.firstChild);
    }
    loadMoreMovies()
  });