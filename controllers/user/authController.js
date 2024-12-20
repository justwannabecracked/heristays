require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Property = require('../../models/Property');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body;

        if (!email || !password || !fullname || !username) {
            return res.status(400).json({
                status: false,
                msg: 'Kindly Enter all Fields',
            });
        }

        const mailExist = await User.findOne({ email: email });
        if (mailExist) {
            return res.status(400).json({
                status: false,
                msg: 'User with this Email Already Exist!',
            });
        }

        const salt = bcrypt.genSaltSync(12);
        const hashPassword = await bcrypt.hash(password, salt);

        const users = await User.find({}); // get all customers...
        // save customer details
        const newUser = await User.create({
            username: req.body.username.charAt(0).toUpperCase() + username.slice(1),
            fullname: req.body.fullname,
            email: req.body.email.toLowerCase(),
            password: hashPassword,
            reference: `HER-${users.length + 1}`,
        });

        await newUser.save(); // store customer data...
        const createdUser = await User.findOne({ email }).select('-password');
        if (!createdUser) {
            return res.status(400).json({
                status: false,
                msg: 'User does not exist',
            });
        }

        const payload = {
            user: {
                id: createdUser._id,
                username: createdUser.username,
                fullname: createdUser.fullname,
                email: createdUser.email,
                role: createdUser.role,
            },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_LIFETIME,
        });


        return res.status(200).json({
            status: true,
            msg: 'Successfully Registered',
            data: { token: token, user: createdUser },
        });


    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            status: false,
            msg: 'Server Error',
        });
    }
};


// @desc    Login a user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                msg: 'Invalid email address or password credentials',
                status: false,
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                msg: 'Invalid email address or password credentials',
                status: false,
            });
        }

         if(user.status === 'blocked' || user.status === 'suspend') {
            return res.status(400).json({
                msg: 'Account Disabled, Please Contact Support',
                status: false,
            });
        }


        const payload = {
            user: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_LIFETIME,
        });


        return res.status(200).json({
            status: true,
            msg: 'Login successful',
            data: { token, user: user },
        });
    } catch (err) {
        return res.status(500).json({
            msg: 'Failed to sign you in, Please contact support if this persist!',
            status: false,
        });
    }
};

//@desc   Get User
//@route  GET /api/v1/auth/user
//@access Private

const refreshUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(400).json({
                msg: 'Invalid Authorization',
                status: false,
            });
        }

        const payload = {
            user: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                role: user.role,

            },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_LIFETIME,
        });
        return res.status(200).json({
            status: true,
            msg: 'Successfully Refreshed',
            data: { token, user },
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            msg: 'Server Error',
            status: false,
        });
    }
};

const searchProperties = async (req, res) => {
    try {
        const { location, checkin, checkout, guests, limit = 10, page = 1 } = req.query;

        // Validate required parameters
        if (!location || !checkin || !checkout || !guests) {
            return res.status(400).json({
                message: 'Please provide location, checkin, checkout, and number of guests'
            });
        }

        const checkInDate = new Date(checkin);
        const checkOutDate = new Date(checkout);

        // Pagination settings
        const pageLimit = parseInt(limit, 10);
        const skip = (parseInt(page, 10) - 1) * pageLimit;

        // Query to find available properties
        const properties = await Property.find({
            location: location,
            guestCapacity: { $gte: guests },
            status: 'available',
            bookings: {
                $not: {
                    $elemMatch: {
                        $or: [
                            { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
                        ]
                    }
                }
            }
        })
        .skip(skip)
        .limit(pageLimit);

        // Count total results for pagination
        const totalResults = await Property.countDocuments({
            location: location,
            guestCapacity: { $gte: guests },
            status: 'available',
            bookings: {
                $not: {
                    $elemMatch: {
                        $or: [
                            { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
                        ]
                    }
                }
            }
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalResults / pageLimit);

        res.status(200).json({
            message: 'Properties found',
            data: {
                properties,
                totalResults,
                totalPages,
                currentPage: parseInt(page, 10),
                pageLimit
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { register, login , refreshUser, searchProperties };

