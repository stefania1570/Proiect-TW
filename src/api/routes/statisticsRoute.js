const { getHorror, getTop10, getHowMany }=require( '../controllers/statisticsController')

async function statisticsRoute(req, res){
    if(req.url === '/statistics/horror' && req.method === 'POST') {
        console.log('/statistics/horror route')
        getHorror(req, res)
    }
    else if(req.url === '/statistics/top10' && req.method === 'POST') {
        console.log('/statistics/top10 route')
        getTop10(req, res)
    }
    else if(req.url === '/statistics/howmany' && req.method === 'POST') {
        console.log('/statistics/howmany route')
        getHowMany(req, res)
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/html'})
        res.end(JSON.stringify({message: 'Fake statistic request'}))
    }
    return
}
module.exports = {
    statisticsRoute
}