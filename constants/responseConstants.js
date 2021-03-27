let errorMessage = {
    "processingError": {
        "code": 500,
        "errorId": "E500",
        "message": "Processing Error Occurred"
    },
    "noRecord": {
        "code": 404,
        "errorId": "E404",
        "message": "No Record found"
    },
    "authError": {
        "code": 401,
        "errorId": "E401",
        "message": "Not a valid access token"
    },
    "loginError": {
        "code": 403,
        "errorId": "E403",
        "message": "The login information was incorrect / Not Found"
    },
    "registerError": {
        "code": 409,
        "errorId": "E409",
        "message": "User already exists"
    },
    "validationError": {
        "code": 400,
        "errorId": "E400",
        "message": "Validation Error"
    }
}

let responseMessage = {
    "updatePassword": {
        "success":{
            "message": "Password has been updated successfully"
        }
    },
    "registerUser": {
        "success":{
            "message": "User details saved successfully"
        }
    }
}

module.exports.errorMessage = errorMessage;
module.exports.responseMessage = responseMessage;