const Tour = require('./../model/tourModel')
const ApiFeature = require('./../Utils/apiFeatures')
const AppError = require('./../Utils/appErros.js')
const catchAsyncErrors = require('./../Utils/catchError.js')


exports.GetAllTouts = catchAsyncErrors(async (request, response, next) => {

    const feature = new ApiFeature(Tour.find(), request.query).filter().sort().limitRes().limitFields().pagination();
    const tour = await feature.query;

    response.status(200).json({
        status: 'success', results: tour.length, data: {
            tours: tour
        }
    })
});

// get a specific tour by id
/*
to make a parameter in the URL, we use : before the parameter name
to make the parameter optional, we use ? after the parameter name
to get the parameter value, we use request.params and from it we can get the parameter value
*/
exports.GetTour = catchAsyncErrors(async (request, response, next) => {
    const id = request.params.id;
    const tour = await Tour.findById(id);
    // Tour.findOne({_id: id});

    if (tour == null) {
        return next(new AppError(`No tour founded for the id: ${id}`, 404))
    }

    response.status(200).json({
        status: 'success', data: {
            tour: tour
        }
    });
});

exports.CreateTour = catchAsyncErrors(async (request, response, next) => {
    // to get the data user sent, we use request.body
    const new_tour = await Tour.create(request.body)    
    response.status(201).json({
        status: 'success', data: {
            tour: new_tour
        }
    })
});

exports.UpdateTour = catchAsyncErrors(async (request, response, next) => {

    let id = request.params.id;
    const new_tour = await Tour.findByIdAndUpdate(id, request.body, { new: true })

    if (tour == null) {
        return next(new AppError(`No tour founded for the id: ${id}`, 404))
    }


    response.status(200).json({
        status: 'ok', data: {
            tour: new_tour
        }
    })
});

exports.DeleteTour = catchAsyncErrors(async (request, response, next) => {
    const tour =  await Tour.findByIdAndDelete(request.params.id, request.body, { new: true })

    if (tour == null) {
        return next(new AppError(`No tour founded for the id: ${id}`, 404))
    }

    response.status(200).json({
        status: 'ok',
    })
});



exports.GetTourDetail = catchAsyncErrors(async (request, response, next) => {
    const stats = await Tour.aggregate([{
        $match: { ratingsAverage: { $gte: 4.5 } }
    }, {
        $group: {
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRate: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            sumPrice: { $sum: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
        }
    }, {
        $match: { _id: { $ne: 'EASY' } }
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

    const plan = await Tour.aggregate([{ $unwind: "$startDates" }, {
        $match: {
            startDates: {
                $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`),
            }
        }
    }, {
        $group: {
            '_id': { $month: '$startDates' }, numTours: { $sum: 1 }, tours: { $push: '$name' }
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