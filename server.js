const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const oDVLRoutes = require("./routes/odvl");
const datesRoutes = require("./routes/dates");
const bookingsRoutes = require("./routes/bookings");
const emailRoutes = require("./routes/email");
const userRoutes = require("./routes/user");
const scheduler = require("./scheduler");


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
});

const User = new mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(oDVLRoutes);
app.use(datesRoutes);
app.use(bookingsRoutes);
app.use(emailRoutes);
// app.use(userRoutes);
scheduler.check;

app.route("/login")
.post((req, res) => {
   console.log(req.body);
   const username = JSON.parse(req.body.User).username;
   const password = JSON.parse(req.body.User).password;

   User.findOne({username: username}, (err, foundUser) =>{
        if(err)
        {
            console.log(err);
        }
        else{
            if(foundUser)
            {
                if(foundUser.password === password)
                {
                    res.send(foundUser.role);
                }
            }
        }
   });
    //  const newuser = new User({
    //     username:"interchange",
    //     password: "123",
    //     role: "interchange"
    // });

    // newuser.save();
});

mongoose.connect("mongodb://localhost:27017/trainingPortalDB",{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Successfully connected to database"))
.catch((e) => console.log(e)
);

app.listen(3000, () => console.log("Server Started Successfully"));



