const FetchDataFunc = require('../utils/fetchData');
const UpdateIssueCodeFunc = require('../utils/updateIssueCode');
const BookingModel = require('../models/booking');

module.exports = () =>{
    FetchDataFunc(BookingModel.ODVL).then(bookings => {
        console.log("checking");
        bookings.forEach(booking => {          
            if(booking.bookedDate.proposedDate == "")
            {
                var d = new Date(Math.max.apply(null, booking.reservedDates.map(reservedDate => {
                    return new Date(reservedDate);
                })));       
                
                var today = new Date();
                if(d < today)
                {
                    UpdateIssueCodeFunc(booking._id, 2);
                    //remind 
                }
            }     
        });  
    });
}