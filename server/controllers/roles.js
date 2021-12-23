const {Role} = require('../models/models.js');

class Roles{
    async getRoles(req, res) {
        try{
            const result = await Role.findAll();
            res.status(200).json(result);
        } catch(error){
            res.json({message: error.message});
        }
    }
}

module.exports = new Roles();