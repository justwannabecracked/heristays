const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../../middlewares/authentication');
const multer = require('multer');
const upload = multer();
// const registerSchema = require('../../utilities/validationSchema/Register');
// const loginSchema = require('../../utilities/validationSchema/Login');
// Middleware to validate request body using Joi
// const validation = require('../../utilities/validator');

const { addProperty,getPropertyById, updateProperty, getProperties, deleteProperty, dashboardSummary} = require('../../controllers/admin/admin');

//  Admin Routes

router.get('/all', getProperties);
router.get('/dashboard/summary', authenticationMiddleware, dashboardSummary);
router.get('/one/:id', getPropertyById);
router.post('/add', authenticationMiddleware, upload.array('images', 10) , addProperty);
router.put('/update/one/:id', authenticationMiddleware, upload.array('images', 10), updateProperty);
router.delete('/delete/one/:id',  authenticationMiddleware,  deleteProperty);


module.exports = router;