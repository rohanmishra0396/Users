var express = require('express');
var routes = express.Router();

const registerService = require('./../services/registerService');
const validation = require('../validation/registerValidation');
const commonFunctions = require('../utils/commonFunctions');
const errorConstants = require('../constants/responseConstants').errorMessage;

routes.post('/api/register', validation.register, async (req, res) => {
    try {
        console.log("[START] register route");
        let result = await registerService.register(req);

        // if registering a user fails
        if (result.code !== undefined) {
            return res.send(commonFunctions.responseDetails(200, {}, result));
        }

        res.send(commonFunctions.responseDetails(200, result));

        console.log("[END] register route");
    } catch (error) {
        res.send(commonFunctions.responseDetails(200, {},
            commonFunctions.errorDetails(errorConstants.processingError.code, errorConstants.processingError.errorId, errorConstants.processingError.message, error)));
    }
});

module.exports = routes;