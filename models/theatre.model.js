module.exports = (sequelize, Sequelize) => {
    const Theatre = sequelize.define('Theatre', {
        TheatreId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        TheatreName: {
            type: Sequelize.STRING
        },
        Price: {
            type: Sequelize.INTEGER
        },
        TheatreAddress: {
            type: Sequelize.STRING
        },
    })
    return Theatre
}