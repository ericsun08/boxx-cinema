const db = require("../models");
const Seat = db.Seats;
const BookedSeat = db.BookedSeats

exports.addSeats = async (req, res) => {
    const screenId = req.body.ScreenId
    const seats = req.body.Seats
 
    try{
      for(let i = 0; i < seats.length; i++){
        const {SeatRow, NumberOfSeats} = seats[i]
  
        for(let seatNumber = 1; seatNumber <= NumberOfSeats; seatNumber++) {
          const seat = {
            ScreenId: screenId,
            SeatRow: SeatRow,
            SeatNumber: seatNumber,
          }
  
          await Seat.create(seat)
            
        }
      }
      res.send({message:'Seats Added'})
    } catch(err){
      res.status(500).send({message:err.message})
    }
}

exports.getSeatsView = async (req, res) => {
  const {ScreenId, ShowId} = req.query

  try{
    const seatData = await Seat.findAll({ 
      include:{
        as:'BookedSeats',
        model:BookedSeat,
        attributes:['Status'],
        where: {ShowId: ShowId},
        required:false,
      },
      where: {ScreenId: ScreenId}, 
      order: [['SeatRow', 'ASC'],['SeatNumber', 'ASC']] 
    })

    const rows = []

    const seatMap = {}

    await seatData.forEach(item => {
        const seatRow = item.SeatRow
        if(!seatMap[seatRow]){
          seatMap[seatRow] = []
        }

        seatMap[seatRow].push(item)
    })

    Object.entries(seatMap).forEach(([row, seats]) => {
      rows.push({seats})
    })
      
    res.status(200).send({Rows: rows})
  }catch(err){
    res.status(500).send({message: err.message})
  }
    
}