const fs = require('fs')
function indexRoute(req, res){
    res.writeHead(200, { "Content-Type": "text/html"});
    fs.readFile('../views/index.html', 'utf8', function(err, data){
    res.end(data);
    });
    console.log('readFile called');
    }
module.exports ={indexRoute}