module.exports = app => {
    const Casts = require('../controllers/cast.controller')

    let router = require('express').Router()

    router.post('/', Casts.addCast)

    app.use('/api/casts', router)
}