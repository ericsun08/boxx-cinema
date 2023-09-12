module.exports = app => {
    const Theatres = require('../controllers/theatre.controller')

    let router = require('express').Router()

    router.post('/', Theatres.createTheatre)

    router.get('/findTheatreByCity', Theatres.findTheatreByCity)

    router.put('/updateTheatre/:theatreId', Theatres.updateTheatre)

    router.delete('/deleteTheatre/:theatreId', Theatres.deleteTheatre)

    app.use('/api/theatres', router)
}