const db = require("../models");
const MovieCast = db.MovieCasts;

exports.getCast = async (req, res) => {
    const MovieId = req.params.MovieId

    try{
        const response = await MovieCast.findAll({where: {MovieId: MovieId}})
        res.status(200).send(response)
    }catch(err){
        res.status(500).send({message: err.message})
    }
}