const express = require('express');
const file_system = require('fs');

const app = express();

// middleware
app.use(express.json());

// tours api


// get all tours
const tours = JSON.parse(file_system.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
app.get('/api/v1/tours', (request, responce) => {

    responce.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
});

// get a specific tour by id

app.get('/api/v1/tours/:id', (request, responce) => {
    console.log(request.params);
    let id = request.params.id;
    id = parseInt(id.slice(1));
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
});


// Post a new tour
app.post('/api/v1/tours', (request, responce) => {
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
});


// start express app
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`You are listening to port ${PORT}`);
    console.log('api url: 127.0.0.1:3000')
});


// Create a route response for the root URL
/*
get is a method that used to send a response to a get request
*/

/*
app.get('/', (request, responce) => {

    // to send a message response
    //responce.send("Hany tells you to go to /about");

    // to send a JSON response
    responce.json({
        name: "Hany",
        age: 22,
        location: "EGY"
    });
});
*/


/*
post is a method that used to send a response to a post request
it is different from get method, in post method you can send a body with the request
*/
/*
app.post('/', (request, responce) => {
    responce.send('You can post to this URL');
})
*/