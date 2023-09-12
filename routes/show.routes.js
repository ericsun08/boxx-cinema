module.exports = app => {
    const Shows = require('../controllers/show.controller')

    let router = require('express').Router()

    router.post('/', Shows.addShow)

    app.use('/api/shows', router)
}