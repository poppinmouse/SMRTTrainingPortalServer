const express = require('express');
const odvlController = require('../controllers/odvl');

const router = express.Router();

router.route("/ODVL").post(odvlController.postBooking);

module.exports = router;



