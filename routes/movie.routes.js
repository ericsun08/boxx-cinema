module.exports = app => {
    const Movies = require('../controllers/movie.controller')

    let router = require('express').Router()

    router.post('/', Movies.addMovie)

    router.get('/', Movies.getAllMovies)

    router.get('/getMovieById/:MovieId', Movies.getMovieById)

    router.get('/searchMovieTitle', Movies.searchMovieTitle)

    router.put('/updateMovie', Movies.updateMovieDetail)

    app.use('/api/movies', router)
}