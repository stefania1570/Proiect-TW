const queryString = window.location.search;
const urlParameters = new URLSearchParams(queryString);
const id = urlParameters.get('id');
const apiKey = 'f44d1cab4cfa09f296ab19d09156ce1c';

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

async function initProduct(movie) {
    //console.log("MOVIE INIT", movie)
    const titleElement = document.querySelector('.title1');
    titleElement.textContent = movie.title;
    const ratingElement = document.createElement('span');
    ratingElement.className = 'rating';
    ratingElement.textContent = movie.rating;
    titleElement.appendChild(ratingElement);

    const grade = document.createElement('span');
    grade.className = 'tmdb_grade';
    const data = await tmdbData(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${movie.title}`
    ); 
    if( data.results.length != 0 ){
      grade.textContent = data.results[0].vote_average;
    }
    ratingElement.appendChild(grade);

    const poster = document.getElementById("cover");
    
    if(data.results.length !=0 && data.results[0].poster_path != null){
        poster.src = `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`; 
    } 

    const imageUrl = `https://image.tmdb.org/t/p/w500${data.results[0].backdrop_path}`;
    const heroDiv = document.querySelector(".hero");
      
    heroDiv.style.setProperty("--background-url", `url(${imageUrl})`);

    const genres = movie.listed_in.split(',')
    .map(genre => genre.trim())
    .map(genre => {
        if (genre.includes('Movies')) {
        return genre.replace(' Movies', '');
        }
        return genre;
  });

    const genresElement = document.querySelector('.genres');
    genresElement.innerHTML = '';
    genres.forEach(genre => {
      const genreTag = document.createElement('span');
      genreTag.className = 'genre_tag';
      genreTag.textContent = genre;
      genresElement.appendChild(genreTag);
    });

    const descriptionActorsElement = document.querySelector('.description-actors');
    descriptionActorsElement.innerHTML = `
      <p>${movie.description} </p>
    `;
}
const url = `http://localhost:5500/get-movie/${id}`;
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  
  }).then(response => {
    if (!response.ok) {
      throw new Error('Incorrect URL: The URL is incorrect and the server returned a ' + response.status + ' status');
    }
    return response.json();
  }).then(json => {
  
    initProduct(json[0])
     
  }).catch(err => {
    console.log(err)
  })