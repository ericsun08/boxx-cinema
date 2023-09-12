module.exports = (sequelize, Sequelize) => {
    const Cast = sequelize.define('Cast', {
        CastId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        CastName: {
            type: Sequelize.STRING
        },
    })

    return Cast
}