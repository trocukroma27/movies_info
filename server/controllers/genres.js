const {Genre} = require('../models/models.js');

class Genres{
    async getGenres(req, res) {
        try{
            const result = await Genre.findAll();
            res.status(200).json(result);
        } catch(error){
            res.json({message: error.message});
        }
    }
}

module.exports = new Genres();