const db = require("../models");
const City = db.Cities;
const Theatre = db.Theatres
const Screen = db.Screens
const Show = db.Shows

exports.createCity = (req, res) => {
    const cityName = req.body.CityName

    const city = {
        CityName: cityName
    }

    City.create(city)
    .then(data => {
        res.send(data)
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || 'Error while adding the city'
        })
    })
}

exports.getAllCity = async (req, res) => {
    try{
        const response = await City.findAll({ 
            include: [
                {
                    as: 'Theatre',
                    model: Theatre,
                    attributes: [],
                }
            ],
            attributes: [
                'CityId', 'CityName', [db.Sequelize.fn('COUNT', db.Sequelize.col('Theatre.CityId')), "TotalCinema"]
            ],
            group: ['City.CityId', 'City.CityName'],
            order:[['CityName', 'ASC']]
         })
         res.status(200).send(response)
    }catch(err){
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving cities."
          })
    }
}