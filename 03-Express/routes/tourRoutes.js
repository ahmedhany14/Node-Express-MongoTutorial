const express = require('express');
const controller = require('../controller/tourContorl');
const { protect, Permission } = require('./../controller/authContoller')
const { getReviews, writeReview } = require('./../controller/reviewsContorl')
const router = express.Router();


// middleware for checking id

//router.param('id', controller.checkID_MW);

router.route('/')
    .get(protect, controller.GetAllTouts)
    .post(controller.CreateTour);

router.route('/tour-states')
    .get(controller.GetTourDetail)

router.route('/monthly-plan/:year')
    .get(controller.GetMonthlyPlan)

router.route('/:id')
    .get(controller.GetTour)
    .patch(controller.UpdateTour)
    .delete(
        protect,
        Permission('admin', 'lead-guide'),
        controller.DeleteTour
    );

router.route('/:id/reviews')
    .get(
        protect,
        Permission('user'),
        getReviews
    )
    .post(protect, writeReview)

module.exports = router;