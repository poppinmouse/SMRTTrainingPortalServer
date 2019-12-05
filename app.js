const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/trainingPortalDB",{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Successfully connected to database"))
.catch((e) => console.log(e)
);

const traineeSchema = new mongoose.Schema({
    name: String,
    id: Number,
    interchange: String
});

const bookedDateSchema = new mongoose.Schema({
    bookedDate: Number,
    hasApproved: Boolean
});

const trainingTypeSchema = new mongoose.Schema({
    reservedDates: [Number],
    bookedDate: Number,
    trainees: [traineeSchema]
});

const ODVL = mongoose.model("ODVL", trainingTypeSchema);
const Corrective = mongoose.model("Corrective", trainingTypeSchema);
const Intervention = mongoose.model("Intervention", trainingTypeSchema);
//const Trainee = mongoose.model("Trainee", traineeSchema);

app.post("/ODVL", (req, res) => {
  
    const date = req.body.BookedDate;
    const oDVL = new ODVL({
        bookedDate : date
    });

    const dateArray = JSON.parse(req.body.ReservedDates).Items;
    dateArray.forEach(element => {
        oDVL.reservedDates.push(element);
    });

    const traineeArray = JSON.parse(req.body.Trainees).Items;

    traineeArray.forEach(element => {
        oDVL.trainees.push(element);
    });

    oDVL.save((err) => {
        if(err)
        {
            res.send(err);
        }
        else{
            res.send("Success");
        }
    });

    console.log("New user info saved to ODVL");
});

app.post("/Corrective", (req, res) => {

    const date= req.body.BookedDate;
    const corrective = new Corrective({
        bookedDate : date
    });

    const dateArray = JSON.parse(req.body.ReservedDates).Items;
    dateArray.forEach(element => {
        corrective.reservedDates.push(element);
    });

    const traineeArray = JSON.parse(req.body.Trainees).Items;

    traineeArray.forEach(element => {
        corrective.trainees.push(element);
    });

    corrective.save((err) => {
        if(err)
        {
            res.send(err);
        }
        else{
            res.send("Success");
        }
    });
    console.log("New user info saved to Corrective");
});

app.post("/Intervention", (req, res) => {

    const date= req.body.BookedDate;
    const intervention = new Intervention({
        bookedDate : date
    });

    const dateArray = JSON.parse(req.body.ReservedDates).Items;
    dateArray.forEach(element => {
        intervention.reservedDates.push(element);
    });

    const traineeArray = JSON.parse(req.body.Trainees).Items;

    traineeArray.forEach(element => {
        intervention.trainees.push(element);
    });

    intervention.save((err) => {
        if(err)
        {
            res.send(err);
        }
        else{
            res.send("Success");
        }
    });

    console.log("New user info saved to Intervention");
});

app.get("/Dates",(req, res) => {
    var blockedDates = {dates : []};
    fetchData(ODVL).then(bookings => {
        bookings.forEach(booking => {
            blockedDates.dates.push(booking.bookedDate);
            //if confirmDate is 0 then push below
            booking.reservedDates.forEach(reservedDate => {
                blockedDates.dates.push(reservedDate);
            
                //else push confirm date
                
            });
        });
        return fetchData(Corrective);
    }).then(bookings => {
        bookings.forEach(booking => {
            blockedDates.dates.push(booking.bookedDate);
            booking.reservedDates.forEach(reservedDate => {
                blockedDates.dates.push(reservedDate);
            });
        });
        return fetchData(Intervention);
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
});

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

app.listen(3000, () => console.log("Server Started Successfully"));




// app.post("/", (req, res) => {
//     const traineeName = req.body.Name;
//     const traineeId = req.body.Id;
//     const traineeInterchange = req.body.Interchange;

//     const trainee = new Trainee({
//         name: traineeName,
//         id: traineeId,
//         interchange: traineeInterchange
//     });

//     trainee.save();

//     res.send("Success");

//     console.log("New user info saved");
// });

   // ODVL.find((err, bookings) => {
    //     if(err)
    //     {
    //         console.log(err);
    //     }
    //     else
    //     {
    //         bookings.forEach(booking=> {
    //             appointedDates.dates.push(booking.bookedDate);
    //         });

    //         Corrective.find((err, bookings) => {
    //             if(err)
    //             {
    //                 console.log(err);
    //             }
    //             else
    //             {
    //                 bookings.forEach(booking=> {
    //                     appointedDates.dates.push(booking.bookedDate);
    //                 });

    //                 Intervention.find((err, bookings) => {
    //                     if(err)
    //                     {
    //                         console.log(err);
    //                     }
    //                     else
    //                     {
    //                         bookings.forEach(booking=> {
    //                             appointedDates.dates.push(booking.bookedDate);
    //                         });

    //                         res.send(appointedDates);
    //                     }
    //                 });                  
    //             }
    //         });
    //     }
    // });
