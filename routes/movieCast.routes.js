module.exports = app => {
    const MovieCasts = require('../controllers/movieCast.controller')

    let router = require('express').Router()

    router.get('/:MovieId', MovieCasts.getCast)

    app.use('/api/movieCasts', router)
}