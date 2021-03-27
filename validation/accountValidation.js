var Joi = require('joi');

const commonFunctions = require('../utils/commonFunctions');
const errorConstants = require('../constants/responseConstants').errorMessage;

let fetchUserDetails = async function (req, res, next) {
    let parameters = req.params;

    const sort = Joi.object().keys({
        by: Joi.string().trim().allow('').regex(/^[a-zA-Z0-9\s]+$/).max(30),
        type: Joi.string().valid("asc", "desc", "").allow('')
    });

    const filters = Joi.object().keys({
        by: Joi.string().trim().allow('').regex(/^[a-zA-Z0-9\s]+$/).max(30),
        value: [Joi.number().empty(''), Joi.any(), 
        Joi.array().items(Joi.string())]
       
    });

    const schema = Joi.object({
        sort: sort,
        filters: Joi.array().items(filters)
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
    const schemaParams = Joi.object().keys({
        pageNumber: Joi.number(),
        pageSize: Joi.number()
    });
    const paramvalidation = schemaParams.validate(parameters, {
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
    req.params = paramvalidation.value;
    let err = {
        "status": 400,
        "statusText": "Bad Request",
        "errors": []
    }
    if (error && error.details) {
        err["errors"] = error.details
    }

    if (paramvalidation.error != null && paramvalidation.error.details) {
        for (let details of paramvalidation.error.details) {
            err["errors"].push(details)
        }
    }

    if (err.errors.length > 0) {
        console.error("Validation Error fetchUserDetails");
        res.send(commonFunctions.responseDetails(200, {},
            commonFunctions.errorDetails(errorConstants.validationError.code, errorConstants.validationError.errorId, errorConstants.validationError.message, {},err["errors"])));
    }
    else {
        next();
    }
}

let updatePassword = async function (req, res, next) {

    const schema = Joi.object({
        email: Joi.string().email().required().max(255),
        otp: Joi.number().required(),
        password: Joi.string().trim().required().max(255),
        confirmPassword: Joi.string().trim().valid(Joi.ref('password')).required()
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
        console.error("Validation Error while updating password");
        res.send(commonFunctions.responseDetails(200, {},
            commonFunctions.errorDetails(errorConstants.validationError.code, errorConstants.validationError.errorId, errorConstants.validationError.message, {},err["errors"])));
    }
    else {
        next();
    }
}


module.exports.fetchUserDetails = fetchUserDetails;
module.exports.updatePassword = updatePassword;
