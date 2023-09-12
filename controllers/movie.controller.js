const db = require("../models");
const Movie = db.Movies;
const MovieCast = db.MovieCasts
const Op = db.Sequelize.Op;
const path = require('path')

exports.addMovie = (req, res) => {
    if(req.files === null){
        return res.status(400).json({message: 'No File Uploaded'})
    } else {
        const Title = req.body.Title
        const Description = req.body.Description
        const Duration = req.body.Duration
        const OpeningDate = req.body.OpeningDate
        const ClosingDate = req.body.ClosingDate
        const MovieStatus = req.body.MovieStatus
        const Language= req.body.Language
        const Genre = req.body.Genre
        const CastName = req.body.CastName

        const MovieImage = req.files.MovieImage
        const fileSize = MovieImage.data.length
        const ext = path.extname(MovieImage.name)
        const fileName = MovieImage.md5 + ext
        const url = `${req.protocol}://${req.get('host')}/images/${fileName}`
        const allowedType = ['.png','.jpg','.jpeg']

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({message: 'Invalid Image'})

        if(fileSize > 5000000) return res.status(422).json({message:'Image must be less than 5 MB'})

        MovieImage.mv(`./public/images/${fileName}`, async(err) => {
            if(err) return res.status(500).json({message: err.message})

            try{
                await Movie.create({
                    MovieImage: fileName, 
                    ImageUrl: url, 
                    Title: Title, 
                    Description: Description, 
                    Duration: Duration, 
                    OpeningDate: OpeningDate,
                    ClosingDate: ClosingDate,
                    MovieStatus: MovieStatus,
                    Language: Language, 
                    Genre: Genre
                }).then(async data => {
                    for (const item of CastName){
                        
                        const cast = {
                            MovieId: data.MovieId,
                            CastName: item
                        }

                        await MovieCast.create(cast)
                    }
                })

                res.status(200).json({message: 'Movie Added'})
            } catch(err){
                res.status(500).send({message: err.message})
            }
        })
    }
}

exports.getAllMovies = async (req, res) => {
    try{
        const response = await Movie.findAll()
        res.status(200).send(response)
    } catch(err) {
        res.status(500).send({message: err.message})
    }
}

exports.getMovieById = async (req, res) => {
    const movieId = req.params.MovieId

    try{
        const response = await Movie.findOne({include: [{model: MovieCast, as: 'MovieCast'}], where: { MovieId: movieId }})

        res.status(200).send(response)
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}

exports.searchMovieTitle = (req, res) => {
    const movieTitle = req.query.movieTitle
    let condition = movieTitle ? {Title: { [Op.like]: `%${movieTitle}%` }} : null

    Movie.findAll({where: condition})
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({message: err.message})
      })
}

exports.updateMovieDetail = (req, res) => {
    const movieId = req.body.MovieId

    try{
        Movie.update(req.body, {where: {MovieId: movieId}})
          .then(data => {
            if(data.includes(1)){
                res.status(200).send({message: 'Movie details updated'})
            } else {
                res.send({message: 'Failed to update movie details'})
            }
          })
    } catch(err){
        res.status(500).send({message: err.message})
    }
}