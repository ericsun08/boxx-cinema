module.exports = (sequelize, Sequelize) => {
    const Movie = sequelize.define('Movie', {
        MovieId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        MovieImage: {
            type: Sequelize.STRING
        },
        ImageUrl: {
            type: Sequelize.STRING
        },
        Title: {
            type: Sequelize.STRING
        },
        Description: {
            type: Sequelize.STRING
        },
        Duration: {
            type: Sequelize.STRING
        },
        OpeningDate: {
            type: Sequelize.DATE
        },
        ClosingDate: {
            type: Sequelize.DATE
        },
        MovieStatus: {
            type: Sequelize.STRING
        },
        Language: {
            type: Sequelize.STRING
        },
        Genre: {
            type: Sequelize.STRING
        },
    }, 
    )

    return Movie
}