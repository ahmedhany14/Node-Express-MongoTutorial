const mongoose = require('mongoose')
const reviews = require('./../model/reviewsModel')
const factory = require('./factoryHandler')


exports.setUpBodyForCreateNewReview = (request, response, next) => {
    request.body.userId = request.user.id;
    request.body.tourId = request.params.id;
    next();
};

exports.writeReview = factory.create(reviews);
exports.getReviews = factory.getAll(reviews)
exports.updateReview = factory.updateOne(reviews);
exports.deleteReview = factory.deleteOne(reviews);