let nodemailer = require('nodemailer');
const { User, ResetPassword, sequelize } = require('../db/sequalize');
const responseMessage = require('../constants/responseConstants').responseMessage;
const errorConstants = require('../constants/responseConstants').errorMessage;
const commonFunctions = require('../utils/commonFunctions');

//queries

let USER_DETAILS = `select first_name, last_name, email
                    from users 
                    where 1 = 1 `;
/**
 * method to fetch list of users
 * @param {Object} req - request body
 */

const userList = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("[START] userList service");
      let { sort, filters } = req.body;
      let { pageNumber, pageSize } = req.params;
      let replacements = {};
      let dynamiceQuery = USER_DETAILS;

      //filter record based on parameters
      for (let i = 0; i < filters.length; i++) {
        if (filters[i].by === "firstName") {
          dynamiceQuery += ` and first_name like '%${escape(filters[i].value)}%' `;
        }
        else if (filters[i].by === "lastName") {
          dynamiceQuery += ` and last_name like '%${escape(filters[i].value)}%' `;
          replacements["firstName"] = filters[i].value;
        }
        else if (filters[i].by === "email") {
          dynamiceQuery += ` and email = '${escape(filters[i].value)}' `;
        }
      }

      //sort record based on parameter
      if (sort === undefined || sort.by === undefined || sort.by === 'email') {
        dynamiceQuery += ` order by email `;
      }
      else if (sort.by === 'firstName') {
        dynamiceQuery += ` order by first_name `;
      }
      else if (sort.by === 'lastName') {
        dynamiceQuery += ` order by last_name `;
      }

      if (sort === undefined || sort.type === undefined || sort.type === 'desc') {
        dynamiceQuery += ` desc `;
      }
      else {
        dynamiceQuery += ` asc `;
      }

      // fetch total record of users
      let usersTotal = await sequelize.query(dynamiceQuery, {
        replacements: replacements,
        model: User,
        mapToModel: true
      });

      let page = (parseInt(pageNumber) - 1) * parseInt(pageSize);
      dynamiceQuery += ` limit ${pageSize} offset ${page}`;

      console.log("dynamic query formed is " + dynamiceQuery);
      
      //fetch limited user records
      let users = await sequelize.query(dynamiceQuery, {
        replacements: replacements,
        model: User,
        mapToModel: true
      });

      if (users.length === 0) {
        return resolve(commonFunctions.errorDetails(errorConstants.noRecord.code, errorConstants.noRecord.errorId, errorConstants.noRecord.message, {}));
      }
      resolve({
        status: 200,
        users: users,
        meta: {
          total: usersTotal.length
        }
      });
      console.log("[END] userList service");
    } catch (error) {
      console.log("error occurred in userList service " + error.message);
      reject(commonFunctions.errorDetails(errorConstants.processingError.code, errorConstants.processingError.errorId, errorConstants.processingError.message, error));
    }
  })
}

/**
 * 
 * @param {Object} req - request object
 * 
 * function helps to update the user password
 */
const updatePassword = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("[START] updatePassword service");
      
      // fetch record where email and otp are valid
      const reset = await ResetPassword.findOne({

        where: {
          email: req.body.email,
          otp: req.body.otp
        }
      });
      console.log("reset " + JSON.stringify(reset));

      // check if otp is generated for this email
      if (reset) {
        console.log("found valid request to change password");

        //search user table for record
        const user = await User.findOne({

          where: {
            email: req.body.email
          }
        });

        console.log("user found is " + JSON.stringify(user));

        // udating the user password
        let update = await user.update({
          password: req.body.password,
        },
          { where: { email: req.body.email } }
        );

        console.log("update result " + JSON.stringify(update));

        // deleting the used otp records for the provided email id
        await reset.destroy({
          where: {
            email: req.body.email
          }
        })

        resolve(responseMessage.updatePassword.success);
      }
      else {

        resolve(commonFunctions.errorDetails(errorConstants.noRecord.code, errorConstants.noRecord.errorId, errorConstants.noRecord.message, {}));
      }
      console.log("[END] updatePassword service");
    } catch (error) {
      console.log("error occurred in updatePassword service " + error.message);
      reject(commonFunctions.errorDetails(errorConstants.processingError.code, errorConstants.processingError.errorId, errorConstants.processingError.message, error));
    }
  })
}

module.exports.userList = userList;
module.exports.updatePassword = updatePassword;
