const dotenv = require('dotenv');
const mongoose = require('mongoose');
const file_system = require('fs')

dotenv.config({path: './Config.env'});
const database = process.env.DATABASE

const tours = JSON.parse(file_system.readFileSync(`${__dirname}/tours.json`, 'utf-8'));


mongoose.connect(database, {})
    .then(connection => {
        console.log('DB connection successful');
    }).catch(err => {
    console.log("DataBase connection error");
})

// node dev-data/data/importingScript.js to run the script
console.log(process.argv);

const Tours = require('./../../model/tourModel')

async function loadata() {
    try {
        await Tours.create(tours)
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
        console.log("Data dropped succesfully");
    } catch (err) {
        console.log('error in dropping the data')
        console.log(err.message)
    }
    process.exit();
}

const arg = process.argv.find(val => val === '--add')

if (arg === '--add') {
    console.log('adding data')
    loadata();
}
if (arg === '--drop') {
    dropdata();
}