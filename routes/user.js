const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.route("/login").post(userController.postUser);

module.exports = router;
