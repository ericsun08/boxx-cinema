const db = require("../models");
const SavedMovie = db.SavedMovies;
const Movie = db.Movies;
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

exports.saveMovie = async (req, res) => {
    const { MovieId, UserId } = req.body

    jwt.verify(req.token, `${process.env.SECRET}`, async (err, data) => {
        if(err || (data.user.UserId !== UserId)){
          return res.status(403).send({message:'Forbidden'})
        } 

        const savedmovie = {
            MovieId: MovieId,
            UserId: UserId
        }

        try{
            await SavedMovie.create(savedmovie)
            res.status(200).send({message:'Movie Saved'})
        }catch(err){
            res.status(500).send({message:err.message})
        }
    })
}

exports.getSavedMovie = async (req, res) => {
    const UserId = req.params.UserId

    jwt.verify(req.token, `${process.env.SECRET}`, async (err, data) => {
        if(err || (data.user.UserId !== UserId)){
          return res.status(403).send({message:'Forbidden'})
        } 

        try{
            const response = await SavedMovie.findAll({
                include:[
                    {
                        as:'Movie',
                        model: Movie
                    }
                ],
                where: {UserId:UserId}
            })
            res.status(200).send({SavedMovie: response})
        }catch(err){
            res.status(500).send({message:err.message})
        }
    })
}

exports.deleteSavedMovie = (req, res) => {
    const { MovieId, UserId } = req.query

    jwt.verify(req.token, `${process.env.SECRET}`, async (err, data) => {
        if(err || (data.user.UserId !== UserId)){
          return res.status(403).send({message:'Forbidden'})
        } 

        try{
            await SavedMovie.destroy({where:{MovieId:MovieId, UserId:UserId}})
            res.status(200).send({message:'Saved Movie Deleted'})
        }catch(err){
            res.status(500).send({message:err.message})
        }
    })
}