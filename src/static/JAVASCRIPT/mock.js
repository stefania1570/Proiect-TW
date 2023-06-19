function performSearch(genres, sortBy, platforms, ratings) {
    // Parse the CSV file based on selected platforms
  const promises = [];

  if (selectedPlatforms.includes('Netflix')) {
    promises.push(
      fetch('netflix_titles.csv')
        .then(response => response.text())
        .then(data => parseCSV(data))
        .then(shows => filterShowsByGenres(shows, selectedGenres))
        .then(shows => fetchTMDBData(shows))
    );
  }
  if (selectedPlatforms.includes('Disney+')) {
    promises.push(
      fetch('disney_plus_titles.csv')
        .then(response => response.text())
        .then(data => parseCSV(data))
        .then(shows => filterShowsByGenres(shows, selectedGenres))
        .then(shows => fetchTMDBData(shows))
    );
  }
  Promise.all(promises)
    .then(results => {
      const shows = results.flat(); // Merge the results from multiple promises

      // Display the shows
      moviesContainer.innerHTML = '';
      shows.forEach(show => {
        const movieCard = createMovieCard(show);
        moviesContainer.appendChild(movieCard);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });

    function filterShowsByGenres(shows, selectedGenres) {
        return shows.filter(show => {
          // Check if at least one genre of the show is included in the selected genres
          const showGenres = show.listedIn.split(',').map(genre => genre.trim());
          for(let i=1;i<=selectedGenres.length;i++){
            if(showGenres[i].cont)
          }


          return showGenres.some(genre => selectedGenres.includes(genre));
        });
      }
















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