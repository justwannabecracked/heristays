const axios = require('axios'); // axios import...

// generate jwt token...
exports.generateRefreshToken = function(user) {
    return jwt.sign({ id: user.id , username: user.username, fullname: user.fullname, email: user.email, role: user.role,}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME // Longer expiration for refresh token
    });
}

// generate random  6 digit string...
exports.generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
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