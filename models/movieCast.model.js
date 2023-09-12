module.exports = (sequelize, Sequelize) => {
    const MovieCast = sequelize.define('MovieCast', {
        MovieCastId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        CastName: {
            type: Sequelize.STRING
        },
    },
    )

    return MovieCast
}