const mongoose = require('mongoose');
const Tour = require('./tourModel.js')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String, required: [true, 'please provide a review']
    },
    rating: {
        type: Number, max: 5, min: 1, required: [true, 'please provide a rating']
    }, createdAt: {
        type: Date, default: Date.now()
    }, userId: {
        type: mongoose.Schema.ObjectId, ref: "users", required: [true, 'please provide a user id']
    }, tourId: {
        type: mongoose.Schema.ObjectId, ref: 'Tour', required: [true, 'please provide a tour id']
    }
}, // to apply the virtual properties, we need to make it true in the schema
    {
        toJSON: { virtuals: true }, toObject: { virtuals: true },
    });

// this index will not all users to add multiple reviews on the same tour
reviewSchema.index({ tourId: 1, userId: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {

    this.populate({
        path: "userId",
        select: 'name photo -_id'
    }).populate({
        path: "tourId",
        select: 'name'
    })
    next();
})

reviewSchema.statics.calcAverageRating = async function (tourId) {

    console.log(tourId)
    const stats = await this.aggregate([
        { $match: { tourId: tourId } },
        {
            $group: {
                '_id': "$tourId",
                nRatings: { $sum: 1 },
                avgRatings: { $avg: '$rating' },
            }
        }
    ])

    await Tour.findByIdAndUpdate(tourId,
        {
            ratingsQuantity: stats[0].nRatings,
            ratingsAverage: stats[0].avgRatings,
        }
    );
}

reviewSchema.post('save', function () {
    this.constructor.calcAverageRating(this.tourId);
})


const reviews = mongoose.model('reviews', reviewSchema);

module.exports = reviews;