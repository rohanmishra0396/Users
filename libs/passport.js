const crypto = require('crypto-js');

const { User } = require('../db/sequalize');
const configConstants = require('../constants/configValueConstants').authCheck;

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function (passport) {
    const opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = configConstants.passportKey;

    passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
        try {
            console.info('Start of passport authentication ');

            //decrypting the payload
            const bytes = crypto.AES.decrypt(jwt_payload.id, configConstants.secretKey);
            jwt_payload.id = bytes.toString(crypto.enc.Utf8);

            //searching for the email in database
            console.log("Email : "+jwt_payload.id);

            const user = await User.findOne({

              where : {
                email: jwt_payload.id
              }
            });
            console.log("user record found is "+JSON.stringify(user));
            
            console.info('End of passport authentication');
            if(!user){
                return done(null, false);
            }
            else {
                done (null, true);
            }
        } catch (error) {
            console.error("Error occurred in passport middleware " + error.message);
            return done(null, false);
        }
    }));
}