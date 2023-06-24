const apiKey = 'f44d1cab4cfa09f296ab19d09156ce1c';


document.addEventListener('DOMContentLoaded', () => {

  var moviesSection = document.getElementById('fav1');
  var moviesContainer = moviesSection.querySelector('.movies_section');
  var tvShowsSection = document.getElementById('fav');
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
      poster.src = data.results[0].poster_path ? `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}` : `https://via.placeholder.com/500x750.png?text=Movie+Poster`; 
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

function getFavorites(){
    //get movies favorites 
    const url = `http://localhost:5500/get-api-favorites`; 
    const cookieHeader = document.cookie;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cookieHeader
        }),
    }).then(response => {
        return response.json();
        
    }).then(json => {
      const favorites = json[0] // favorites[0].type contine tipul primul show ( film sau serial )
      //console.log( json[1]) //username
      const nume = document.getElementById("nume")
      const name = document.createElement('h2');
      name.textContent = json[1];
      nume.appendChild(name);

      let i = 0;
      while(i <= favorites.length) {
        const movie = favorites[i];
        if(movie.type == "Movie"){
          addMovie(movie);
        }else {
          addTVShow(movie);
        }
        i++;
      }
      console.log(favorites)
    }).catch(err => {
        console.log(err)
    })
}

getFavorites();
});
