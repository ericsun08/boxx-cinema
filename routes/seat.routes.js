module.exports = app => {
    const Seats = require('../controllers/seat.controller')

    let router = require('express').Router()

    router.post('/', Seats.addSeats)

    router.get('/seatView', Seats.getSeatsView)

    app.use('/api/seats', router)
}