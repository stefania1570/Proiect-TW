const Movie = require("../models/moviesModel");
const { getPostData } = require("../utils/utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

async function getHorror(req, res){
    try{
    const body = await getPostData(req);
    const { year1, year2, type } = JSON.parse(body);
    // aici ar trebui sa imi returneze un array cu lungimea medie a filmelor de groaza si anii respectivi
    const {yearsArray, avgsArray} = await Movie.findHorror(year1, year2)
    console.log(yearsArray)
    console.log(avgsArray)
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify([yearsArray, avgsArray]))
    }
    catch (err) {
        console.log(err);
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({message: 'Not implemented yet'}))
    }
}  
async function getTop10(req, res){
    try{
    const body = await getPostData(req);
    const { category, type } = JSON.parse(body);
    const { uniqueDirectorsArray, valuesArray} = await Movie.findTop10(category)
    console.log( uniqueDirectorsArray )
    console.log( valuesArray )
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify([uniqueDirectorsArray, valuesArray]))
    }
    catch (err){
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(JSON.stringify({message: 'Not implemented yet'}))
    }
}
async function getHowMany(req, res){
    try{
    const body = await getPostData(req);
    const { genre, year, type } = JSON.parse(body);
    const { companiesArray, valuesArray } = await Movie.findHowMany(genre, year)
    console.log(companiesArray)
    console.log(valuesArray)
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify([companiesArray, valuesArray]))
    }
    catch(err){
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(JSON.stringify({message: 'Not implemented yet'}))
    }
}
module.exports = {
    getHorror,
    getTop10,
    getHowMany
}