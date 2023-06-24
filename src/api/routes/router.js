const { moviesRoute } = require('./moviesRoute')
const { usersRoute } = require('./usersRoute')
const { favRoute } = require('./favoritesRoute')
const { statisticsRoute } = require('./statisticsRoute')

async function router(req, res) {

    if (req.url === '/add-user') { //register
        console.log("[router] save-user route")
        usersRoute(req, res)
    } else if (req.url === '/login-user') { //login
        console.log("[router] login-user route")
        usersRoute(req, res)
    } else if (req.url === '/get-movies') { // get-movies
        console.log("[router] get-movies route")
        moviesRoute(req, res)
    } else if (req.url.match(/^\/get-movie\/([0-9a-z]{24})$/)) { //get movie by id
        console.log("[router] get-movie by id route")
        moviesRoute(req, res)
    } 
    else if(req.url.match(/^\/statistics\/[a-z]+/) ){ // i need to reply with a statistic
        console.log("[router] statistics api")
        statisticsRoute(req, res)
    } 
    else if(req.url === '/get-api-favorites') { //get movies+tv shows pt un user
        console.log("[router] get-api-favorites")
        favRoute(req, res)
    } else if (req.url === '/add-fav') { //adauga la favorite
        console.log("[router] save-fav route")
        favRoute(req, res)
    } else if(req.url === '/delete-api-fav') { //sterge de la favorite
        console.log("[router] delete-api-fav")
        favRoute(req, res)
    }
    else {
        console.log("[router] 404 error Page Not Found")
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: "Page not found" }))
    }
}

module.exports = {
    router
}