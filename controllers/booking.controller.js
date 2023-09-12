const db = require("../models");
const { Op } = require('sequelize');
const Booking = db.Bookings;
const BookedSeat = db.BookedSeats
const jwt = require('jsonwebtoken')
const cron = require('node-cron')

cron.schedule('*/1 * * * *', async () => {
  try{
    const tenMinutesAgo = new Date(new Date() - 10 * 60 * 1000)

    const unpaidBookings = await Booking.findAll({
      where:{
        Status: 'Unpaid',
        createdAt: {
          [Op.lte]: tenMinutesAgo
        }
      }
    })
  
    const cancelBookings = unpaidBookings.map(async booking => {
      const bookedSeats = await BookedSeat.findAll({
        where:{
          BookingId: booking.BookingId
        }
      })
  
      const seatCancellationPromises = bookedSeats.map(async seat => {
        await seat.destroy();
      });

      await booking.destroy();
  
      await Promise.all(seatCancellationPromises)
    })
  
    await Promise.all(cancelBookings)
  }catch(err){
    res.status(500).send({message:err.message})
  }
})

exports.addBooking = async (req, res) => {
  if(req.body.length === 0){
    return res.status(400).send({message:"Min 1 selected seat"})
  }

  jwt.verify(req.token, `${process.env.SECRET}`, async (err, data) => {
    const userId = req.body[0].UserId
    if(err || (data.user.UserId !== userId)){
      return res.status(403).send({message:'Forbidden'})
    } 

    for(let i=0; i < req.body.length; i++){
      const { SeatId, ShowId } = req.body[i]

      const isSeatBooked = await BookedSeat.findOne({where: {SeatId: SeatId, ShowId: ShowId}})

      if(isSeatBooked){
        res.status(500).send({message: "Seats that you have selected already reserved by another user"})
      }
    }

    const dataLength = req.body.length

    const booking = {
        Status: 'Unpaid',
        UserId: userId,
        ShowId: req.body[0].ShowId,
        MovieId:req.body[0].MovieId,
        MovieTitle: req.body[0].MovieTitle,
        City:req.body[0].City,
        TheatreName:  req.body[0].TheatreName,
        ScreenName: req.body[0].ScreenName,
        ShowDate: new Date(req.body[0].ShowDate),
        ShowStartTime: req.body[0].ShowStartTime,
        ShowEndTime: req.body[0].ShowEndTime,
        SubTotal:req.body[dataLength-1].SubTotal,
    }

    Booking.create(booking)
      .then(async data => {
        const promises = [];
        
        for (let i = 0; i < req.body.length; i++) {
          const { SeatId, SeatRow, SeatNumber, ShowId } = req.body[i]

          const bookSeat = {
            Status: 'Locked',
            SeatId: SeatId,
            SeatRow: SeatRow,
            SeatNumber: SeatNumber,
            ShowId: ShowId,
            BookingId: data.BookingId
          }

          promises.push(BookedSeat.create(bookSeat));
        }

        Promise.all(promises)
          .then(() => {
            res.status(200).send({Booking: data, message: "You have reserved the seats" });
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });
      })
      .catch(err => {
        res.status(500).send({message: err.message})
      })
  })
}

exports.getBooking = async (req, res) => {
  const UserId = req.params.UserId

  jwt.verify(req.token, `${process.env.SECRET}`, async (err, data) => {
    if(err || (data.user.UserId !== UserId)){
      return res.status(403).send({message:'Forbidden'})
    } 

    try{
      const bookingList = await Booking.findAll({
        where:{
          UserId:UserId
        },
        include: [
          {
              as: 'BookedSeats',
              model: BookedSeat,
              attributes: [],
          }
        ],
        attributes: [
            'BookingId', 'Status', 'MovieTitle', 'ShowDate', 'ShowStartTime', 'ShowEndTime', 'ShowId', 'TheatreName', 'SubTotal', 'createdAt',  [db.Sequelize.fn('COUNT', db.Sequelize.col('BookedSeats.BookingId')), "TicketQty"]
        ],
        group: ['Booking.BookingId', 'Booking.Status', 'Booking.MovieTitle', 'Booking.ShowDate', 'Booking.ShowStartTime', 'Booking.ShowEndTime', 'Booking.ShowId', 'Booking.TheatreName', 'Booking.SubTotal', 'Booking.createdAt',],
        })
      res.status(200).send({Transaction: bookingList})
    }catch(err){
      res.status(500).send({message:err.message})
    }
  })
}

exports.getTicketList = async (req, res) => {
  const UserId = req.params.UserId

  jwt.verify(req.token, `${process.env.SECRET}`, async (err, data) => {
    if(err || (data.user.UserId !== UserId)){
      return res.status(403).send({message:'Forbidden'})
    }

    try{
      const getPaidTickets = await Booking.findAll({
        where: {
          UserId: UserId,
        },
        include:[
          {
            as: 'BookedSeats',
            model: BookedSeat,
          }
        ]
      })

      res.status(200).send({Tickets: getPaidTickets})
    }catch(err){
      res.status(500).send({message:err.message})
    }
  })
}

exports.payTickets = async (req, res) => {
  const { BookingId, UserId } = req.query

  jwt.verify(req.token, `${process.env.SECRET}`, async (err, data) => {
    if(err || (data.user.UserId !== UserId)){
      return res.status(403).send({message:'Forbidden'})
    } 

    try{
      const booking = await Booking.findOne({ where: {BookingId:BookingId} })
      booking.Status = 'Paid'
      await booking.save()

      const bookedSeat = await BookedSeat.findAll({where: {BookingId:BookingId}})

      const markAsBooked = bookedSeat.map(async seat => {
        seat.Status = 'Booked'
        await seat.save()
      })

      await Promise.all(markAsBooked)
      
      res.status(200).send({message:"Your payment is success!", BookingDetail: booking, BookedSeat: bookedSeat})
    }catch(err){
      res.status(500).send({message:err.message})
    }
  })
}

exports.abortBooking = async (req, res) => {
  const { BookingId, UserId } = req.query

  jwt.verify(req.token, `${process.env.SECRET}`, async (err, data) => {
    if(err || (data.user.UserId !== UserId)){
      return res.status(403).send({message:'Forbidden'})
    } 

    try{
      BookedSeat.destroy({where: { BookingId: BookingId }})
        .then(async () => {
          await Booking.destroy({where: { BookingId: BookingId }})
          res.status(200).send({message: "Booking Aborted"})
        })
        .catch((err) => {
          res.status(500).send({message: err.message})
        })
    }catch(err){
      res.status(500).send({message: err.message})
    }
  })
}