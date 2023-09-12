module.exports = app => {
    const Users = require('../controllers/user.controller')
    const verifyToken = require('../middleware/verifyToken')

    let router = require('express').Router()

    router.post('/', Users.create)

    router.post('/userLogin', Users.userLogin)

    router.get('/loggedInUser', verifyToken, Users.loggedInUser)

    router.put('/updateUser/:userId', verifyToken, Users.updateUser)

    router.put('/changePassword/:userId', verifyToken, Users.changePassword)

    router.get('/', Users.findAll)

    app.use('/api/users', router)
}