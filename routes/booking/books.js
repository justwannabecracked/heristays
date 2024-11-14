const express = require('express');
const authenticationMiddleware = require('../../middlewares/authentication');
const router = express.Router();
const {
    getBooking,
    getBookings,
} = require('../../controllers/booking/booking');


router.get('/all', authenticationMiddleware, getBookings);


router.get('/one/:id', authenticationMiddleware, getBooking);


module.exports = router;