const express = require('express');
const controller = require('../controller/tourContorl');
const auth = require('./../controller/authContoller')

const router = express.Router();


// middleware for checking id

//router.param('id', controller.checkID_MW);

router.route('/')
    .get(auth.protect, controller.GetAllTouts)
    .post(controller.CreateTour);

router.route('/tour-states')
    .get(controller.GetTourDetail)

router.route('/monthly-plan/:year')
    .get(controller.GetMonthlyPlan)

router.route('/:id')
    .get(controller.GetTour)
    .patch(controller.UpdateTour)
    .delete(controller.DeleteTour);


module.exports = router;