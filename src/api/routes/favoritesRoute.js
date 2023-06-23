const { saveFav, deleteMovieFav, getApiFavorites} = require('../controllers/favoritesController') 
var sanitize = require('mongo-sanitize')

function favRoute(req, res) {
    if(req.url === '/get-api-favorites' && req.method === 'POST') {
        getApiFavorites(req, res,'Movie')
    }
    // if(req.url.match(/^\/get-movies-favorites\/([0-9a-z]{24})$/) && req.method === 'GET') {  //get fav movies/userId

    //     const userId = sanitize(req.url.split('/')[2])
    //     getFavorites(req, res, userId,'Movie')

    // } else if(req.url.match(/^\/get-shows-favorites\/([0-9a-z]{24})$/) && req.method === 'GET') { //get fav tv shows/userId

    //     const userId = sanitize(req.url.split('/')[2])
    //     getFavorites(req, res, userId,'TV Show')
    // }
    else if(req.url === '/add-fav' && req.method === 'POST') { //adauga la favorite
        console.log("[favoritesRoute]: saveFav");
        saveFav(req, res)
    }
    else if(req.url === '/delete-api-fav' && req.method === 'DELETE') { //sterge de la favorite
        console.log("[favoritesRoute]: deleteFav")
        deleteMovieFav(req, res)
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/html'})
        res.end(JSON.stringify({message: 'Route Not Found'}))
    }
}

module.exports = {
    favRoute
}