const mongoose = require("mongoose");
const slugify = require('slugify')
const users = require('./userModel')

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
            max: [5, 'Rating must be below 5.0'],
            set: val => Math.round(val * 10) / 10
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
        }],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "users"
            }
        ]
    },
    // to apply the virtual properties, we need to make it true in the schema
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
);

// index
/*
when we have a lot of data, we can use index to make the search faster
the data that we will search for it, we can make it index to make the search faster
*/
// 1 for ascending order, -1 for descending order
tourSchema.index({price: 1})
tourSchema.index({price: 1, ratingsAverage: -1})
tourSchema.index({ratingsAverage: -1})
tourSchema.index({name_slug: 1})

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
    this.name_slug = slugify(this.name, {lower: true})
    next();
})

/*tourSchema.pre('save', async function (next) {
    const guides = this.guides.map(async user => await users.findById(user))
    this.guides = await Promise.all(guides);
    next();
})*/

tourSchema.pre(/^find/, function (next) {
    this.startQuery = Date.now();
    this.find({
        secretTour: {$ne: true}
    }).populate({
        path: 'guides',
        select: "-__v -passwordChangedAt"
    });
    next();
})

tourSchema.post(/^find/, function (doc, next) {
    console.log('query takes ', Date.now() - this.startQuery, ' ms')
    if (doc) console.log(doc.length)
    else console.log('nothing to display')
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