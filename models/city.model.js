module.exports = (sequelize, Sequelize) => {
    const City = sequelize.define('City', {
        CityId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        CityName: {
            type: Sequelize.STRING
        },
    })
    return City
}