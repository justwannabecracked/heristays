const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            default: Date.now,
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        reference: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ['pending', 'failed', 'success', 'reversed', 'queued', 'processing,  abandoned', 'ongoing'],
            default: 'pending',
        },
        paystack_response: {
            type: Object,
            required: false,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);