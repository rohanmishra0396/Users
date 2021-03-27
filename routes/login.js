var express = require('express');
var routes = express.Router();

const loginService = require('./../services/loginService');
const validation = require('../validation/loginValidation');
const commonFunctions = require('../utils/commonFunctions');
const errorConstants = require('../constants/responseConstants').errorMessage;

routes.post("/api/login", validation.login, async function (req, res) {
    try {
        console.log("[START] login route");
        let login = await loginService.login(req);

        // if login was not successful
        if (login.code !== undefined) {
            return res.send(commonFunctions.responseDetails(200, {}, login));
        }

        res.send(commonFunctions.responseDetails(200, login));
        
        console.log("[END] login route");
    } catch (error) {
        res.send(commonFunctions.responseDetails(200, {},
            commonFunctions.errorDetails(errorConstants.processingError.code, errorConstants.processingError.errorId, errorConstants.processingError.message, error)));
    }
});

module.exports = routes;