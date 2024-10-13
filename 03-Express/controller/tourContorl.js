const Tour = require('./../model/tourModel')
const ApiFeature = require('./../Utils/apiFeatures')

exports.GetAllTouts = async (request, response) => {

    try {
        const feature = new ApiFeature(Tour.find(), request.query).filter().sort().limitRes().limitFields().pagination();
        const tour = await feature.query;

        response.status(200).json({
            status: 'success', results: tour.length, data: {
                tours: tour
            }
        })
    } catch (err) {
        console.log("error in getting all data function")
        response.status(404).json({
            status: 'fail', message: err.message
        })
    }

};

// get a specific tour by id
/*
to make a parameter in the URL, we use : before the parameter name
to make the parameter optional, we use ? after the parameter name
to get the parameter value, we use request.params and from it we can get the parameter value
*/
exports.GetTour = async (request, response) => {

    try {
        const id = request.params.id;
        const tour = await Tour.findById(id);
        // Tour.findOne({_id: id});

        response.status(200).json({
            status: 'success', data: {
                tour: tour
            }
        });
    } catch (err) {
        console.log('error in GetTour function');
        response.status(404).json({
            status: 'fails', message: err.message,
        });
    }
}

exports.CreateTour = async (request, response) => {
    // to get the data user sent, we use request.body
    /*
    // Old way
    const new_tour = new Tour({});
    new_tour.save();
    */
    try {
        // new wat to create a new Tour data
        const new_tour = await Tour.create(request.body)
        response.status(201).json({
            status: 'success', data: {
                tour: new_tour
            }
        })
    } catch (err) {
        console.log('Error in creating new tour');
        response.status(404).json({
            status: 'fail', message: err.message,
        })
    }
}

exports.UpdateTour = async (request, response) => {

    try {
        let id = request.params.id;
        const new_tour = await Tour.findByIdAndUpdate(id, request.body, {new: true})
        response.status(200).json({
            status: 'ok', data: {
                tour: new_tour
            }
        })

    } catch (err) {
        console.log('Error in UpdateTour Function')
        response.status(404).json({
            status: 'fail', message: err.message,
        });

    }
}

exports.DeleteTour = async (request, response) => {

    try {
        await Tour.findByIdAndDelete(request.params.id, request.body, {new: true})
        response.status(200).json({
            status: 'ok',
        })
    } catch (err) {
        console.log('Error in DeleteTour Function')
        response.status(404).json({
            status: 'fail', message: err.message,
        });
    }
}


exports.GetTourDetail = async (request, response) => {
    try {
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

    } catch (err) {
        console.log('Error in GetTourDetail Function')
        response.status(404).json({
            status: 'fail', message: err.message,
        });
    }
}

exports.GetMonthlyPlan = async (request, response) => {
    try {

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

    } catch (err) {
        console.log('Error in GetTourDetail Function')
        response.status(404).json({
            status: 'fail', message: err.message,
        });
    }
}