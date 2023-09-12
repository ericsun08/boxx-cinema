const db = require("../models");
const Theatre = db.Theatres;

exports.createTheatre = (req, res) => {
    const theatreName = req.body.TheatreName
    const CityId = req.body.CityId
    const price = req.body.Price
    const theatreAddress = req.body.TheatreAddress

    const theatre = {
        TheatreName: theatreName,
        CityId: CityId,
        Price: price,
        TheatreAddress: theatreAddress
    }

    Theatre.create(theatre)
    .then(data => {
        res.send(data)
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || 'Error while adding the Theatre'
        })
    })
}

exports.findTheatreByCity = (req, res) => {
    const cityId = req.query.CityId 
    let condition = { CityId: cityId }

    Theatre.findAll({ where: condition})
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({message: err.message})
      })
}

exports.updateTheatre = (req, res) => {
    const theatreId = req.params.theatreId

    Theatre.update(req.body, { where: {TheatreId: theatreId}})
      .then(data => {
        if(data.includes(1)){
            res.send({message:'Theatre details successfully updated'})
        } else {
            res.send({message:'Failed to update theatre details'})
        }
      })
      .catch(err => {
        res.status(500).send({message:err.message})
      })
}

exports.deleteTheatre = (req, res) => {
  const TheatreId = req.params.theatreId

  Theatre.destroy({where: {TheatreId: TheatreId}})
    .then(data => {
      if(data.includes(1)){
        res.send({message:'Theatre successfully deleted'})
      } else {
        res.send({message: 'Failed to delete theatre'})
      }
    })
    .catch(err => {
      res.status(500).send({message: err.message})
    })
}