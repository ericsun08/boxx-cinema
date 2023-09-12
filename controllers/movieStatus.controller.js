const db = require("../models");
const MovieStatus = db.MovieStatus;

exports.addStatus = (req, res) => {
    const status = {
        Status: req.body.Status
    }

    try{
        MovieStatus.create(status)
    }catch(err){
        res.status(500).send({message: err.message})
    }

    res.send({message: 'Status Added'})
      
}