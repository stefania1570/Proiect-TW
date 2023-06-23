const Movie = require("../models/moviesModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getPostData } = require("../utils/utils");

// get movies GET /get-movies
async function getMovies(req, res) {
  try {
    const movies = await Movie.findAll();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(movies));
  } catch (err) {
    console.log(err);

    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify(err));
  }
}

// get movie GET /get-movie/{id}
async function getMovie(req, res, id) { 
  try {
    let movie = await Movie.findByIdNetflix(id);
    
    //if the resulted array is [] 
    if (movie.length == 0){ 
      movie = await Movie.findByIdDisney(id);
    }
    
    if (!movie) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Movie Not Found" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(movie));
    }
  } catch (err) {
    console.log(err);

    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify(err));
  }
}


module.exports = {
  getMovies,
  getMovie,
  //getFilters
};
