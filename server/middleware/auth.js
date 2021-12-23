const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];

        let decodedData = jwt.verify(token, 'bd_project');

        if(decodedData){
            req.user_id = decodedData.id;
            req.role_id = decodedData.role_id;
        }

        next();
    } catch(error){
        console.log(error);
    }
}

module.exports = auth;