module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        UserId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        FirstName: {
            type: Sequelize.STRING
        },
        LastName: {
            type: Sequelize.STRING
        },
        Address: {
            type: Sequelize.STRING
        },
        Email: {
            type: Sequelize.STRING
        },
        PhoneNumber: {
            type: Sequelize.STRING
        },
        Password: {
            type: Sequelize.STRING
        },
    })
    return User
}