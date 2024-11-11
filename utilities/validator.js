// Middleware to validate request body using Joi
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: false,
                error: error.details
            });
        }
        next();
    };
};

// parameter validation...

module.exports = { validateBody };