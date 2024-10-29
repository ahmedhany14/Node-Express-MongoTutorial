const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
        rating: {
            type: Number, max: 5, min: 1, required: [true, 'please provide a rating']
        }, createdAt: {
            type: Date, default: Date.now()
        }, userId: {
            type: mongoose.Schema.ObjectId, ref: "users", required: [true, 'please provide a user id']
        }, tourId: {
            type: mongoose.Schema.ObjectId, ref: 'tours', required: [true, 'please provide a tour id']
        }
    }, // to apply the virtual properties, we need to make it true in the schema
    {
        toJSON: {virtuals: true}, toObject: {virtuals: true},
    });


const reviews = mongoose.model('reviews', reviewSchema);
module.exports = reviews;