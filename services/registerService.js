const { User, ResetPassword } = require('../db/sequalize');
const commonFunctions = require('../utils/commonFunctions');
const configValues = require('../constants/configValueConstants');
const errorConstants = require('../constants/responseConstants').errorMessage;
const responseMessage = require('../constants/responseConstants').responseMessage;

/**
 * method to register user in the system
 * @param {Object} req - request body
 */

const register = (req) => {
    let userJson = req.body;
    return new Promise(async function (resolve, reject) {
        try {
            console.log("[START] register service");
            
            const { email } = req.body
            console.log("Email " + JSON.stringify(email));

            const user = await User.findOne({

                where: {
                    email: email
                }
            });

            console.log("user record found is " + JSON.stringify(user));

            if (user) {
                return resolve(commonFunctions.errorDetails(errorConstants.registerError.code, errorConstants.registerError.errorId, errorConstants.registerError.message, {}));
            }

            const createdUser = await User.create({
                firstName: userJson.firstName,
                lastName: userJson.lastName,
                email: userJson.email,
                password: Math.random().toString()
            });

            //call otp generation function
            let otp = await commonFunctions.otpGeneration();
            console.log("generated otp is " + otp);

            //store otp for authentication in database
            let resetPassword = await ResetPassword.create({ email: userJson.email, otp: otp });

            let body = `Hello, \n\nPlease use the verification code - ${otp} to set your password`;

            // calling send email function to send email to the registered user
            let emailResponse = await commonFunctions.sendEmail(userJson.email,
                configValues.emailConfig.senderEmail,
                configValues.emailConfig.subject,
                body);

            // if email was not sent successfully then delete the registered user
            if (!emailResponse) {
                await resetPassword.destroy({
                    where: {
                        email: req.body.email
                    }
                });
                await createdUser.destroy({
                    where: {
                        email: req.body.email
                    }
                });

            }
            resolve(responseMessage.registerUser.success);

            console.log("[END] register service");
        } catch (error) {
            console.log("Error in Register Service is "+error.message);
            reject(commonFunctions.errorDetails(errorConstants.processingError.code, errorConstants.processingError.errorId, errorConstants.processingError.message, error));
        }

    });
}

module.exports.register = register;