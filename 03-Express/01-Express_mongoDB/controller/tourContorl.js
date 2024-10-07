const file_system = require('fs');

const tour_path = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(file_system.readFileSync(tour_path))

exports.GetAllTouts = (request, responce) => {
    responce.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
};

// get a specific tour by id
/*
to make a parameter in the URL, we use : before the parameter name
to make the parameter optional, we use ? after the parameter name
to get the parameter value, we use request.params and from it we can get the parameter value
*/
exports.GetTour = (request, responce) => {
    let id = parseInt(request.params.id);
    const tour = tours.find((element) => {
        return element.id === id;
    });

    if (!tour) {
        responce.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    else {
        responce.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        });
    }
}

exports.CreateTour = (request, responce) => {
    // to get the data user sent, we use request.body
    const new_id = tours[tours.length - 1].id + 1;
    console.log(new_id);
    const new_tour = Object.assign({ id: new_id }, request.body);
    tours.push(new_tour);
    file_system.writeFile(tour_path, JSON.stringify(tours), (err) => {
        if (err) {
            responce.status(404).json({
                status: 'fail',
                message: 'Error in writing the file'
            });
        }
        else {
            responce.status(201).json({
                status: 'success',
                data: {
                    tour: new_tour
                }
            })
        }
    });
}

exports.UpdateTour = (request, responce) => {
    let id = parseInt(request.params.id);
    let tour = tours.find((element) => {
        return element.id === id;
    });

    if (!tour) {
        responce.status(404).json({
            succes: "faild",
            message: "Invalid ID"
        })
        return;
    }
    const new_data = request.body;

    for (let key in new_data) {
        console.log(typeof key)
        tours[id][key] = new_data[key]
    }

    file_system.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        if (err) {
            responce.status(404).json({
                status: 'fail',
                message: 'Error in writing the file'
            });
        }
        else {
            responce.status(201).json({
                status: 'success modified',
                data: {
                    tour: tours[id]
                }
            })
        }
    });
}

exports.DeleteTour = (request, responce) => {
    let id = parseInt(request.params.id);
    let tour = tours.find((element) => {
        return element.id === id;
    });

    if (!tour) {
        responce.status(404).json({
            succes: "faild",
            message: "Invalid ID"
        })
        return;
    }

    const new_tours = tours.filter(ele => ele.id != id)

    file_system.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(new_tours), (err) => {
        if (err) {
            responce.status(404).json({
                status: 'fail',
                message: 'Error in writing the file'
            });
        }
        else {
            responce.status(200).json({
                status: 'ok',
            })
        }
    });
}
