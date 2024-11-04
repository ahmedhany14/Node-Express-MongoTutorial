const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId, ref: "Tour", required: [true, "booking should have a tour id."]
    }, user: {
        type: mongoose.Schema.ObjectId, ref: "users", required: [true, "booking should have a user id."]
    }, price: {
        type: Number, required: [true, "booking should have a price."]
    }, createdAt: {
        type: Date, default: Date.now()
    }, paid: {
        type: Boolean, default: true
    }
})

bookingSchema.pre(/^find/, async function (next) {
    await this.populate('user').populate({
        path: 'tour', select: 'name'
    })
    next();
});

const bookings = mongoose.model('bookings', bookingSchema)
module.exports = bookings;