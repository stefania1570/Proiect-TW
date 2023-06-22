const {getMovies, getMovie } = require('../controllers/moviesController')
var sanitize = require('mongo-sanitize')

function moviesRoute(req, res) {
    
    if(req.url === '/get-movies' && req.method === 'GET') {
        getMovies(req, res)
    } else if(req.url.match(/^\/get-movie\/([0-9a-z]{24})$/) && req.method === 'GET') {
        const id = sanitize(req.url.split('/')[2]) //is used for sanitizing user input to prevent potential MongoDB injection attacks
        getMovie(req, res, id)
    } 
    //TODO: filtrare

    else {
        res.writeHead(404, {'Content-Type': 'text/html'})
        res.end(JSON.stringify({message: 'Route Not Found'}))
    }
}

module.exports = {
    moviesRoute
}