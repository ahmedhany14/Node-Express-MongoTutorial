const express = require('express')
const {CreateSession, successCheckout} = require('./../controller/bokkingController')
const {protect} = require('./../controller/authContoller')
const router = express.Router();

router.route('/check-out/:tourId')
    .get(protect, CreateSession)

router.route('/susses')
    .get(successCheckout)

module.exports = router;