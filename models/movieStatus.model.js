module.exports = (sequelize, Sequelize) => {
    const MovieStatus = sequelize.define('MovieStatus', {
        MovieStatusId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        Status: {
            type: Sequelize.STRING
        },
    })
    return MovieStatus
}