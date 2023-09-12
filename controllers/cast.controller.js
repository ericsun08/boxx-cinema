const db = require("../models");
const Cast = db.Casts;

exports.addCast = (req, res) => {
    const cast = {
        CastName: req.body.CastName
    }

    try{
        Cast.create(cast)
    }catch(err){
        res.status(500).send({message: err.message})
    }

    res.send({message: 'Cast Added'})
}