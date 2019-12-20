const mongoose = require('mongoose');

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

const bookingSchema = new mongoose.Schema({
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

module.exports = mongoose.model('ODVL', bookingSchema);