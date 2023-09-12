const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    try{
        let header = req.headers['authorization']
        if(typeof token !== undefined){
            const bearer = header.split(' ')
            const token = bearer[1]

            req.token = token 
            next()
        } else {
            res.sendStatus(403)
        }
    } catch (err){
        res.status(401).json({"msg":"Couldnt Authenticate"});
    }
}

module.exports = verifyToken