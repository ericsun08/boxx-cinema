module.exports = app => {
    const Bookings = require('../controllers/booking.controller')
    const verifyToken = require('../middleware/verifyToken')

    let router = require('express').Router()

    router.post('/', verifyToken, Bookings.addBooking)

    router.get('/:UserId', verifyToken, Bookings.getBooking)

    router.get('/tickets/:UserId', verifyToken, Bookings.getTicketList)

    router.put('/pay', verifyToken, Bookings.payTickets)

    router.delete('/', verifyToken, Bookings.abortBooking)

    app.use('/api/bookings', router)    
}