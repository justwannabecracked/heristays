require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODBURI_TEST, {
            useNewUrlParser: true,
        });
        console.log('MongoDB Connection Success!');
    } catch (err) {
        console.log('MongoDB Connection Failed!', err.message);
    }
};

module.exports = connectDB;
