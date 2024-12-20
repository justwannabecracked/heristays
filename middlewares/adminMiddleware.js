const jwt = require('jsonwebtoken');

const authenticationMiddleware = async (req, res, next) => {
    const token = req.header('heri-auth-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No Token, Authorization Denied',
            status: false,
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        req.user = payload.user;
        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'Not Authorized, You are not an Admin!',
            status: false,
        });
    }
};

module.exports = authenticationMiddleware;
