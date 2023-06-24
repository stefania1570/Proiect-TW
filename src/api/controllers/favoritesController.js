const Favorites = require("../models/favoritesModel");
const Movies = require("../models/moviesModel");
const { getPostData } = require("../utils/utils");
const Users = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const Movie = require("../models/moviesModel");

// get favs GET /get-api-favorites
async function getApiFavorites(req, res,type) {
  try {
    // userId il iau din token-ul din cookie...
    const body = await getPostData(req);
    const { cookieHeader } = JSON.parse(body);

    let value = ""
    let token = ""
    console.log("headers:", req.headers)
    console.log("cookieHeader:", cookieHeader)
    
    if(cookieHeader) {
      cookieHeader.split(`;`).forEach(cookie => {
        let [name, ...rest] = cookie.split(`=`)
        if(name === "jwt") {
          value = rest.join(`=`).trim()
          if(value) {
            token =  decodeURIComponent(value)
          }
        }
      });
    }
    
    if(value === "" || value === "undefined") {
      res.writeHead(401, { "Content-Type": "application/json"});
      res.end(JSON.stringify({ route: "/views/login.html", message: "You must login to view the Favorite List!" }));
    }
    else {
      // decodificare token preluat din cookie
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      const userId = decodedToken['data']['id']
      console.log("[userid:]", userId);
      const message = "message"
      // filmele favorite pt userId-ul utilizatorului care este logat in sesiunea curenta
      var favoriteMovies = await Favorites.findAllByUserIdType(userId, 'Movie');
      var favoriteShows = await Favorites.findAllByUserIdType(userId, 'TV Show');
      var fakeFavorites = await favoriteMovies.concat(favoriteShows);
      var favorites = [];
      for( let i = 0 ; i < fakeFavorites.length; i++){
        var id = fakeFavorites[i].movieId;
        var movie = await Movies.findById(id)
        favorites.push(movie[0])
      }
      console.log("[favorites:]", favorites);
      var name = await Users.findById(userId)
      // console.log("[favorites:] userID:", userId)
      // console.log("[favorites: ]name:", name[0].username)
      res.writeHead(200, { "Content-Type": "application/json"});
      await res.end(JSON.stringify([favorites, name[0].username]));
    }
  } catch (err) {
    console.log(err);

    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify(err));
  }
}

// create fav POST /add-fav

async function saveFav(req, res) {
  try {
    const body = await getPostData(req);
    const { clickedMovieId, cookieHeader } = JSON.parse(body);

    let value = ""
    let token = ""
    
    if(cookieHeader) {
      cookieHeader.split(`;`).forEach(cookie => {
        let [name, ...rest] = cookie.split(`=`)
        if(name === "jwt") {
          value = rest.join(`=`).trim()
          if(value) {
            token =  decodeURIComponent(value)
          }
        }
      });
    }
    
    if(value === "" || value === "undefined") {
      res.writeHead(401, { "Content-Type": "application/json"});
      res.end(JSON.stringify({ route: "/views/login.html", message: "You must login to add a movie to favorite list!" }));
    }
    else {
      // decodificare token preluat din cookie
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      // user id care e logat
      const userId = decodedToken['data']['id']
      //console.log(userId); [jwt, ceva]
  
      //cautam filmul ca sa gasim tipul (movie/tv show) 
        var movie = await Movies.findByIdNetflix(clickedMovieId);
        
        if(movie.length == 0){
          movie = await Movies.findByIdDisney(clickedMovieId);
        }
        const type = movie[0].type;
  
        // cauta daca filmul exista deja in lista de favorite
        const isMovieFav = await Favorites.findByUserIdMovieId(userId, clickedMovieId)
  
        // verifica daca filmul e deja in lista
        if(!isMovieFav.length) {
      
          // adauga filmul in lista
          const fav = new Favorites(userId, clickedMovieId, type);
          fav.save();
  
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(fav));
        }
        else {
          res.writeHead(204, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ route: "/views/movie.html", message: "Movie already exists in favorite list!" }));
        }
    }
  } catch (err) {
    console.log(err);

    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify(err));
  }
}

// delete movie DELETE /delete-api-fav
async function deleteMovieFav(req, res) {
  
  try {
    const body = await getPostData(req);
    const { clickedMovieId, cookieHeader } = JSON.parse(body);

    //intai afla utilizatorul, apoi sterge
    let value = ""
    let token = ""
    
    if(cookieHeader) {
      cookieHeader.split(`;`).forEach(cookie => {
        let [name, ...rest] = cookie.split(`=`) 

        if(name === "jwt") {
          value = rest.join(`=`).trim()
          if(value) {
            token =  decodeURIComponent(value)
          }
        }
      });
    }
    
    if(value === "" || value === "undefined") {
      res.writeHead(401, { "Content-Type": "application/json"});
      res.end(JSON.stringify({ route: "/views/login.html", message: "You must login to add a movie to favorite list!" }));
    }
    else {
      // decodificare token preluat din cookie
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      // user id care e logat
      const userId = decodedToken['data']['id']
  
        // cauta daca filmul exista in lista de favorite
        const isMovieFav = await Favorites.findByUserIdMovieId(userId, clickedMovieId)
        //console.log("[favoritesController - delete] isMovieFav:",isMovieFav)
        const favId = isMovieFav[0]._id;
        //console.log("[favoritesController - delete] favId:", favId)
  
        if(isMovieFav.length==1) {
      
          // stege din lista
          const nr = await Favorites.remove(favId)
  
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({message:`Favorites movie/tv show ${favId} removed.`}));
        }
        else {
          res.writeHead(204, { "Content-Type": "application/json" });
          res.end(JSON.stringify({message:'Movie not found.'}));
        }
    }
  } catch (err) {
    console.log(err);

    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify(err));
  }
}

module.exports = {
  saveFav,
  deleteMovieFav,
  getApiFavorites,
};

