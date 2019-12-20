const express = require('express');
const datesController = require('../controllers/dates');

const router = express.Router();

router.route("/Dates").get(datesController.getDates);

module.exports = router;