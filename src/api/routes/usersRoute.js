const { saveUser, loginUser } = require('../controllers/usersController')

function usersRoute(req, res) {
    if(req.url === '/add-user' && req.method === 'POST') { // register
        saveUser(req, res)
    }
    else if(req.url === '/login-user' && req.method === 'POST') {
        loginUser(req, res)
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'})
        res.end(JSON.stringify({message: 'Route Not Found'}))
    }
}

module.exports = {
    usersRoute
}