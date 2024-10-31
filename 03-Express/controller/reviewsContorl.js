const mongoose = require('mongoose')
const catchAsync = require('./../Utils/catchError')
const reviews = require('./../model/reviewsModel')
const factory = require('./factoryHandler')


exports.setUpBodyForCreateNewReview = (request, response, next) => {
    request.body.userId = request.user.id;
    request.body.tourId = request.params.id;
    next();
};

exports.writeReview = factory.create(reviews);


exports.getReviews = catchAsync(async (request, response, next) => {

    const tour_reviews = await reviews.find({ tourId: request.params.id });

    response.status(200).json({
        message: "ok",
        tour_reviews
    })

})

exports.updateReview = factory.updateOne(reviews);
exports.deleteReview = factory.deleteOne(reviews);