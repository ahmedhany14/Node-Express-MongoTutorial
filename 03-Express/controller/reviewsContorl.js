const mongoose = require('mongoose')
const catchAsync = require('./../Utils/catchError')
const reviews = require('./../model/reviewsModel')


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

exports.deleteReview = catchAsync(async (request, resonse, next) => {

    const id = request.params.reviewid;
    console.log('review id', id)
    const deletedReview = await reviews.deleteOne({ '_id': id }, { new: true });

    resonse.status(200).json({
        status: 'ok',
        message: 'review deleted',
        deletedReview
    })
})