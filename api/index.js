/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const listEndPoints = require('list_end_points');
const passport = require('../controllers/user/ssoAuthController');
const connectDB = require('../config/db');
const notFound = require('../middlewares/not-found');
const errorHandler = require('../middlewares/error-handler');
const morgan = require('morgan');


connectDB();
const app = express();

// We are using this for the express-rate-limit middleware
// app.enable('trust proxy');
app.set('trust proxy', 1);

app.use(express.json({ limit: '10mb' }));
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Express session middleware
// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//root route
app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to Heristays API',
        status: 'success',
        data:
        {
            name: 'Heristays',
            version: '1.0.0'
        }
    });
});

// Routes
// Authentication routes
app.use('/api/v1/auth', require('../routes/user/auth'));

//Google and Facebook SSO routes
app.use('/api/v1', require('../routes/user/authsso'));

// Admin Dashboard routes
app.use('/api/v1/property', require('../routes/admin/admin'));

// User Payment routes
app.use('/api/v1/payment', require('../routes/booking/paymentRoute'));


// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Use express's default error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    res.status(400).json({ message: err.message });
});

listEndPoints.default(app); //lists all endpoints on the console...

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

