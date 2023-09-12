module.exports = (sequelize, Sequelize) => {
    const Show = sequelize.define('Show', {
        ShowId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
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
    })
    return Show
}