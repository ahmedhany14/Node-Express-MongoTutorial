const dotenv = require('dotenv');
const mongoose = require('mongoose');
const file_system = require('fs')
const Tours = require('./../../model/tourModel')
const Users = require('./../../model/userModel')
const Reviews = require('./../../model/reviewsModel')

dotenv.config({ path: './Config.env' });
const database = process.env.DATABASE

const tours = JSON.parse(file_system.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(file_system.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(file_system.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));


mongoose.connect(database, {})
    .then(connection => {
        console.log('DB connection successful');
    }).catch(err => {
        console.log("DataBase connection error");
    })

// node dev-data/data/importingScript.js to run the script
console.log(process.argv);

async function loadata() {
    try {
        await Tours.create(tours)
        await Users.create(users, { validateBeforeSave: false });
        await Reviews.create(reviews)

        console.log("Data added succesfully");
    } catch (err) {
        console.log('error in adding the data')
        console.log(err.message)
    }
    process.exit();
}

async function dropdata() {
    try {
        await Tours.deleteMany();
        await Users.deleteMany();
        await Reviews.deleteMany();

        console.log("Data dropped succesfully");
    } catch (err) {
        console.log('error in dropping the data')
        console.log(err.message)
    }
    process.exit();
}

const arg = process.argv[2];

if (arg === '--add') loadata();
if (arg === '--drop') dropdata();