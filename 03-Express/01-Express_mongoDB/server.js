const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const database = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
console.log(database);
mongoose.connect(database, {})
    .then(connection => {
        console.log(connection.connections);
        console.log('DB connection successful');
    });
const app = require('./app');
// start express app
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`You are listening to port ${PORT}`);
    console.log('api url: 127.0.0.1:3000')
});
