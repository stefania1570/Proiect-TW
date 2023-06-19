//mainPageList.js e pt prima pagina cand trb sa dea doar primele 8 filme + primele 8 seriale
//in selection.js o sa se faca o cautare multi-criteriala a datelor

  document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'f44d1cab4cfa09f296ab19d09156ce1c';
  
    // Parse the CSV file
    function parseCSV(csvData) {
      const lines = csvData.split('\n');
      const movies = [];
      const tvShows = [];
  
      for (let i = 1; i < 40; i++) {
        const [showId, type, title, director, cast, country, dateAdded, releaseYear, rating, duration, listedIn, description] = parseCSVLine(lines[i]);
        const show = {
          id: showId,
          type: type,
          title: title,
          director: director,
          cast: cast,
          country: country,
          dateAdded: dateAdded,
          releaseYear: releaseYear,
          rating: rating,
          duration: duration,
          listedIn: listedIn,
          description: description,
        };
  
        if (show.type === 'Movie') {
          movies.push(show);
        } else if (show.type === 'TV Show') {
          tvShows.push(show);
        }
      }
      return { movies, tvShows }; 
    }
    
    // Asta pt ca in csv aveam sectiunea de cast unde erau "... , ... , ... etc." si nu facea split cum trb dupa virgula
    function parseCSVLine(line) {
      const values = [];
      let currentValue = '';
      let withinQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const currentChar = line[i];

        if (currentChar === ',') {
          if (withinQuotes) {
            currentValue += currentChar;
          } else {
            values.push(currentValue);
            currentValue = '';
          }
        } else if (currentChar === '"') {
          withinQuotes = !withinQuotes;
        } else {
          currentValue += currentChar;
        }
      }

      values.push(currentValue);

      return values;
    }
  
    //Fetch poster data + grade from TMDB (momentan doar poster-ul + nota film)
    function fetchTMDBData(shows) {
      const promises = shows.map(show => {
        const query = encodeURIComponent(show.title);
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}`;
  
        return fetch(url)
          .then(response => response.json())
          .then(data => {
            if (data.results && data.results.length > 0) {
              const result = data.results[0];
              show.posterPath = result.poster_path;
              show.voteAverage = result.vote_average;
            } 
            return show; // Return the updated show object
          });
      });
  
      return Promise.all(promises);
    }
  
    // Fetch Netflix CSV file data
    fetch('netflix_titles.csv')
      .then(response => response.text())
      .then(netflixCsvData => {
        // Fetch Disney+ CSV file data
        fetch('disney_plus_titles.csv')
          .then(response => response.text())
          .then(disneyPlusCsvData => {
            // Combine Netflix and Disney+ data
            const netflixData = parseCSV(netflixCsvData);
            const disneyPlusData = parseCSV(disneyPlusCsvData);
            const { movies: netflixMovies, tvShows: netflixTvShows } = netflixData;
            const { movies: disneyPlusMovies, tvShows: disneyPlusTvShows } = disneyPlusData;
  
            const allMovies = [...netflixMovies, ...disneyPlusMovies];
            const allTvShows = [...netflixTvShows, ...disneyPlusTvShows];
  
            // Fetch TMDB data for movies
            fetchTMDBData(allMovies)
              .then(movies => {
                const moviesSection = document.getElementById('movies');
                const moviesContainer = moviesSection.querySelector('.movies_section');
  
                // Creare elemente dinamic 
                for (let i = 0; i < 8; i++) {
                  const movie = movies[i];
  
                  const movieCard = document.createElement('div');
                  movieCard.className = 'movies_card';
  
                  const overview = document.createElement('div');
                  overview.className = 'overview';
  
                  const title = document.createElement('h2');
                  title.textContent = movie.title;
  
                  const grade = document.createElement('span');
                  grade.className = 'tmdb_grade';
                  grade.textContent = movie.voteAverage;
  
                  const description = document.createElement('p');
                  description.textContent = movie.description;
  
                  const poster = document.createElement('img');
                  poster.src = movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : `https://via.placeholder.com/500x750.png?text=Movie+Poster`;
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
  
            // Fetch TMDB data for TV shows
            fetchTMDBData(allTvShows)
              .then(tvShows => {
                const tvShowsSection = document.getElementById('tv-shows');
                const tvShowsContainer = tvShowsSection.querySelector('.tv-shows_section');
  
                // Creare elemente dinamic
                for (let i = 0; i < 8; i++) {
                  const show = tvShows[i];
  
                  const showCard = document.createElement('div');
                  showCard.className = 'tv-shows_card';
  
                  const overview = document.createElement('div');
                  overview.className = 'overview';
  
                  const title = document.createElement('h2');
                  title.textContent = show.title;
  
                  const grade = document.createElement('span');
                  grade.className = 'tmdb_grade';
                  grade.textContent = show.voteAverage;
  
                  const description = document.createElement('p');
                  description.textContent = show.description;
  
                  const poster = document.createElement('img');
                  poster.src = show.posterPath ? `https://image.tmdb.org/t/p/w500${show.posterPath}` : `https://via.placeholder.com/500x750.png?text=TV+Show+Poster`;
                  poster.alt = show.title;
  
                  overview.appendChild(title);
                  title.appendChild(grade);
                  overview.appendChild(description);
                  showCard.appendChild(poster);
                  showCard.appendChild(overview);
                  tvShowsContainer.appendChild(showCard);
                }
              })
              .catch(error => {
                console.error('Error:', error);
              });
          })
          .catch(error => {
            console.error('Error:', error);
          });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  
   });
