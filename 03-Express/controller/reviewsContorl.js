const mongoose = require('mongoose')
const catchAsync = require('./../Utils/catchError')
const reviews = require('./../model/reviewsModel')
const factory = require('./factoryHandler')

exports.writeReview = catchAsync(async (request, resonse, next) => {

    const new_review = {
        review: request.body.review,
        rating: request.body.rating,
        createdAt: Date.now(),
        userId: request.user.id,
        tourId: request.params.id
    }
    await reviews.create(new_review);

    resonse.status(200).json({
        message: "ok",
        new_review
    })
})



exports.getReviews = catchAsync(async (request, resonse, next) => {

    const tour_reviews = await reviews.find({ tourId: request.params.id });

    resonse.status(200).json({
        message: "ok",
        tour_reviews
    })

})

exports.updateReview = factory.updateOne(reviews);
exports.deleteReview = factory.deleteOne(reviews);