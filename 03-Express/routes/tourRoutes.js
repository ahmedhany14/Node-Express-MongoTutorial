const express = require('express');
const controller = require('../controller/tourContorl');
const { protect, Permission } = require('./../controller/authContoller')
const reviewRouter = require('./reviewRouter')
const router = express.Router();


// middleware for checking id

//router.param('id', controller.checkID_MW);

router.route('/')
    .get(controller.GetAllTouts)
    .post(
        protect,
        Permission('admin', 'lead-guid'),
        controller.CreateTour
    );

router.route('/tour-states')
    .get(controller.GetTourDetail)

router.route('/monthly-plan/:year')
    .get(
        protect,
        Permission('admin', 'lead-guide', "guide"),
        controller.GetMonthlyPlan
    );

router.route('/:id')
    .get(controller.GetTour)
    .patch(
        protect,
        Permission('admin', 'lead-guide'),
        controller.UpdateTour
    )
    .delete(
        protect,
        Permission('admin', 'lead-guide'),
        controller.DeleteTour
    );

/*
// This is nested route, where we get the reviews of the tour

router.route('/:id/reviews')
    .get(
        protect,
        Permission('user'),
        getReviews
    )
    .post(protect, writeReview)
*/

// we can use this way to use the nested route
router.use('/:id/reviews', reviewRouter)


module.exports = router;