const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../../middlewares/authentication');
const registerSchema = require('../../utilities/validationSchema/Register');
const loginSchema = require('../../utilities/validationSchema/Login');
// Middleware to validate request body using Joi
const validation = require('../../utilities/validator');

const { register, login, refreshUser} = require('../../controllers/user/authController');

//User Routes
router.post('/register', validation.validateBody(registerSchema), register);
router.post('/login', validation.validateBody(loginSchema), login);
router.get('/user', authenticationMiddleware, refreshUser);


module.exports = router;