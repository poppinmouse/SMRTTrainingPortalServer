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

const trainingTypeSchema = new mongoose.Schema({
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

    console.log("New user info saved");
});

app.post("/Corrective", (req, res) => {

    const date= req.body.BookedDate;
    const corrective = new Corrective({
        bookedDate : date
    });

    const traineeName = req.body.Name;
    const traineeId = req.body.Id;
    const traineeInterchange = req.body.Interchange;

    corrective.trainees.push({
        name: traineeName,
        id: traineeId,
        interchange: traineeInterchange
    });

    corrective.save();

    res.send("Success");

    console.log("New user info saved");
});

app.post("/Intervention", (req, res) => {

    const date= req.body.BookedDate;
    const intervention = new Intervention({
        bookedDate : date
    });

    const traineeName = req.body.Name;
    const traineeId = req.body.Id;
    const traineeInterchange = req.body.Interchange;

    intervention.trainees.push({
        name: traineeName,
        id: traineeId,
        interchange: traineeInterchange
    });

    intervention.save();

    res.send("Success");

    console.log("New user info saved");
});


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

app.listen(3000, () => console.log("Server Started Successfully"));

