module.exports = (sequelize, Sequelize) => {
    const Booking = sequelize.define('Booking', {
        BookingId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        Status: {
            type: Sequelize.STRING,
        },
        MovieId: {
            type: Sequelize.STRING,
        },
        MovieTitle: {
            type: Sequelize.STRING,
        },
        City: {
            type: Sequelize.STRING,
        },
        TheatreName: {
            type: Sequelize.STRING,
        },
        ScreenName: {
            type: Sequelize.STRING,
        },
        ShowDate: {
            type: Sequelize.DATE
        },
        ShowStartTime: {
            type: Sequelize.DATE
        },
        ShowEndTime: {
            type: Sequelize.DATE
        },
        SubTotal: {
            type: Sequelize.INTEGER
        }
    })
    return Booking
}