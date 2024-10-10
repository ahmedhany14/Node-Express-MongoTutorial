const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "you should add the name"]
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, "you should add the price"]
    }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;