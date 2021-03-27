var express = require('express');
var routes = express.Router();
const passport = require('passport');

const accountService = require('./../services/accountService');
const validation = require('../validation/accountValidation');
const commonFunctions = require('../utils/commonFunctions');
const errorConstants = require('../constants/responseConstants').errorMessage;

/**
 * Api route to set password after registeration
 */

routes.post('/api/users/password/update', validation.updatePassword, async (req, res) => {
    try {
        console.log("[START] password update route");
        let result = await accountService.updatePassword(req);

        // if update was not successful
        if(result.code !== undefined){
            return res.send(commonFunctions.responseDetails(200,{},result));
        }

        res.send(commonFunctions.responseDetails(200,result));
        
        console.log("[END] password update route");
    } catch (error) {
        res.send(commonFunctions.responseDetails(200, {}, 
            commonFunctions.errorDetails(errorConstants.processingError.code, errorConstants.processingError.errorId, errorConstants.processingError.message, error)));
    }
});

/**
 *  Api route to list all the users
 */
routes.post('/api/users/:pageSize/:pageNumber', passport.authenticate('jwt', {
    session: false,
    failWithError: true
}), validation.fetchUserDetails, async (req, res) => {
    try {
        console.log("[START] User Details route");
        let result = await accountService.userList(req);
        // if fetching data was not successful
        if(result.code !== undefined){
            return res.send(commonFunctions.responseDetails(200,{},result));
        }

        res.send(commonFunctions.responseDetails(200,result));
        
        console.log("[END] User Details route");
    } catch (error) {
        res.send(commonFunctions.responseDetails(200, {}, 
            commonFunctions.errorDetails(errorConstants.processingError.code, errorConstants.processingError.errorId, errorConstants.processingError.message, error)));
    }
});

module.exports = routes;