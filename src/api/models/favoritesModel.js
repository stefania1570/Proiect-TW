const mongodb = require('mongodb')
var ObjectId = mongodb.ObjectId
const getDb = require('../utils/database').getDb

class Favorites {
    constructor(userId, movieId, type) {
        this.userId = ObjectId(userId)
        this.movieId = ObjectId(movieId)
        this.type = type; //string Movies/TV Shows
    }

    save() {
        const db = getDb()
        return db.collection('Favorites').insertOne(this)
    }

    //verificare daca (userId, movieId) exista deja in colectia Favorites
    static findByUserIdMovieId(userId, movieId) {
        const db = getDb()
        return db.collection('Favorites').find({userId: ObjectId(userId), movieId: ObjectId(movieId)}).toArray()
    }

    //dupa user id gaseste toate serialele preferate/toate filmele preferate
    static findAllByUserIdType(favUserId,favType){
        const db = getDb()
        return db.collection('Favorites').find({userId: ObjectId(favUserId), type: favType}).toArray()
    }

    static async remove(id) {
        const db = getDb()
        const collection = db.collection('Favorites')
        return collection.deleteOne({_id: ObjectId(id)})
    }

    // pentru un user, gaseste toate inregistrarile din lista de favorite de tip movie/ de tip tv show
    static findAllByType(favUserId, favType) {
        const db = getDb()
        return db.collection('Favorites').find({userId: ObjectId(favUserId), type: favType}).toArray()
    }


      
   
}

module.exports = Favorites

