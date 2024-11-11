const axios = require('axios');

const paystackApi = (request) => {
    const initializePaymentWithCard = (form, mycallback) => {
        const options = {
            url: 'https://api.paystack.co/transaction/initialize',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_APP_KEY}`,
                'Content-type': 'application/json',
            },
            form,
        };
        const callback = (error, body) => {
            return mycallback(error, body);
        };
        request.post(options, callback);
    };

    const initializePaymentWithBankTranfer = (form, mycallback) => {
        const options = {
            url: 'https://api.paystack.co/transaction/initialize',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_APP_KEY}`,
                'Content-type': 'application/json',
            },
            form,
        };
        const callback = (error, body) => {
            return mycallback(error, body);
        };
        request.post(options, callback);
    };

    const initializePaymentWithQRCode = (form, mycallback) => {
        const options = {
            url: 'https://api.paystack.co/transaction/initialize',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_APP_KEY}`,
                'Content-type': 'application/json',
            },
            form,
        };
        const callback = (error, body) => {
            return mycallback(error, body);
        };
        request.post(options, callback);
    };


    const initializePaymentWithUssd = (form, mycallback) => {
        const options = {
            url: 'https://api.paystack.co/transaction/initialize',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_APP_KEY}`,
                'Content-type': 'application/json',
            },
            form,
        };
        const callback = (error, body) => {
            return mycallback(error, body);
        };
        request.post(options, callback);
    };


    const initializePaymentWithBank = (form, mycallback) => {
        const options = {
            url: 'https://api.paystack.co/transaction/initialize',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_APP_KEY}`,
                'Content-type': 'application/json',
            },
            form,
        };
        const callback = (error, body) => {
            return mycallback(error, body);
        };
        request.post(options, callback);
    };

    const createSubaccount = (form, mycallback) => {
        const options = {
            url: 'https://api.paystack.co/subaccount',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_APP_KEY}`,
                'Content-type': 'application/json',
            },
            form,
        };
        const callback = (error, body) => {
            return mycallback(error, body);
        };
        request.post(options, callback);
    };

    const listBanks = async () => {
        const options = {
            url: 'https://api.paystack.co/bank',
            method: 'get',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_APP_KEY}`,
                'Content-type': 'application/json',
            },
        };

        try {
            const response = await axios(options);
            return response.data;
        } catch (error) {
            return error; // Handle errors
        }
    };


    return { initializePaymentWithCard, createSubaccount, listBanks, initializePaymentWithBankTranfer, initializePaymentWithQRCode, initializePaymentWithUssd, initializePaymentWithBank };
};

module.exports = paystackApi;