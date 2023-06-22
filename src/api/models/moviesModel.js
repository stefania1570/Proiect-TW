const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId
const getDb = require('../utils/database').getDb

class Product {

    static findByTitle(_title) { //findByName //TODO IDK??
        const db = getDb()
        const getNetflix = db.collection('Netflix').find({ title: _title }).toArray()
        const getDisney = db.collection('Disney').find({ title: _title }).toArray()
        const all = [...getNetflix,...getDisney]
        return all[0] //all ?
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

}

module.exports = Product

