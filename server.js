const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const schedule = require("node-schedule");

const app = express();

const oDVLRoutes = require("./routes/odvl");
const datesRoutes = require("./routes/dates");
const bookingsRoutes = require("./routes/bookings");
const emailRoutes = require("./routes/email");
const userRoutes = require("./routes/user");
const scheduleCallbackFunc = require("./controllers/scheduleCallback");

app.use(bodyParser.urlencoded({extended: true}));
app.use(oDVLRoutes);
app.use(datesRoutes);
app.use(bookingsRoutes);
app.use(emailRoutes);
app.use(userRoutes);

//run every 1 min
schedule.scheduleJob('*/1 * * * *', scheduleCallbackFunc);

mongoose.connect("mongodb://localhost:27017/trainingPortalDB",{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Successfully connected to database"))
.catch((e) => console.log(e)
);

app.listen(3000, () => console.log("Server Started Successfully"));



