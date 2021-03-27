var Joi = require('joi');

const commonFunctions = require('../utils/commonFunctions');
const errorConstants = require('../constants/responseConstants').errorMessage;

let register = async function (req, res, next) {

    const schema = Joi.object({
        email: Joi.string().email().required().max(255),
        firstName: Joi.string().trim().required().max(100),
        lastName: Joi.string().trim().required().max(100)
    }).required();
    const {
        value,
        error
    } = schema.validate(req.body, {
        abortEarly: false,
        language: {
            key: '{{key}} ',
            string: {
                regex: {
                    base: '- {{!value}} , Invalid Format'
                }
            }
        }

    });
    req.body = value;

    let err = {
        "status": 400,
        "statusText": "Bad Request",
        "errors": []
    }
    if (error && error.details) {
        err["errors"] = error.details
    }

    if (err.errors.length > 0) {
        console.error("Validation Error register");
        res.send(commonFunctions.responseDetails(200, {},
            commonFunctions.errorDetails(errorConstants.validationError.code, errorConstants.validationError.errorId, errorConstants.validationError.message, {},err["errors"])));
    }
    else {
        next();
    }
}

module.exports.register = register;