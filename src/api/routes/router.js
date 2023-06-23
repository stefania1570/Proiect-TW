const { moviesRoute } = require('./moviesRoute')
const { usersRoute } = require('./usersRoute')
const { statisticsRoute } = require('./statisticsRoute')

async function router(req, res) {
    console.log(req.url);
    if (req.url === '/add-user') {
        console.log("[router] save-user api")
        usersRoute(req, res)
    } else if (req.url === '/login-user') {
        console.log("[router] login-user api")
        usersRoute(req, res)
    } else if (req.url.match(/^\/get-user\/([0-9a-z]{24})$/)) { //id in mongodb are 24 caract
        console.log("[router] get-user api")
        usersRoute(req, res)
    } 
    else if(req.url === '/get-api-user') { 
        console.log("[router] get-api-user")
        usersRoute(req, res)
    } else if (req.url === '/get-movies') { // get-movies
        console.log("[router] get-movies api")
        moviesRoute(req, res)
    } else if (req.url.match(/^\/get-movie\/([0-9a-z]{24})$/)) { //get movie by id
        console.log("[router] get-movie api")
        moviesRoute(req, res)
    } 
    else if(req.url.match(/^\/statistics\/[a-z]+/) ){ // i need to reply with a statistic
        console.log("[router] statistics api")
        statisticsRoute(req, res)
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