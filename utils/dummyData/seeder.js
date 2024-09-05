const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
require('colors');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs')
const Product = require('../../models/product_models');
const dbConnection = require('../../config/database_config');
const usersDB = require('../../models/user_models')
const reviews = require('../../models/reviews_models')

dotenv.config({ path: '../../config/config.env' });

// connect to DB
dbConnection();

// Read data
const products = JSON.parse(fs.readFileSync('./products.json'));

// Insert data into DB
const insertData = async () => {
    try {
        await Product.create(products);

        console.log('Data Inserted'.green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// Delete data from DB
const destroyData = async () => {
    try {
        await Product.deleteMany();
        console.log('Data Destroyed'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

const removeUsers = async () => {
    try {
        await usersDB.deleteMany();
        console.log('Users Destroyed'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

const createEncrypterTest = async () => {
    const hashedPassword1 = await bcryptjs.hash('password123', 10);
    console.log(`Hashed password1: ${hashedPassword1}`);
    const hashedPassword2 = await bcryptjs.hash('password123', 10);
    console.log(`Hashed password2: ${hashedPassword2}`);
    process.exit();

}

const clearAllReviews = async () => {
    try {
        await reviews.deleteMany();
        console.log('Reviews Destroyed'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

// console.log(`second item -> ${products.argv[1]} || third item -> ${products.argv[2]}`)

// node seeder.js -d
if (process.argv[2] === '-i') {
    insertData();
} else if (process.argv[2] === '-d') {
    destroyData();
}

if (process.argv[2] === '-u') {
    removeUsers();
}

if (process.argv[2] === '-c') {
    const test = new Promise(() => { createEncrypterTest() })

    test.then(() => {
        process.exit();
    }).catch(() => {
        process.exit();

    })

}

if (process.argv[2] === '-r') {
    clearAllReviews()
    // process.exit();
}

else {
    console.log('Invalid arguments provided'.red.inverse);
    process.exit();
}
// (function test() {
//     console.log('No valid arguments provided')
// })()