const db = require("../models");
const City = db.Cities;
const Theatre = db.Theatres
const Screen = db.Screens
const Show = db.Shows
const Movie = db.Movies
const Op = db.Sequelize.Op;

exports.getScheduleByCity = async (req, res) => {
    const CityId = req.query.CityId
    const MovieId = req.query.MovieId
    const SelectedDate = req.query.SelectedDate

    let today = new Date()

    try{
        const MovieResponse = await Movie.findOne({where: { MovieId: MovieId }, attributes: ['MovieId', 'ImageUrl', 'Title']})

        const ScheduleResponse = await City.findOne({
            include: [
                {
                    as: 'Theatre',
                    model: Theatre,
                    include: [
                        {
                            as: 'Screen',
                            model: Screen,
                            include: [
                                {
                                    as: 'Show',
                                    model: Show,
                                    where: {
                                        MovieId:MovieId,
                                        // ShowDate: new Date(SelectedDate),
                                        // ShowStartTime: { [Op.gt]: today },
                                    },
                                }
                            ]
                        }
                    ],
                },
            ],
            where: {
                CityId:CityId
            },
        })

        const filteredTheatres = ScheduleResponse.Theatre.filter(theatre => theatre.Screen.length > 0)

        // filteredTheatres.forEach(theatre => {
        //     theatre.Screen.forEach(screen => {
        //         screen.Show.sort((a, b) => new Date(a.ShowStartTime) - new Date(b.ShowStartTime));
        //     });
        // });

        res.send({Movie: MovieResponse, Schedules: filteredTheatres})
    } catch(err) {
        res.status(500).send({message: err.message})
    }

}

exports.getScheduleByTheatre = async (req, res) => {
    const TheatreId = req.query.TheatreId
    const SelectedDate = req.query.SelectedDate

    let today = new Date()

    try {
        const TheatreResponse = await Theatre.findOne({where: { TheatreId: TheatreId }})

        const MovieResponse = await db.sequelize.query(
            `SELECT Movies.MovieId, Movies.ImageUrl, Movies.Title, Screens.ScreenId, Screens.ScreenName, Shows.ShowId, Shows.ShowDate, Shows.ShowStartTime, Shows.ShowEndTime FROM Movies CROSS JOIN Screens INNER JOIN Shows ON Movies.MovieId = Shows.MovieId AND Screens.ScreenId = Shows.ScreenId WHERE TheatreId = :theatreId AND ShowDate = :selectedDate AND ShowStartTime > :today ORDER BY Shows.ShowStartTime ASC`,
            {
                replacements: { theatreId: TheatreId, selectedDate: new Date(SelectedDate), today: today },
                mapToModel: true,
                type: db.sequelize.QueryTypes.SELECT,
            }
        )

        const newMovieJson = {
            Movie:[]
        }

        MovieResponse.forEach(movie => {
            let existingMovie = newMovieJson.Movie.find(m => m.MovieId === movie.MovieId)
            if(!existingMovie) {
                existingMovie ={
                    MovieId: movie.MovieId,
                    ImageUrl: movie.ImageUrl,
                    Title: movie.Title,
                    Screen:[]
                }
                newMovieJson.Movie.push(existingMovie)
            }

            let existingScreen = existingMovie.Screen.find(s => s.ScreenId === movie.ScreenId)
            if(!existingScreen){
                existingScreen = {
                    ScreenId: movie.ScreenId,
                    ScreenName: movie.ScreenName,
                    Show:[]
                }
                existingMovie.Screen.push(existingScreen)
            }

            existingScreen.Show.push({ ShowId: movie.ShowId, ShowDate: movie.ShowDate,ShowStartTime: movie.ShowStartTime, ShowEndTime: movie.ShowEndTime })
        })

        res.send({Theatre: TheatreResponse, Movies: newMovieJson.Movie})
    } catch (err) {
        res.status(500).send({message: err.message})
    }

}