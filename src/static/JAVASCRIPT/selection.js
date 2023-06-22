const apiKey = 'f44d1cab4cfa09f296ab19d09156ce1c';
const moviesSection = document.getElementById('shows');
const moviesContainer = moviesSection.querySelector('.movies_section');

async function addMovie(movie) { 
  console.log("[movie-js]", movie); 
  let ok = 1; //verificare daca are poster

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
  //tmdb call for poster
  const data2 = await tmdbData(
    `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${movie.title}`
  );

  if(data2.results.length !=0 && data2.results[0].poster_path != null){
    poster.src = `https://image.tmdb.org/t/p/w500${data2.results[0].poster_path}`; 
    // cand este apasata imaginea -> redirectionare catre pagina filmului: ??????????
    poster.setAttribute("onClick", `location.href="src/views/movie.html?id=${movie._id}"`)
  } 
 
  //TODO aici s-a incercat ceva da nu a mers)))) aka daca nu e in tmdb, nu afisa, ci sari la urmatorul dar imi incarca doar 38 din 40 
  // if(data2.results.length == 0 || data.results.length == 0 || data2.results[0].poster_path == null){ //daca nu are poster nu il vreau :)))
  //    ok = 0;
  //   //ca sa sara peste cele care nu au poster/nota/ nu exista (idk ?) pe tmdb si sa puna alt film in locul lui 
  //   //(adica sa nu se incarce doar 39 de filme daca la unul nu a gasit poster)
  // } else { 
    overview.appendChild(title);
    title.appendChild(grade);
    overview.appendChild(description);
    movieCard.appendChild(poster);
    movieCard.appendChild(overview);
    moviesContainer.appendChild(movieCard);
  
 //a.setAttribute("href", "movie.html") // adaugare movie id in url...?
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
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },

  }).then(response => {

    if (!response.ok) {
      throw new Error('Incorrect URL: The URL is incorrect and the server returned a ' + response.status + ' status');
  }
    return response.json();
  }).then(json => {

    // Loop through each data
    for(var i = 0; i < 40; i++) {//json.length - momentan punem doar primele 40
      var movie = json[i];
      addMovie(movie)
    }
    
  }).catch(err => {
    console.log(err)
  })

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