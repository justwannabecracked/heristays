const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../../models/User'); // Assuming you use Sequelize or similar ORM for user management
const helper = require('../../utilities/helpers/help');

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await db.findOne({ where: { googleId: profile.id } });
        if (!user) {
            user = await db.create({
                googleId: profile.id,
                username: profile.name.givenName,
                fullname: profile.displayName,
                email: profile.emails[0].value
            });
        }

        const refreshToken = helper.generateRefreshToken(user);
        

        done(null, user, refreshToken);
    } catch (error) {
        done(error, null);
    }
}));

// Configure Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'email' , 'givenName']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await db.findOne({ where: { facebookId: profile.id } });
        if (!user) {
            user = await db.create({
                facebookId: profile.id,
                username: profile.name.givenName,
                fullname: profile.displayName,
                email: profile.emails[0].value
                
            });
        }
        const refreshToken = helper.generateRefreshToken(user);

        done(null, user, refreshToken);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await db.findById(id);
    done(null, user);
});

module.exports = passport;
