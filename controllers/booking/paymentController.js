const crypto = require('crypto');
const secret = process.env.PAYSTACK_SECRET_KEY;
// const bodyParser = require('body-parser');
const request = require('request');
const User = require('../../models/User');
const helper = require('../../utilities/helpers/help');
const Booking = require('../../models/Booking');
const Transaction = require('../../models/Transaction');
const { initializePaymentWithCard, initializePaymentWithBankTranfer } = require('./paystackApi')(request);

const startPaymentCard = async (req, res) => {
    try {
        const {id} = req.user;
        const { booking, charge } = req.body;
        if (!booking || !charge) { 
            return res.status(400).json({
                status: false,
                msg: 'Please provide booking and charge amount',
            });
        }


        const random = helper.generateOTP();
        const ref = `res-${random}-${id}`;
        const transaction = await Transaction.create({
            created_by: id,
            reference: ref,
        });

        await transaction.save();

        const user = await User.findById({ _id: id });
        const email = user.email.toLowerCase();
        const amount = charge * 100;
       
        const data = {
            email,
            amount,
            reference: `${ref}`,
            metadata: { booking: {...booking} },
            channels: ['card'],
        };


        initializePaymentWithCard(data, (error, body) => {
            if (error) {
                return res
                    .status(400)
                    .json({ msg: `${error.message}`, status: false });
            }
            const response = JSON.parse(body.body);
            return res.status(200).json({
                msg: 'Initialization Successful',
                status: true,
                data: response,
            });
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            msg: 'Server Error',
            error: err.message,

        });
    }
};

const startPaymentTransfer = async (req, res) => {
    try {
        const { id } = req.user;

        const { booking, charge } = req.body;
        if (!booking || !charge) { 
            return res.status(400).json({
                status: false,
                msg: 'Please provide booking and charge amount',
            });
        }


        const random = helper.generateOTP();
        const ref = `res-${random}-${id}`;
        const transaction = await Transaction.create({
            created_by: id,
            reference: ref,
        });

        await transaction.save();

        const user = await User.findById({ _id: id });
        const email = user.email.toLowerCase();
        const amount = charge * 100;
       
        const data = {
            email,
            amount,
            reference: `${ref}`,
            metadata: { booking: {...booking} },
            channels: ['bank_transfer'],
        };

        initializePaymentWithBankTranfer(data, (error, body) => {
            if (error) {
                return res
                    .status(400)
                    .json({ msg: `${error.message}`, status: false });
            }
            const response = JSON.parse(body.body);
            return res.status(200).json({
                msg: 'Initialization Successful',
                status: true,
                data: response,
            });
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            msg: 'Server Error',
            error: err.message,

        });
    }
};


const verifyPayment = async (req, res) => {
    // Validate event
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash !== req.headers['x-paystack-signature']) {
        return res.status(400).json({ message: 'Invalid signature', status: false });
    }

    // Retrieve the request's body
    const event = req.body;

    if (event && event.event === 'charge.success') {
        console.log(event);
        const user = await User.findOne({ email: event.data.customer.email });
        if (!user) {
            return res.status(400).json({ message: 'User not found, Something went wrong', status: false });
        }
        const transaction = await Transaction.findOne({ reference: event.data.reference });
        if (!transaction) {
            return res.status(400).json({ message: 'Transaction not found', status: false });
        }
        transaction.status = event.data.status;
        transaction.paystack_response = event.data;
        await transaction.save();

            // Create a booking
            const orderRef = `#${helper.generateOTP()}`;
            const order = await Booking.create({
                order_num: orderRef,
                booking_info: event.data.metadata.booking,
                user_obj: user,
                payment_method: event.data.authorization.channel,
                user_card_info: event.data.authorization,
                created_by: user._id,
            });

            console.log(`Booking ${order.order_num} was successful`);

        return res.status(200).json({ message: 'Transfer successful, orders processed.' });
    } else {
        console.log(res);
        return res.status(400).json({ message: 'Event type is not charge.success', status: false });
    }
};

module.exports = {
    startPaymentCard,
    verifyPayment,
    startPaymentTransfer,
};