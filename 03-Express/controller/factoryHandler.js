const catchAsync = require('./../Utils/catchError')
const AppError = require('./../Utils/appErros');
const ApiFeature = require('./../Utils/apiFeatures')

exports.deleteOne = Model =>
    catchAsync(async (request, response, next) => {
        const id = request.params.id;

        const deletedDoc = await Model.deleteOne({ '_id': id }, { new: true });

        response.status(200).json({
            status: 'ok',
            message: 'document deleted',
            deletedDoc
        })
    });

exports.updateOne = Model =>
    catchAsync(async (request, response, next) => {
        const id = request.params.id;

        const document = await Model.findByIdAndUpdate(
            { "_id": id },
            request.body,
            { new: true, runValidator: true }
        );
        if (document == null) return next(new AppError(`No document founded for the id: ${id}`, 404))

        response.status(200).json({
            status: 'ok', data: {
                document
            }
        })
    });

exports.create = Model =>
    catchAsync(async (request, response, next) => {
        const document = await Model.create(request.body)

        response.status(201).json({
            status: 'success', data: {
                tour: document
            }
        });
    })

exports.getOne = (Model, populateOptions) =>

    catchAsync(async (request, response, next) => {
        const id = request.params.id;

        let query = Model.findById(id);
        if (populateOptions) query = query.populate(populateOptions);
        const document = await query;

        if (document == null) return next(new AppError(`No tour founded for the id: ${id}`, 404))

        response.status(200).json({
            status: 'success', data: {
                document
            }
        });
    });

exports.getAll = (Model) =>
    catchAsync(async (request, response, next) => {

        let filter = {}
        if (request.params.id) filter = { tourId: request.params.id };

        const feature = new ApiFeature(Model.find(filter), request.query).filter().sort().limitRes().limitFields().pagination();
        const document = await feature.query;

        response.status(200).json({  
            status: 'success', results: document.length, data: {
                document
            }
        })
    });
