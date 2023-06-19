document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'f44d1cab4cfa09f296ab19d09156ce1c';
  const moviesSection = document.getElementById('shows');
  const moviesContainer = moviesSection.querySelector('.movies_section');

  // Fetch movie data (intai listeaza pe toate apoi facem cautarea multi-criteriala daca vrem)
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&with_watch_providers=8,337`) //watch providers pt netfilx + disney+
    .then(response => response.json())
    .then(data => {

      // Loop through the movie results and create HTML elements dynamically 
      for (let i = 0; i < 20; i++) {
        const movie = data.results[i];

        const movieCard = document.createElement('div');
        movieCard.className = 'movies_card';

        const overview = document.createElement('div');
        overview.className = 'overview';

        const title = document.createElement('h2');
        title.textContent = movie.title;

        const grade = document.createElement('span');
        grade.className = 'tmdb_grade';
        grade.textContent = movie.vote_average;

        const description = document.createElement('p');
        description.textContent = movie.overview;

        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.title;

        overview.appendChild(title);
        title.appendChild(grade);
        overview.appendChild(description);
        movieCard.appendChild(poster);
        movieCard.appendChild(overview);
        moviesContainer.appendChild(movieCard);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // Fetch TV show data
  fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&with_watch_providers=8,337`)
  .then(response => response.json())
  .then(data => {

    // Loop through the movie results and create HTML elements dynamically 
    for (let i = 0; i < 20; i++) {
      const movie = data.results[i];

      const movieCard = document.createElement('div');
      movieCard.className = 'movies_card';

      const overview = document.createElement('div');
      overview.className = 'overview';

      const title = document.createElement('h2');
      title.textContent = movie.name;

      const grade = document.createElement('span');
      grade.className = 'tmdb_grade';
      grade.textContent = movie.vote_average;

      const description = document.createElement('p');
      description.textContent = movie.overview;

      const poster = document.createElement('img');
      poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      poster.alt = movie.title;

      overview.appendChild(title);
      title.appendChild(grade);
      overview.appendChild(description);
      movieCard.appendChild(poster);
      movieCard.appendChild(overview);
      moviesContainer.appendChild(movieCard);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

  // Search button event listener
  const searchBtn = document.getElementById('search-btn');
  searchBtn.addEventListener('click', () => {
    //Genre selector 
    const selectedGenres = [];
    const genreCheckboxes = document.querySelectorAll('.characters input[type="checkbox"]:checked');
    genreCheckboxes.forEach(checkbox => {
      selectedGenres.push(checkbox.id);
    });

    //Sort by selector  TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    var sortBy = "popularity.desc"; //most watched e default
    const sortByOption = document.querySelector('#sort input[name="option"]:checked');
    if(sortByOption!=null){
      sortBy = sortByOption.id;
      //console.log(sortBy);
    }

    //Platform selector 
    const selectedPlatforms = [];
    const platformCheckboxes = document.querySelectorAll('#platform input[type="checkbox"]:checked');
    platformCheckboxes.forEach(checkbox => {
      selectedPlatforms.push(checkbox.id);
    });

    //Selectare dupa note
    const selectedRatings = [];
    const ratingCheckboxes = document.querySelectorAll('#rating input[type="checkbox"]:checked');
    ratingCheckboxes.forEach(checkbox => {
      selectedRatings.push(checkbox.id);
    });
    console.log(selectedRatings);


    // Perform the search with the selected criteria
    performSearch(selectedGenres, sortBy, selectedPlatforms, selectedRatings);
  });

  function performSearch(genres, sortBy, platforms, ratings) {//sortBy,
    // Build the query URL with the selected criteria
    let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=${sortBy}`;//&sort_by=${sortBy} - daca e by popularity las aici, restul in alta functie

    // Append the genre IDs to the URL
    if (genres.length > 0) {
      const genreIds = genres.map(genre => getGenreId(genre)).join(',');
      apiUrl += `&with_genres=${genreIds}`;
    }

    // Append the platforms to the URL
    if (platforms.length > 0) {
      let platformIds;
      if(platforms.length==2){
        platformIds = platforms.map(platform => getPlatformId(platform)).join(',');
      } else{
        platformIds=getPlatformId(platforms[0]);
      }
      apiUrl += `&with_watch_providers=${platformIds}`;
      //console.log(platformIds);
    }

    // Append the ratings to the URL
    //Aici trb sa ia cea mai mica valoare din numerele alese ca sa puna in url vote average greater than or equal to ....
    if (ratings.length > 0) {
      const ratingValues = ratings.map(rating => parseInt(rating));
      const leastRating = parseInt(Math.min(...ratingValues));
      apiUrl += `&vote_average.gte=${leastRating}`;
    }

    // Fetch the search results
    console.log(apiUrl);
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Clear the previous search results
        const moviesContainer = document.querySelector('#shows .movies_section');
        moviesContainer.innerHTML = "";

        // Loop through the movie results and create HTML elements dynamically
        for (let i = 0; i < data.results.length; i++) {
          const movie = data.results[i];

          const movieCard = document.createElement('div');
          movieCard.className = 'movies_card';

          const overview = document.createElement('div');
          overview.className = 'overview';

          const title = document.createElement('h2');
          title.textContent = movie.title;

          const grade = document.createElement('span');
          grade.className = 'tmdb_grade';
          grade.textContent = movie.vote_average;

          const description = document.createElement('p');
          description.textContent = movie.overview;

          const poster = document.createElement('img');
          if (movie.poster_path) {
            poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
          } else {
            poster.src = 'https://via.placeholder.com/500x750.png?text=Placeholder+Poster'; // Replace with the path to your placeholder image
          }
          poster.alt = movie.title;

          overview.appendChild(title);
          title.appendChild(grade);
          overview.appendChild(description);
          movieCard.appendChild(poster);
          movieCard.appendChild(overview);
          moviesContainer.appendChild(movieCard);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function getGenreId(genre) {
    switch (genre) {
      case 'a':
        return 28; // Action
      case 'b':
        return 12; // Adventure
      case 'c':
        return 35; // Comedy
      case 'd':
        return 80; // Crime
      case 'e':
        return 99; // Documentary
      case 'f':
        return 18; // Drama
      case 'g':
        return 14; // Fantasy
      case 'h':
        return 36; // History
      default:
        return null;
    }
  }

  function getPlatformId(platform) {
    switch (platform) {
      case 'Netflix':
        return 8; 
      case 'Disney+':
        return 337; 
      default:
        return null;
    }
  }
});
