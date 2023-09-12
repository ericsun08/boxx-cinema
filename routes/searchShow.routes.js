module.exports = app => {
    const SearchShow = require('../controllers/searchShow.controller')

    let router = require('express').Router()

    router.get('/getScheduleByCity', SearchShow.getScheduleByCity)

    router.get('/getScheduleByThatre', SearchShow.getScheduleByTheatre)

    app.use('/api/searchShow', router)
}