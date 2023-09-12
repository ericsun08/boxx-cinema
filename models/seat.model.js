module.exports = (sequelize, Sequelize) => {
    const Seat = sequelize.define('Seat', {
        SeatId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        SeatRow: {
            type: Sequelize.STRING
        },
        SeatNumber: {
            type: Sequelize.INTEGER
        },
    })
    return Seat
}