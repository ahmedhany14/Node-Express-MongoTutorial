const express = require('express');
const file_system = require('fs');
const app = express();
app.use(express.json()); // middleware
const tours = JSON.parse(file_system.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


const GetAllTouts = (request, responce) => {

    responce.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
};

const GetTour = (request, responce) => {
    console.log(request.params);
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

const CreateTour = (request, responce) => {
    // to get the data user sent, we use request.body
    const new_id = tours[tours.length - 1].id + 1;
    const new_tour = Object.assign({ id: new_id }, request.body);
    tours.push(new_tour);

    file_system.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
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
    //responce.send('Done');
}

const UpdateTour = (request, responce) => {
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

const DeleteTour = (request, responce) => {
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



// get a specific tour by id
/*
to make a parameter in the URL, we use : before the parameter name
to make the parameter optional, we use ? after the parameter name
to get the parameter value, we use request.params and from it we can get the parameter value
*/
/*
app.get('/api/v1/tours', GetAllTouts);
app.get('/api/v1/tours/:id', GetTour);
app.post('/api/v1/tours', CreateTour); // Create a new tour
app.patch('/api/v1/tours/:id', UpdateTour); // Update a tour
app.delete('/api/v1/tours/:id', DeleteTour); // Delete a tour
*/


app.route('/api/v1/tours')
    .get(GetAllTouts)
    .post(CreateTour);
app.route('/api/v1/tours/:id')
    .get(GetTour)
    .patch(UpdateTour)
    .delete(DeleteTour);

// start express app
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`You are listening to port ${PORT}`);
    console.log('api url: 127.0.0.1:3000')
});