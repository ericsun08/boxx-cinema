const dbConfig = require('../config/db.config')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.Users = require('./user.model')(sequelize, Sequelize)
db.Cities = require('./city.model')(sequelize, Sequelize)
db.Theatres = require('./theatre.model')(sequelize, Sequelize)
db.Screens = require('./screen.model')(sequelize, Sequelize)
db.Seats = require('./seat.model')(sequelize, Sequelize)
db.Movies = require('./movie.model')(sequelize, Sequelize)
db.Shows = require('./show.model')(sequelize, Sequelize)
db.Bookings = require('./booking.model')(sequelize, Sequelize)
db.BookedSeats = require('./bookedSeats.model')(sequelize, Sequelize)
db.MovieStatus = require('./movieStatus.model')(sequelize, Sequelize)
db.Casts = require('./cast.model')(sequelize, Sequelize)
db.MovieCasts = require('./movieCast.model')(sequelize, Sequelize)
db.SavedMovies = require('./savedMovie.model')(sequelize, Sequelize)

//City and Theatre Relationship
db.Cities.hasMany(db.Theatres, {
    foreignKey: 'CityId',
    as: 'Theatre'
})

db.Theatres.belongsTo(db.Cities, {
    foreignKey: 'CityId',
    as: 'City'
})

//Theatre and Screen Relationship
db.Theatres.hasMany(db.Screens, {
    foreignKey: 'TheatreId',
    as: 'Screen'
})

db.Screens.belongsTo(db.Theatres, {
    foreignKey: 'TheatreId',
    as: 'Theatre'
})

//Screen and Seat Relationship
db.Screens.hasMany(db.Seats, {
    foreignKey: 'ScreenId',
    as: 'Seat'
})

db.Seats.belongsTo(db.Screens, {
    foreignKey: 'ScreenId',
    as: 'Screen'
})

//Seats and BookedSeat Relationship
db.Seats.hasMany(db.BookedSeats, {
    foreignKey: 'SeatId',
    as: 'BookedSeats'
})

db.BookedSeats.belongsTo(db.Seats, {
    foreignKey: 'SeatId',
    as: 'Seat'
})

//Show and BookedSeat Relationship
db.Shows.hasMany(db.BookedSeats, {
    foreignKey: 'ShowId',
    as: 'BookedSeats'
})

db.BookedSeats.belongsTo(db.Shows, {
    foreignKey: 'ShowId',
    as: 'Show'
})

//Booking and BookedSeat Relationship
db.Bookings.hasMany(db.BookedSeats, {
    foreignKey: 'BookingId',
    as: 'BookedSeats'
})

db.BookedSeats.belongsTo(db.Bookings, {
    foreignKey: 'BookingId',
    as: 'Booking'
})

//User and Booking Relationship 
db.Users.hasMany(db.Bookings, {
    foreignKey: 'UserId',
    as: 'Booking'
})

db.Bookings.belongsTo(db.Users, {
    foreignKey: 'UserId',
    as: 'User'
})

//Show and Booking Relationship
db.Shows.hasMany(db.Bookings, {
    foreignKey: 'ShowId',
    as: 'Booking'
})

db.Bookings.belongsTo(db.Shows, {
    foreignKey: 'UserId',
    as: 'Show'
})

//Show and Screen Relationship
db.Screens.hasMany(db.Shows, {
    foreignKey: 'ScreenId',
    as: 'Show'
})
db.Shows.belongsTo(db.Screens, {
    foreignKey: 'ScreenId',
    as: 'Screen'
})

//Movie and Show Relationship
db.Movies.hasMany(db.Shows, {
    foreignKey: 'MovieId',
    as: 'Show'
})

db.Shows.belongsTo(db.Movies, {
    foreignKey: 'MovieId',
    as: 'Movie'
})

//Movie and MovieCast Relationship
db.Movies.hasMany(db.MovieCasts, {
    foreignKey: 'MovieId',
    as: 'MovieCast'
})

db.MovieCasts.belongsTo(db.Movies, {
    foreignKey: 'MovieId',
    as: 'Movie'
})

//Saved Movie and Movie Relationship
db.Movies.hasMany(db.SavedMovies, {
    foreignKey:'MovieId',
    as:'SavedMovie'
})

db.SavedMovies.belongsTo(db.Movies, {
    foreignKey: 'MovieId',
    as:'Movie'
})

//Saved Movie and User Relationship
db.Users.hasMany(db.SavedMovies, {
    foreignKey:'UserId',
    as:'SavedMovie'
})

db.SavedMovies.belongsTo(db.Users, {
    foreignKey: 'UserId',
    as: 'User'
})

module.exports = db