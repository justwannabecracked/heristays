const Booking = require('../../models/Booking');
// const User = require('../../models/User');


const getBookings = async (req, res) => {
    const {id} = req.user;
    try {
        const bookings = await Booking.find({created_by: id});
        if (!bookings) {
            return res.status(404).json({
                status: false,
                msg: 'No bookings found',
            });
        }
        res.status(200).json({
            status: true,
            msg: 'Bookings fetched successfully',
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: 'Error fetching bookings',
            data: error,
        });
    }
}

const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
        if (!booking) {
            return res.status(404).json({
                status: false,
                msg: 'Booking not found',
            });
        }
        res.status(200).json({
            status: true,
            msg: 'Booking fetched successfully',
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: 'Error fetching booking',
            data: error,
        });
    }
}


module.exports = {
    getBookings,
    getBooking
}