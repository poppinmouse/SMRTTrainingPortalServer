//ODVL only now, may be need to split into other routes for other trainingType (/Corrective/bookings)
const BookingModel = require('../models/booking');
const FetchDataFunc = require('../utils/fetchData');
const UpdateIssueCodeFunc = require('../utils/updateIssueCode');


exports.getBookings = function(req, res) {
    var bookingArr = {bookings : []};
    FetchDataFunc(BookingModel.ODVL).then(bookings => {
        bookings.forEach(booking => {
            bookingArr.bookings.push(booking);
        });
    }).then(() => {
        res.send(bookingArr);
    });
};

exports.getTheBooking = function(req, res) {
    BookingModel.ODVL.findOne({_id : req.params.bookingId},(err, foundBooking) =>{
        if(foundBooking)
        {
            res.send(foundBooking);
        }
        else
        {
            res.send("No booking matching");
        }
    });
};

exports.postBookedDate = function(req, res) {
    BookingModel.ODVL.updateOne(
        {_id : req.params.bookingId},
        {bookedDate : JSON.parse(req.body.BookedDate)},
        {overwrite : false},
        (err) => {
            if(!err)
            {
                //if approved, issue code 0, else 1
                if(JSON.parse(req.body.BookedDate).hasApproved)
                {
                    UpdateIssueCodeFunc(req.params.bookingId, 0);
                }
                else
                {
                    UpdateIssueCodeFunc(req.params.bookingId, 1);
                }
                res.send("successfully save");
            }
            else{
                console.log(err);
            }
        }
    )
};


exports.postAbsentees = function(req, res) {
    BookingModel.ODVL.updateOne(
        {_id : req.params.bookingId},
        {trainees : JSON.parse(req.body.Absentees)},
        {overwrite : false},
        (err) => {
            if(!err)
            {
                res.send("successfully save");
                UpdateIssueCodeFunc(req.params.bookingId, 3);   
            }
            else{
                console.log(err);
            }
        }
    )
};

exports.postIssue = function(req, res) {   
    if(req.body.Code == "remind")
    {
        BookingModel.ODVL.updateOne(
            {_id : req.params.bookingId},
            {bookedDate : {proposedDate : "expired"}},
            {overwrite : false},
            (err) => {
                if(!err)
                {
                    res.send("successfully save");
                    UpdateIssueCodeFunc(req.params.bookingId, 0);  
                }
                else{
                    console.log(err);
                }
            }
        )
    }
    else{
        UpdateIssueCodeFunc(req.params.bookingId, 0);  
    }
};
