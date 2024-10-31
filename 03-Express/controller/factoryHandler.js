const catchAsync = require('./../Utils/catchError')
const AppError = require('./../Utils/appErros')

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