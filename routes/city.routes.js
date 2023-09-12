module.exports = app => {
    const Cities = require('../controllers/city.controller')

    let router = require('express').Router()

    router.post('/', Cities.createCity)

    router.get('/findAllCity', Cities.getAllCity)

    app.use('/api/cities', router)
}