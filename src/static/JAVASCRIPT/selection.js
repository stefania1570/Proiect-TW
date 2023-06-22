const apiKey = 'f44d1cab4cfa09f296ab19d09156ce1c';
const moviesSection = document.getElementById('shows');
const moviesContainer = moviesSection.querySelector('.movies_section');

async function addMovie(movie) { 
  console.log("[movie-js]", movie); 
  //let ok = 1; //verificare daca are poster

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
let loadedMovies = 0; // Track the number of movies loaded so far

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
      // Loop through the data and load 40 more movies
      for (let i = loadedMovies; i < loadedMovies + 40 && i < json.length; i++) {
        const movie = json[i];
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

// Start observing the target element 
const targetElement = document.getElementById('footer');
observer.observe(targetElement);


  // Search button event listener - AICI SE FACE FILTRAREA
  // const searchBtn = document.getElementById('search-btn');
  // searchBtn.addEventListener('click', () => {
  //   //Genre selector 
  //   var selectedGenres = [];
  //   const genreCheckboxes = document.querySelectorAll('.characters input[type="checkbox"]:checked');
  //   genreCheckboxes.forEach(checkbox => {
  //     selectedGenres.push(checkbox.id);
  //   });

  //   //Sort by selector  
  //   var sortBy = "popularity.desc"; 
  //   const sortByOption = document.querySelector('#sort input[name="option"]:checked');
  //   if(sortByOption!=null){
  //     sortBy = sortByOption.id;
  //     //console.log(sortBy);
  //   }

  //   //Platform selector (Netflix or Disney+)
  //   var selectedPlatforms = [];
  //   const platformCheckboxes = document.querySelectorAll('#platform input[type="checkbox"]:checked');
  //   platformCheckboxes.forEach(checkbox => {
  //     selectedPlatforms.push(checkbox.id);
  //   });

  //   //Selection by rating
  //   var selectedRatings = [];
  //   const ratingCheckboxes = document.querySelectorAll('#rating input[type="checkbox"]:checked');
  //   ratingCheckboxes.forEach(checkbox => {
  //     selectedRatings.push(checkbox.id);
  //   });
  //   console.log(selectedRatings);


  //   // Perform the search with the selected criteria
  //   //getDataFromDB(selectedGenres, sortBy, selectedPlatforms, selectedRatings);
  // });