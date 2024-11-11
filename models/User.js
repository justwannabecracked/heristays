const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ['regular', 'admin', 'super_admin'],
            default: 'regular',
        },
        status: {
            type: String,
            enum: ['active', 'blocked', 'suspend'],
            default: 'active',
        },
        username: {
            type: String,
            required: [true, 'Enter your Username'],
        },
        fullname: {
            type: String,
            required: [true, 'Enter your Fullname'],
        },
        email: {
            type: String,
            required: [true, 'Enter your Email Address'],
            match: [
                // eslint-disable-next-line no-useless-escape
                /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                'Enter a Valid Email Address',
            ],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Enter your Password'],
            minlength: 6,
        },
        reference: {
            type: String,
        },
        isUpdated: {
            type: Boolean,
            default: true,
        },
        isAccountVerified: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

userSchema.methods.comparePassword = async function (userpassword) {
    const isMatched = await bcrypt.compare(userpassword, this.password);
    return isMatched;
};

module.exports = mongoose.model('User', userSchema);
