const axios = require('axios'); // axios import...
const encode = require('node-base64-image').encode; // base64 image encoder...


// generate random  6 digit string...
exports.generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

// generate encoded data:base64 url string...
exports.convertBase = async (url) => {
    const ans = `${url}`;
    const options = {
        string: true,
        headers: {
            'User-Agent': 'my-app',
        },
    };
    const img = await encode(ans, options);
    return img;
};


// termii send sms to phone numbers...
exports.termiiSendSms = async (phone, message) => {

    try {
        // request body...
        const requestBody = JSON.stringify({
            sms: message,
            channel: 'dnd',
            to: phone,
            api_key: process.env.TERMII_API_KEY,
            from: 'N-Alert',
            type: 'plain'
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.TERMII_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestBody
        };

        const result = await axios.request(config);
        return result; // return response...

    } catch (error) {
        return {
            status: false,
            msg: 'Error Sending OTP To Phone Number',
            error: error
        };
    }
};


// compare two numbers 
exports.compareNumbers = (num1, num2) => {
    const normalizedNum1 = num1.toString();
    const normalizedNum2 = num2.toString().substring(4);
    return (normalizedNum1 === normalizedNum2) ? true : false;
};

// convert a specific portion of the string while preserving other characters
exports.maskPhoneNumber = (phoneNumber) => {
    const prefix = phoneNumber.substring(0, 3);
    const suffix = phoneNumber.substring(7);
    const maskedNumber = prefix + '****' + suffix;
    return maskedNumber;
};