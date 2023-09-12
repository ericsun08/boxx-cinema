module.exports = app => {
    const Screens = require('../controllers/screen.controller')

    let router = require('express').Router()

    router.post('/', Screens.addScreen)

    router.get('/findScreenByTheatre/:theatreId', Screens.findScreenByTheatre)

    app.use('/api/screens', router)
}