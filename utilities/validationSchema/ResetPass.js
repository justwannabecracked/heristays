const Joi = require('joi');

const resetPassSchema = Joi.object({
    email: Joi.string().trim().email({tlds: false}).required(),
    password: Joi.string().min(6).required(),
});

module.exports = resetPassSchema;