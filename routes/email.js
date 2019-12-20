const express = require('express');
const emailController = require('../controllers/email');

const router = express.Router();

router.route("/email").post(emailController.postEmail);

module.exports = router;