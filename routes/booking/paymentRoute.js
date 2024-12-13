const express = require('express');
const authenticationMiddleware = require('../../middlewares/authentication');
const router = express.Router();
const {
    startPaymentCard,
    startPaymentTransfer,
    confirmTransaction,
    verifyPayment
} = require('../../controllers/booking/paymentController');

//initialize Payment with card
router.post('/card/start', authenticationMiddleware, startPaymentCard);

// confirmation
router.get('/transaction/confirmation', authenticationMiddleware, confirmTransaction)

// initialize Payment Transfer
router.post('/transfer/start', authenticationMiddleware, startPaymentTransfer);

//Verify Payment
router.post('/webhook/verify', verifyPayment);


module.exports = router;