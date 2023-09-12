module.exports = (sequelize, Sequelize) => {
    const SavedMovie = sequelize.define('SavedMovie', {
        SavedMovieId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        }
    })
    return SavedMovie
}