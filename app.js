const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/trainingPortalDB",{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Successfully connected to database"))
.catch((e) => console.log(e)
);

const traineeSchema = new mongoose.Schema({
    name: String,
    id: Number,
    interchange: String,
    absent: Boolean
});

const bookedDateSchema = new mongoose.Schema({
    proposedDate: String,
    hasApproved: Boolean
});

const trainingTypeSchema = new mongoose.Schema({
    reservedDates: [String],
    bookedDate: bookedDateSchema,
    trainees: [traineeSchema],
    issueCode: Number 
    //issueCode reference
    //0 = no issue
    //1 = to confirm
    //2 = to remind
    //3 = to rebook
});

const ODVL = mongoose.model("ODVL", trainingTypeSchema);
const Corrective = mongoose.model("Corrective", trainingTypeSchema);
const Intervention = mongoose.model("Intervention", trainingTypeSchema);

//const Trainee = mongoose.model("Trainee", traineeSchema);

app.post("/ODVL", (req, res) => {
  
    // const date = req.body.BookedDate;
    const oDVL = new ODVL({
        // bookedDate : date
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

    // const bookedDate = JSON.parse(req.body.BookedDate);
    // oDVL.bookedDate = bookedDate;

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
});

app.post("/Corrective", (req, res) => {

    //const date= req.body.BookedDate;
    const corrective = new Corrective({
        //bookedDate : date
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

    // const date= req.body.BookedDate;
    const intervention = new Intervention({
        // bookedDate : date
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

//ODVL only now, may be need to split into other routes for other trainingType
app.route("/bookings")
.get((req, res) => {
    var bookingArr = {bookings : []};
    fetchData(ODVL).then(bookings => {
        bookings.forEach(booking => {
            bookingArr.bookings.push(booking);
        });
    }).then(() => {
        res.send(bookingArr);
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

app.route("/bookings/:bookingId")
.get((req, res) => {
    ODVL.findOne({_id : req.params.bookingId},(err, foundBooking) =>{
        if(foundBooking)
        {
            res.send(foundBooking);
        }
        else
        {
            res.send("No booking matching");
        }
    });
});

app.route("/bookings/:bookingId/bookeddate")
.post((req, res) => {
    ODVL.updateOne(
        {_id : req.params.bookingId},
        {bookedDate : JSON.parse(req.body.BookedDate)},
        {overwrite : false},
        (err) => {
            if(!err)
            {
                //if approved, issue code 0, else 1
                if(JSON.parse(req.body.BookedDate).hasApproved)
                {
                    updateIssueCode(req.params.bookingId, 0);
                }
                else
                {
                    updateIssueCode(req.params.bookingId, 1);
                }
                res.send("successfully save");
            }
            else{
                console.log(err);
            }
        }
    )
});


app.route("/bookings/:bookingId/absentees")
.post((req, res) => {
    ODVL.updateOne(
        {_id : req.params.bookingId},
        {trainees : JSON.parse(req.body.Absentees)},
        {overwrite : false},
        (err) => {
            if(!err)
            {
                res.send("successfully save");
                updateIssueCode(req.params.bookingId, 3);   
            }
            else{
                console.log(err);
            }
        }
    )
});

app.route("/bookings/:bookingId/issue")
.post((req, res) => {
   
    if(req.body.Code == "remind")
    {
        ODVL.updateOne(
            {_id : req.params.bookingId},
            {bookedDate : {proposedDate : "expired"}},
            {overwrite : false},
            (err) => {
                if(!err)
                {
                    res.send("successfully save");
                    updateIssueCode(req.params.bookingId, 0);  
                }
                else{
                    console.log(err);
                }
            }
        )
    }
    else{
        updateIssueCode(req.params.bookingId, 0);  
    }
});


app.route("/email")
.post((req, res) => {
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'testnodemailer123456@gmail.com',
        pass: 'TestNodemailer123'
        }
    });
    
    const email = JSON.parse(req.body.Email);

    var mailOptions = {
        from: 'testnodemailer123456@gmail.com',
        to: email.interchangeAddress + "," + email.trainerAddress,
        subject: email.subject,
        text: email.body       
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
});

 
//run every 1 min
var j = schedule.scheduleJob('*/1 * * * *', function(){

    fetchData(ODVL).then(bookings => {
        bookings.forEach(booking => {
            // booking.trainees.forEach(trainee => {
            //     if(trainee.absent)
            //     {
            //         updateIssueCode(booking._id, 3);              
            //     }
            // });
            //if propose date is "" and latest reserved date is less than today, need time to remind
            if(booking.bookedDate.proposedDate == "")
            {
                var d = new Date(Math.max.apply(null, booking.reservedDates.map(reservedDate => {
                    return new Date(reservedDate);
                })));       
                
                var today = new Date();
                if(d < today)
                {
                    updateIssueCode(booking._id, 2);
                    //remind 
                }
            }     
             
            //if propose date is set but hasApproved is false, need to confirm      
            // else
            // {
            //     if(!booking.bookedDate.hasApproved)
            //     {
            //         updateIssueCode(booking._id, 1);
            //         //confirm
            //     }
            // }  
        });  
    });
});

function updateIssueCode(bookingId, code)
{
    ODVL.updateOne(
        {_id : bookingId},
        {issueCode : code},
        {overwrite : false},
        (err) => {
            if(!err)
            {
                console.log("issue with error:  " + code);
            }
            else{
                console.log(err);
            }
        }
   )  
}

app.listen(3000, () => console.log("Server Started Successfully"));



