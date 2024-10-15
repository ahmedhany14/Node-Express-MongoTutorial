const mongoose = require("mongoose");
const slugify = require('slugify')

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [40, 'A tour name must have less or equal then 40 characters'],
            minlength: [10, 'A tour name must have more or equal then 10 characters']
            // validate: [validator.isAlpha, 'Tour name must only contain characters']
        },
        name_slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0']
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: {
            type: Number,
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        startDates: [Date]
    },
    // to apply the virtual properties, we need to make it true in the schema
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },

    }
);

// virtual properties: is a property that we can define on our schema but that will not be persisted to the database, to save space in the database
/*
For example, we want to calculate the duration weeks based on the duration days
*/
// We use get there, beacuse we need to apply the virtual properte when we get the data
tourSchema.virtual('durationinWeeks').get(function () {
    return this.duration / 7;
});


// Document middle ware, this middle ware called before when we create or save a new collection
// so we can edit the document
tourSchema.pre('save', function (next) {
    console.log('first middleware');
    // constains the created docu
    //console.log(this)
    this.name_slug = slugify(this.name, { lower: true })
    next();
})

tourSchema.pre('save', function(next){
    console.log('second middleware');
    next();
})

// this middle ware called after when we create or save a new collection
tourSchema.post('save', function(doc, next){
    console.log('third middleware after post');
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;