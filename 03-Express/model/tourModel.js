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
        secretTour: {
            type: Boolean,
            default: false
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
            validate: {
                // Note: this only points to current doc on NEW document creation, and not on update
                validator: function (val) {
                    return val <= this.price;
                },
                message: "discount should be less than current price"
            }
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
        startDates: [Date],
        startLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        locations: [{
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }]
    },
    // to apply the virtual properties, we need to make it true in the schema
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},

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
    this.name_slug = slugify(this.name, {lower: true})
    next();
})

tourSchema.pre('save', function (next) {
    console.log('second middleware');
    next();
})

// this middle ware called after when we create or save a new collection
tourSchema.post('save', function (doc, next) {
    console.log('third middleware after post');
    next();
})

// Query middleware, we can apply middleware after queries, like find, delete and upadte..... ect


//tourSchema.pre('find', function (doc, next) {

tourSchema.pre(/^find/, function (next) {
    console.log('first find mw');
    this.find();
    next();
})

// middleware to filter the docus, that is not secret

tourSchema.pre(/^find/, function (next) {
    console.log('second find mw to filter the docs');

    this.startQuery = Date.now();
    this.find({
        secretTour: {$ne: true}
    })
    next();
})

tourSchema.post(/^find/, function (doc, next) {
    console.log('thirs find mw after filter the docs');
    console.log('query takes ', Date.now() - this.startQuery, ' ms')
    if (doc)
        console.log(doc.length)
    else
        console.log('nothing to display')
    next();
})


// aggregation middleware
// filter query from the secret tours
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift(
        {$match: {secretTour: {$ne: true}}}
    );
    console.log(this.pipeline());
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;