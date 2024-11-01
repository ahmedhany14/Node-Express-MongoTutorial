const express = require('express');
const {
    GetAllTouts,
    CreateTour,
    GetTourDetail,
    GetMonthlyPlan,
    GetTour,
    UpdateTour,
    DeleteTour,
    nearestTours
} = require('../controller/tourContorl');
const {protect, Permission} = require('./../controller/authContoller')
const reviewRouter = require('./reviewRouter')
const router = express.Router();


// middleware for checking id

//router.param('id', controller.checkID_MW);

router.route('/')
    .get(GetAllTouts)
    .post(
        protect,
        Permission('admin', 'lead-guid'),
        CreateTour
    );

router.route('/tour-states')
    .get(GetTourDetail)

router.route('/monthly-plan/:year')
    .get(
        protect,
        Permission('admin', 'lead-guide', "guide"),
        GetMonthlyPlan
    );

router.route('/:id')
    .get(GetTour)
    .patch(
        protect,
        Permission('admin', 'lead-guide'),
        UpdateTour
    )
    .delete(
        protect,
        Permission('admin', 'lead-guide'),
        DeleteTour
    );

router.route('/tour-within/distance/:dis/coordinates/:coor/unit/:uni')
    .get(nearestTours)
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