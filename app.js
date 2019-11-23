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

const Trainee = mongoose.model("Trainee", traineeSchema);

app.post("/", (req, res) => {
    const traineeName = req.body.Name;
    const traineeId = req.body.Id;
    const traineeInterchange = req.body.Interchange;

    const trainee = new Trainee({
        name: traineeName,
        id: traineeId,
        interchange: traineeInterchange
    });

    trainee.save();

    res.send("Success");

    console.log("New user info saved");
});

app.listen(3000, () => console.log("Server Started Successfully"));

