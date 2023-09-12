module.exports = (sequelize, Sequelize) => {
    const Screen = sequelize.define('Screen', {
        ScreenId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        ScreenName: {
            type: Sequelize.STRING
        }
    })
    return Screen
}