const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './Config.env' });

const database = process.env.DATABASE

mongoose.connect(database, {})
    .then(connection => {
        console.log('DB connection successful');
    });


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "you should add the name"]
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, "you should add the price"]
    }
});

const Tour = mongoose.model('Tour', tourSchema);


const new_tour = new Tour({
    name: 'test3',
    rating: 5,
});

new_tour.save().then((docs) => {
    console.log(docs);
}).catch(err => {
    console.log('Error')
})

const app = require('./app');
// start express app
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`You are listening to port ${PORT}`);
    console.log('api url: 127.0.0.1:3000')
});
