const {Model} = require('mongoose')
const Tour = require('./../model/tourModel')
const ApiFeature = require('./../Utils/apiFeatures')
const AppError = require('./../Utils/appErros.js')
const catchAsyncErrors = require('./../Utils/catchError.js')
const factory = require('./factoryHandler.js')

exports.GetAllTouts = factory.getAll(Tour)
exports.GetTour = factory.getOne(Tour, {path: 'guides'});
exports.CreateTour = factory.create(Tour);
exports.UpdateTour = factory.updateOne(Tour);
exports.DeleteTour = factory.deleteOne(Tour);


exports.GetTourDetail = catchAsyncErrors(async (request, response, next) => {
    const stats = await Tour.aggregate([{
        $match: {ratingsAverage: {$gte: 4.5}}
    }, {
        $group: {
            _id: {$toUpper: '$difficulty'},
            numTours: {$sum: 1},
            numRatings: {$sum: '$ratingsQuantity'},
            avgRate: {$avg: '$ratingsAverage'},
            avgPrice: {$avg: '$price'},
            sumPrice: {$sum: '$price'},
            minPrice: {$min: '$price'},
            maxPrice: {$max: '$price'},
        }
    }, {
        $match: {_id: {$ne: 'EASY'}}
    }

    ])
    response.status(200).json({
        status: 'ok', data: {
            stats
        }
    })

});

exports.GetMonthlyPlan = catchAsyncErrors(async (request, response, next) => {

    const year = request.params.year;

    const plan = await Tour.aggregate([{$unwind: "$startDates"}, {
        $match: {
            startDates: {
                $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`),
            }
        }
    }, {
        $group: {
            '_id': {$month: '$startDates'}, numTours: {$sum: 1}, tours: {$push: '$name'}
        }
    }, {
        $addFields: {
            month: '$_id'
        }
    }, {
        $project: {
            _id: 0
        }
    }, {
        $sort: {
            month: 1
        }
    }])

    response.status(200).json({
        status: 'ok', length: plan.length, data: {
            plan
        }
    })
});

exports.nearestTours = catchAsyncErrors(async (request, response, next) => {
    const {dis, coor, uni} = request.params;
    const [lat, lng] = coor.split(',');

    const radius = uni === 'mi' ? dis / 3963.2 : dis / 6378.1;

    console.log(radius, lng, lat, uni)
    const filter = {
        'startLocation.coordinates': {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius]
            }
        }
    }
    const tours = await Tour.find(filter);

    response.status(200).json({
        status: "ok",
        length: tours.length,
        tours
    })
});