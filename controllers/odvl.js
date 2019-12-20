const ODVL = require('../models/booking');

exports.postBooking = function (req, res) {  
    const oDVL = new ODVL({
        bookedDate:{
            proposedDate : "",
            hasApproved : false
        },
        issueCode: 0
    });

    const dateArray = JSON.parse(req.body.ReservedDates).Items;
  
    dateArray.forEach(element => {
        oDVL.reservedDates.push(element);
    });

    const traineeArray = JSON.parse(req.body.Trainees).Items;

    traineeArray.forEach(element => {
        oDVL.trainees.push(element);
    });

    oDVL.save((err, success) => {
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(success.id);
        }
    });

    console.log("New user info saved to ODVL");
}