var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');

const commonFunctions = require('./utils/commonFunctions');
const errorConstants = require('./constants/responseConstants').errorMessage;
/*
* DB Config file based on ENV triggered from pm2
*/
if (process.env.NODE_ENV === "PROD") {
    require('custom-env').env('PROD-config');
} else {
    require('custom-env').env('DEV-config');
}

const passport = require('passport');
require('./libs/passport')(passport);
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

var routes = require('./routes/index');
app.use(routes);

//to handle global error 
app.use((error, req, res, next) => {
    // handle authentication error
    if(error.name === "AuthenticationError"){
        return res.send(commonFunctions.responseDetails(200, {}, 
            commonFunctions.errorDetails(errorConstants.authError.code, errorConstants.authError.errorId, errorConstants.authError.message, error)));
    }

    // handling other system errors
    console.error("Error occurred is "+error.message);
    res.send(commonFunctions.responseDetails(200, {}, 
        commonFunctions.errorDetails(errorConstants.processingError.code, errorConstants.processingError.errorId, errorConstants.processingError.message, error)));
    
    
})
let port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log("Server is running on port "+port);
});