const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './Config.env' });

const database = process.env.DATABASE

mongoose.connect(database, {})
    .then(connection => {
        console.log('DB connection successful');
    });


const app = require('./app');
// start express app
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`You are listening to port ${PORT}`);
    console.log('api url: 127.0.0.1:3000')
});
