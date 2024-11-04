const express = require('express')
const {CreateSession} = require('./../controller/bokkingController')
const {protect} = require('./../controller/authContoller')
const router = express.Router();

router.route('/check-out/:tourId')
    .get(protect, CreateSession)

module.exports = router;