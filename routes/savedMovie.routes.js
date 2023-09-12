module.exports = app => {
    const SavedMovies = require('../controllers/savedMovies.controller')
    const verifyToken = require('../middleware/verifyToken')

    let router = require('express').Router()

    router.post('/', verifyToken, SavedMovies.saveMovie)

    router.get('/:UserId', verifyToken, SavedMovies.getSavedMovie)

    router.delete('/', verifyToken, SavedMovies.deleteSavedMovie)

    app.use('/api/savedMovies', router)    
}
