const {Model} = require('mongoose')
const Tour = require('./../model/tourModel')
const ApiFeature = require('./../Utils/apiFeatures')
const AppError = require('./../Utils/appErros.js')
const catchAsyncErrors = require('./../Utils/catchError.js')
const factory = require('./factoryHandler.js')
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();
const filterMulter = (request, file, callback) => {
    file.mimetype.startsWith('image') ? callback(null, true) : callback(new AppError('Not an image! Please upload only images', 400), false)
}
exports.resizeImages = catchAsyncErrors(async (request, response, next) => {

    // image Cover
    const coverFileName = `tour-${request.params.id}-${Date.now()}.jpeg`;
    await sharp(request.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/img/tours/${coverFileName}`)
    request.body.imageCover = coverFileName;

    // images
    request.body.images = [];
    await Promise.all(request.files.images.map(async (file, index) => {
        const imageFile = `tour-${request.params.id}-${Date.now()}-${index}.jpeg`;
        await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(`public/img/tours/${imageFile}`)
        request.body.images.push(imageFile);

    }));
    next();
});
const upload = multer({
    storage: multerStorage, fileFilter: filterMulter
})
// this is for multiple images, the name should be the same as the name in the schema
// maxCount is the number of images that can be uploaded
// this is for single image
exports.uploadImages = upload.fields([{name: "imageCover", maxCount: 1}, {name: "images", maxCount: 3}])

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

    if (!dis || !lat || !lng || !uni) {
        return next(new AppError('Provide a correct data ya kosomak', 400))
    }
    const radius = uni === 'mi' ? dis / 3963.2 : dis / 6378.1;

    const filter = {
        'startLocation.coordinates': {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius]
            }
        }
    }
    const tours = await Tour.find(filter);

    response.status(200).json({
        status: "ok", length: tours.length, tours
    })
});

exports.distanceTours = catchAsyncErrors(async (request, response, next) => {
    const {coor, uni} = request.params;
    const [lat, lng] = coor.split(',');

    if (!lat || !lng || !uni) {
        return next(new AppError('Provide a correct data ya kosomak', 400))
    }
    const multi = uni === 'mi' ? .000621371 : .001;

    const pipline = [{
        $geoNear: {
            near: {
                type: 'Point', coordinates: [+lng, +lat]
            }, distanceField: `distance`, distanceMultiplier: multi
        }
    }, {
        $project: {
            name: 1, distance: 1
        }
    }];
    const tours = await Tour.aggregate(pipline)

    response.status(200).json({
        status: "ok", length: tours.length, tours
    })
});