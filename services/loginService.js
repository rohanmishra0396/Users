const { User } = require('../db/sequalize');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');

const authConfig = require('../constants/configValueConstants').authCheck;
const errorConstants = require('../constants/responseConstants').errorMessage;
const commonFunctions = require('../utils/commonFunctions');

/**
 * method to get user logged in
 * @param {Object} req - request body
 */

const login = (req) => {

  return new Promise(async (resolve, reject) => {

    try {
      console.log("[START] login service");
      // Grab user input       
      const { email, password } = req.body
      console.log("Email " + JSON.stringify(email));

      const user = await User.findOne({

        where: {
          email: email
        }
      });
      console.log("user record found is " + JSON.stringify(user));

      // Check to see if user is in db
      if (!user) {
        return resolve(commonFunctions.errorDetails(errorConstants.loginError.code, errorConstants.loginError.errorId, errorConstants.loginError.message, {}));

      }

      // Check to see if password is valid
      const isPasswordValid = await user.validPassword(password, user.password);

      if (!isPasswordValid) {
        return resolve(commonFunctions.errorDetails(errorConstants.loginError.code, errorConstants.loginError.errorId, errorConstants.loginError.message, {}));
      }
      
      // return user using toJSON()
      const userJson = user.toJSON()

      //encrypt the email before creating a token
      let encryptedKey = crypto.AES.encrypt(email, authConfig.secretKey).toString();

      const expiresIn = authConfig.expiresIn;
      const SECRET_KEY = authConfig.passportKey;
      const accessToken = jwt.sign({ id: encryptedKey }, SECRET_KEY, {
        expiresIn: expiresIn
      });

      delete userJson.userId;
      delete userJson.password;
      delete userJson.updatedAt;
      console.log("[END] login service");
      resolve({
        user: userJson,
        token: 'Bearer '+accessToken
      })
    } catch (error) {
      console.log("Error occurred in login service "+error.message);
      reject(commonFunctions.errorDetails(errorConstants.processingError.code, errorConstants.processingError.errorId, errorConstants.processingError.message, error));
    }
  });
}


module.exports.login = login;