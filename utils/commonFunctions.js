let nodemailer = require('nodemailer');

const errorConstants = require('../constants/responseConstants').errorMessage;
/**
 *  Generates one time password to be used as a token
 */

let otpGeneration = () => {
    return new Promise((resolve, reject) => {
        try {
            console.log("[START] otpGeneration function");
            let otp = Math.floor(100000 + Math.random() * 900000);
            resolve(otp);
            console.log("[END] otpGeneration function");
        } catch (error) {
            console.log("error occurred in otpGeneration "+error.message);
            reject(errorDetails(errorConstants.processingError.code, errorConstants.processingError.errorId, errorConstants.processingError.message, error));
        }
    })
}

/**
 * 
 * @param {String} to - email address of the reciever
 * @param {String} from - email address of the sender
 * @param {String} subject - subject for the email
 * @param {String} text - body for the email
 * @returns success or failure response
 */
let sendEmail = (to,from,subject,text) => {
    return new Promise( async (resolve, reject) => {
        try {
            console.log("[START] sendEmail function");

            let transporter = await nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT),
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD 
                }
              });
            
            var mailOptions = {
                to: to,
                from: from,
                subject: subject,
                text: text
            };
            transporter.sendMail(mailOptions, function (err, info) {

                if (info) {
                    console.log("INFO " + JSON.stringify(info));
                    resolve(true);
                }
                else {
                    console.log("error " + err.message);
                    resolve(false);
                }
                console.log("[END] sendEmail function");
            });          
        } catch (error) {
            console.log("error occurred in sendEmail function "+error.message);
            reject(errorDetails(errorConstants.processingError.code, errorConstants.processingError.errorId, errorConstants.processingError.message, error));
        }
    })
}

/**
 * 
 * @param {Number} status - status code of the response
 * @param {Object} response - response data
 * @param {Object} error - error data
 * @returns modified response structure
 */
let responseDetails = (status = 200, response = {}, error = {}) => {
    return ({
        "status": status,
        "data": response,
        "error": error
    });
}

/**
 * 
 * @param {Number} code - error code
 * @param {String} errorId - error id
 * @param {String} message - error message
 * @param {Object} error - error attributes
 * @param {Array} details - error details related to attributes
 * @returns modifed error object structure
 */
let errorDetails = (code, errorId, message, error, details = []) => {
    if (error.errorId != undefined) {
        return error;
    }

    return ({
        "code": code,
        "errorId": errorId,
        "message": message,
        "details": details
    });
}

module.exports.otpGeneration = otpGeneration;
module.exports.sendEmail = sendEmail;
module.exports.responseDetails = responseDetails;
module.exports.errorDetails = errorDetails;