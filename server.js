const express = require('express')
const FileUpload = require('express-fileupload')
const cors = require('cors')

const app = express()

const db = require("./models");
db.sequelize.sync();

// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
//   });

const corsOptions = {
    origin: "http://localhost:3000"
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(FileUpload())
app.use(express.static('public' + '/tmp'))
app.use('/tmp', express.static('tmp'));

app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.json({message: "HELLO"})
})

require('./routes/user.routes')(app)
require('./routes/city.routes')(app)
require('./routes/theatre.routes')(app)
require('./routes/screen.routes')(app)
require('./routes/seat.routes')(app)
require('./routes/movie.routes')(app)
require('./routes/show.routes')(app)
require('./routes/booking.routes')(app)
require('./routes/movieStatus.routes')(app)
require('./routes/cast.routes')(app)
require('./routes/movieCast.routes')(app)
require('./routes/searchShow.routes')(app)
require('./routes/savedMovie.routes')(app)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})