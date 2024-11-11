const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().required().min(1).max(25),
    fullname: Joi.string().required().min(1).max(25),
    email: Joi.string().trim().email({ tlds: false }).required(),
    password: Joi.string().min(6).required(),
});

module.exports = registerSchema;