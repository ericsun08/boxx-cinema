const db = require("../models");
const Screen = db.Screens;

exports.addScreen = (req, res) => {
    const screen = {
        ScreenName: req.body.ScreenName,
        TheatreId: req.body.TheatreId
    }

    Screen.create(screen)
      .then(data => {
        res.send({message: 'Screen Added', data})
      })
      .catch(err => {
        res.status(500).send({message:err.message})
      })
}

exports.findScreenByTheatre = (req, res) => {
    const theatreId = req.params.theatreId
    let condition = { TheatreId: theatreId }

    Screen.findAll({ where: condition})
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.status.send({message: err.message})
      })
}