const db = require("../models");
const Show = db.Shows;

exports.addShow = async (req, res) => {
  const startDate = new Date(req.body.StartDate)
  const endDate = new Date(req.body.EndDate)

  const startTimeString = req.body.ShowStartTime
  const startTimeParts = startTimeString.split(":");
  const startHours = parseInt(startTimeParts[0], 10);
  const startMinutes = parseInt(startTimeParts[1], 10);

  const endTimeString = req.body.ShowEndTime
  const endTimeParts = endTimeString.split(":");
  const endHours = parseInt(endTimeParts[0], 10);
  const endMinutes = parseInt(endTimeParts[1], 10);

  let loopDate = new Date(startDate)

  loopDate.setUTCHours(0);

  try{
    while(loopDate <= endDate){
      const formattedStartDate = new Date(loopDate.getFullYear(), loopDate.getMonth(), loopDate.getDate(), startHours, startMinutes);
      const formattedEndDate = new Date(loopDate.getFullYear(), loopDate.getMonth(), loopDate.getDate(), endHours, endMinutes);

      const show = {
        ShowDate: loopDate.toISOString(),
        ShowStartTime: formattedStartDate,
        ShowEndTime: formattedEndDate,
        ScreenId: req.body.ScreenId,
        MovieId: req.body.MovieId
      }

      await Show.create(show)

      let newDate = loopDate.setDate(loopDate.getDate() + 1)
      //loopDate = new Date(newDate)
    }

    res.send({message:'Show Added'})
  } catch(err) {
    res.status(500).send({message: err.message})
  }
}