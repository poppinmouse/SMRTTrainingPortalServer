const express = require('express');
const bookingsController = require('../controllers/bookings');

const router = express.Router();

router.route("/bookings").get(bookingsController.getBookings);//for interchage to book
router.route("/bookings/:bookingId").get(bookingsController.getTheBooking);
router.route("/bookings/:bookingId/absentees").post(bookingsController.postAbsentees);
router.route("/bookings/:bookingId/issue").post(bookingsController.postIssue);

module.exports = router;

