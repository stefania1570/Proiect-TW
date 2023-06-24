const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId
const getDb = require('../utils/database').getDb

class Movie {

    static findByTitle(_title) { 
        const db = getDb()
        const getNetflix = db.collection('Netflix').find({ title: _title }).toArray()
        const getDisney = db.collection('Disney').find({ title: _title }).toArray()
        const all = [...getNetflix,...getDisney]
        return all[0] 
    }
    
    static findAll() {
        const db = getDb()
        const getNetflix = db.collection('Netflix').find().toArray()
        const getDisney = db.collection('Disney').find().toArray()
        return Promise.all([getNetflix, getDisney])
            .then(([netflixMovies, disneyMovies]) => {
                const allMovies = [...netflixMovies, ...disneyMovies];
                return allMovies;
            })
            .catch(error => {
                console.error('Error retrieving movies:', error);
                throw error; // Rethrow the error to propagate it to the caller
            });
    }

    static findByIdNetflix(id) { 
        const db = getDb()
        return db.collection('Netflix').find(ObjectId(id)).toArray()
    }

    static findByIdDisney(id) { 
        const db = getDb()
        return db.collection('Disney').find(ObjectId(id)).toArray()
    }

    static async findById(id){
        const db = await getDb()
        var netflix = await db.collection('Netflix').find({_id : id}).toArray();
        var disney =  await db.collection('Disney').find({_id : id}).toArray();
        netflix.concat(disney)
        return netflix
    }

    static async findHorror(year1, year2){
        const db = await getDb()
        let yearsArray = [];
        let avgsArray = []; 
        //console.log(year1, year2)
        year1 = year1 -1 +1; // I SWEAR TO GOT IT JUST WORKS, DACA NU FAC ASTA NU IMI AFISEAZA FILMELE DIN PRIMUL AN, COMMENT IT IF YOU DARE
        for(let targetYear = year1; targetYear <= year2; targetYear++){
        yearsArray[yearsArray.length] = targetYear;
        //console.log("THE MOVIES OF", targetYear, "__________________________________________________________")
        const resultNetflix = await db.collection('Netflix').find({release_year: targetYear, type: 'Movie'}).toArray();
        let sum = 0;
        let count = 0;
        await resultNetflix.forEach(element => {
            if(element.listed_in.includes("Horror")){
            //console.log("Title", element.title, "; Genre", element.listed_in, "; Duration", element.duration, "; Year", element.release_year)
            element.duration = element.duration.substring(0,3).trim()
            if(element.duration[1] == ' ')
            element.duration = element.duration.substring(0,1)
            sum += parseInt(element.duration)
            count++;
            }
        });
        avgsArray[avgsArray.length] = sum / count || 0;
        //console.log("AVERAGE LENGTH FOR",targetYear,":",sum/count, "minutes");
        }
        return {yearsArray, avgsArray}
    }
    static async findHowMany(genre, year){
        console.log("genre:",genre)
        console.log("year:",year)
        const db = await getDb()
        let valuesArray = [0, 0];
        let targetYear = parseInt(year)
        let companiesArray = ["Netflix", "Disney"]; 
        const resultNetflix = await db.collection('Netflix').find({release_year: targetYear}).toArray();
        const resultDisney = await db.collection('Disney').find({release_year: targetYear}).toArray();
        await resultNetflix.forEach(element => {
            if(element.listed_in.includes(genre)){
                //console.log("Title:",element.title,"genre:",element.listed_in)
                valuesArray[0]++;
            }
        });
        await resultDisney.forEach(element => {
            if(element.listed_in.includes(genre)){
                //console.log("Title:",element.title,"genre:",element.listed_in)
                valuesArray[1]++;
            }
        });
        return {companiesArray, valuesArray}
    }
    static async findTop10(category){
        if(category === "Sum of movie durations"){
            const db = await getDb()
            let directorsArray = []
            const resultNetflix = await db.collection('Netflix').find().toArray();
            await resultNetflix.forEach(element => {
                if(!(typeof element.director === 'undefined')){
                    if( element.director.includes(',')){
                        let tempDirectorsArray = element.director.split(', ')
                        tempDirectorsArray.forEach( director =>{
                            directorsArray[directorsArray.length] = director
                        })
                    }
                    else{
                        directorsArray[directorsArray.length] = element.director;
                    }
                }
            });
            const resultDisney = await db.collection('Disney').find().toArray();
            await resultDisney.forEach(element => {
                if(!(typeof element.director === 'undefined')){
                    if( element.director.includes(',')){
                        let tempDirectorsArray = element.director.split(', ')
                        tempDirectorsArray.forEach( director =>{
                            directorsArray[directorsArray.length] = director
                        })
                    }
                    else{
                        directorsArray[directorsArray.length] = element.director;
                    }
                }
            });
            let uniqueDirectorsArray = Array.from(new Set(directorsArray))
            //console.log("THE SIZE OF THE ARRAY:",uniqueDirectorsArray.length)
            let valuesArray = []
            for(let i = 0; i < uniqueDirectorsArray.length; i++){
                valuesArray[i] = parseFloat(0);
            }
            //console.log(valuesArray)
            const allShows = await db.collection('Disney').aggregate([
                { $unionWith: {coll: 'Netflix'}}
            ])
             while(await allShows.hasNext()){
                let element = await allShows.next()
                if((!(typeof element.duration === 'undefined')) && element.type === "Movie" && element.duration.includes('min')){
                    element.duration = element.duration.substring(0,3).trim()
                    if(element.duration[1] == ' ')
                    element.duration = element.duration.substring(0,1)
                    let duration = parseInt(element.duration) // the duration of the movie
                    //console.log(duration)
                    if(!(typeof element.director === 'undefined')){
                        if( element.director.includes(',')){
                            let tempDirectorsArray = element.director.split(', ')
                            await tempDirectorsArray.forEach( director =>{
                                valuesArray[uniqueDirectorsArray.indexOf(director)] += duration
                            })
                        }
                        else{
                            valuesArray[uniqueDirectorsArray.indexOf(element.director)] += duration
                        }
                    }
                   
                }
            }
            
            uniqueDirectorsArray.sort((a, b) => valuesArray[uniqueDirectorsArray.indexOf(b)] - valuesArray[uniqueDirectorsArray.indexOf(a)])
            valuesArray.sort((a, b) => b - a)
            uniqueDirectorsArray = uniqueDirectorsArray.slice(0, 10);
            //console.log(uniqueDirectorsArray)
            valuesArray = valuesArray.slice(0, 10);
            //console.log(valuesArray)
            return {uniqueDirectorsArray, valuesArray}
        }
    }
}
module.exports = Movie

