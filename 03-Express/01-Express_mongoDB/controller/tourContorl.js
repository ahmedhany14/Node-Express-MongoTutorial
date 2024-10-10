const Tour = require('./../model/tourModel')

exports.GetAllTouts = async (request, responce) => {

    try {
        const allTours = await Tour.find();
        responce.status(200).json({
            status: 'success',
            results: allTours.length,
            data: {
                tours: allTours
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
        let id = request.params.id;
        const new_tour = await Tour.findByIdAndDelete(id, request.body, { new: true })
        responce.status(200).json({
            status: 'ok',
            data: {
                tour: new_tour
            }
        })
    } catch (err) {
        console.log('Error in DeleteTour Function')
        responce.status(404).json({
            status: 'fail',
            message: 'Something wrong',
        });
    }
}