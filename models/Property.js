const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
    {
        created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        title: {
            type: String,
            required: [true, 'Enter the Title of the Property'],
        },
        description: {
            type: String,
            required: [true, 'Enter the Description of the Property'],
        },
        rating: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Enter the Price of the Property'],
        },
        location: {
            type: String,
            required: [true, 'Enter the Location of the Property'],
        },
        propertyType: {
            type: String,
            required: [true, 'Enter the Type of the Property'],
        },
        status: {
            type: String,
            enum: ['available', 'booked'],
            default: 'available',
        },
        images: {
            type: Array,
            required: [true, 'Upload at least one Image of the Property'],
        },
        guestCapacity: {
            type: Number,
            required: [true, 'Enter the Guest Capacity of the Property'],
        },
        bedrooms: {
            type: Number,
            required: [true, 'Enter the Number of Bedrooms in the Property'],
        },
         privateBed: {
               type: Number,
            required: [true, 'Enter the Number of Private Bedrooms in the Property'],
        },
        privateBathroom: {
            type: Boolean,
            default: false,
        },
        dedicatedBathroom:{
            type: Boolean,
            default: false, 
        },
        sharedBathroom:{
            type: Boolean,
            default: false, 
        },
        minimumNights:{
               type: Number,
            required: [true, 'Enter the Number of Minimum Nights'],
        },
       maximumNights:{
               type: Number,
            required: [true, 'Enter the Number of Maximum Nights'],
        },
        amenities: {
            type: [String],
            required: [true, 'Enter the Amenities of the Property'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        bookings: [
            {
                checkin: {
                    type: Date,
                },
                checkout: {
                    type: Date,
                },
                guests: {
                    type: Number,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        // reviews: [
        //     {
        //         user: {
        //             type: mongoose.Schema.ObjectId,
        //             ref: 'User',
        //         },
        //         review: {
        //             type: String,
        //             required: [true, 'Enter the Review of the Property'],
        //         },
        //         rating: {
        //             type: Number,
        //             required: [true, 'Enter the Rating of the Property'],
        //         },
        //         date: {
        //             type: Date,
        //             default: Date.now,
        //         },
        //     },
        // ],
    },
    { timestamps: true }
);


module.exports = mongoose.model('Property', propertySchema);
