const BookingModel = require('../models/booking');

exports.getDates = function (req, res) {
    var blockedDates = {dates : []};
    fetchData(BookingModel.ODVL).then(bookings => {
        bookings.forEach(booking => {
            if(!booking.bookedDate.hasApproved)
            {
                booking.reservedDates.forEach(reservedDate => {
                    blockedDates.dates.push(reservedDate);
                });          
            }            
            else
            {
                blockedDates.dates.push(booking.bookedDate.proposedDate);
            }    
        });
        return fetchData(BookingModel.Corrective);
    }).then(bookings => {
        bookings.forEach(booking => {
            blockedDates.dates.push(booking.bookedDate);
            booking.reservedDates.forEach(reservedDate => {
                blockedDates.dates.push(reservedDate);
            });
        });
        return fetchData(BookingModel.Intervention);
    }).then(bookings => {
        bookings.forEach(booking => {
            blockedDates.dates.push(booking.bookedDate);
            booking.reservedDates.forEach(reservedDate => {
                blockedDates.dates.push(reservedDate);
            });
        });
    }).then(() => {   
        res.send(blockedDates);
    });
}

const fetchData = (collection) => {
    const promise = new Promise((resolve, reject) => {
        collection.find((err, bookings) => {
            if(err)
            {
                console.log(err);
            }
            else
            {
                resolve(bookings);
            }
        });     
    });

    return promise;
}