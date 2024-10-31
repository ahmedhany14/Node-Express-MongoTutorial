const catchAsync = require('./../Utils/catchError')


exports.deleteOne = Model =>
    catchAsync(async (request, resonse, next) => {
        const id = request.params.id;

        const deletedDoc = await Model.deleteOne({ '_id': id }, { new: true });

        resonse.status(200).json({
            status: 'ok',
            message: 'document deleted',
            deletedDoc
        })
    });