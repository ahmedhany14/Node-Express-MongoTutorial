const Tour = require('./../model/tourModel')

exports.GetAllTouts = async (request, responce) => {

    try {
        // Filter the data

        const filters = request.query;


        // Some times we have some parameters that will not be used in the find method like (sort, page, .... ect), so we need to make sure that we search with a valid parameters
        const exc_params = ['page', 'sort', 'limit'];

        exc_params.forEach(ele => delete filters[ele])


        // 1) The first way, to search with the filter object taht comes from the query
        const filtere_tours = await Tour.find(filters)

        // 2) where method
        //const filtere_tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
        //const filtere_tours = await Tour.find().where('maxGroupSize').lt(10);
        responce.status(200).json({
            status: 'success',
            results: filtere_tours.length,
            data: {
                tours: filtere_tours
            }
        })
    }
    catch (err) {
        console.log("error in getting all data function")
        responce.status(404).json({
            status: 'fail',
            message: "Data base error"
        })
    }

};

// get a specific tour by id
/*
to make a parameter in the URL, we use : before the parameter name
to make the parameter optional, we use ? after the parameter name
to get the parameter value, we use request.params and from it we can get the parameter value
*/
exports.GetTour = async (request, responce) => {

    try {
        const id = request.params.id;
        const tour = await Tour.findById(id);
        // Tour.findOne({_id: id});

        responce.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        });
    } catch (err) {
        console.log('error in GetTour function');
        responce.status(404).json({
            status: 'fails',
            message: 'Invalid Id'
        });
    }
}

exports.CreateTour = async (request, responce) => {
    // to get the data user sent, we use request.body
    /*
    // Old way
    const new_tour = new Tour({});
    new_tour.save();
    */
    try {
        // new wat to create a new Tour data
        const new_tour = await Tour.create(
            request.body
        )
        responce.status(201).json({
            status: 'success',
            data: {
                tour: new_tour
            }
        })
    }
    catch (err) {
        console.log('Error in creating new tour');
        responce.status(404).json({
            status: 'fail',
            message: "Inavalid Data"
        })
    }
}

exports.UpdateTour = async (request, responce) => {

    try {
        let id = request.params.id;
        const new_tour = await Tour.findByIdAndUpdate(id, request.body, { new: true })
        responce.status(200).json({
            status: 'ok',
            data: {
                tour: new_tour
            }
        })

    } catch (err) {
        console.log('Error in UpdateTour Function')
        responce.status(404).json({
            status: 'fail',
            message: 'Something wrong',
        });

    }
}

exports.DeleteTour = async (request, responce) => {

    try {
        await Tour.findByIdAndDelete(request.params.id, request.body, { new: true })
        responce.status(200).json({
            status: 'ok',
        })
    } catch (err) {
        console.log('Error in DeleteTour Function')
        responce.status(404).json({
            status: 'fail',
            message: 'Something wrong',
        });
    }
}