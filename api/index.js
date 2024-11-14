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
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import Socket.IO

const allowedOrigins = ['https://drumroll-test.vercel.app', 'http://localhost:5173'];

// Connect to the database
connectDB();

const app = express();
const server = http.createServer(app); // Create an HTTP server with Express
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
}); // Set up Socket.IO server with CORS

app.set('trust proxy', 1);

app.use(express.json({ limit: '10mb' }));
app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(morgan('combined'));

// Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Make Socket.IO accessible in routes and controllers
app.set('socketio', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

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

// Booking routes
app.use('/api/v1/booking', require('../routes/booking/books'));

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

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

