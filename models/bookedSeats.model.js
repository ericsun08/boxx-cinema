module.exports = (sequelize, Sequelize) => {
    const BookedSeats = sequelize.define('BookedSeats', {
        BookedSeatsId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        Status: {
            type: Sequelize.STRING,
        },
        SeatRow: {
            type: Sequelize.STRING
        },
        SeatNumber: {
            type: Sequelize.INTEGER
        },
    })
    return BookedSeats
}