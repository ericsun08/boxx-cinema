module.exports = app => {
    const MovieStatus = require('../controllers/movieStatus.controller')

    let router = require('express').Router()

    router.post('/', MovieStatus.addStatus)

    app.use('/api/movieStatus', router)    
}