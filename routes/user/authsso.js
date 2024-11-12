const express = require('express');
const router = express.Router();
const passport = require('../../controllers/user/ssoAuthController');

// Route to start Google SSO
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google callback route
router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    const { user, refreshToken } = req.user;
    // Return tokens and user details in response
    return res.status(200).json({
            status: true,
            msg: 'Successfully',
            data: { token: refreshToken, user },
        });
});


// Route to start Facebook SSO
router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['profile','email']
}));

// Facebook callback route
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login'
}), (req, res) => {
     const { user, refreshToken } = req.user;
    // Return tokens and user details in response
    return res.status(200).json({
            status: true,
            msg: 'Successful',
            data: { token: refreshToken, user },
        });
});

module.exports = router;
