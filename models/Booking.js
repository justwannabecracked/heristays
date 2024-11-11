const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            default: Date.now,
        },
        order_num: {
            type: String,
            unique: true,
        },
        booking_info: {
            type: Object,
        },
        user_obj: {
            type: Object,
        },
        payment_method: {
            type: String,
        },
        user_card_info: {
            type: Object,
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);