const Sequelize = require('sequelize');
const UserModel = require('../modal/user');
const ResetPasswordModel = require('../modal/resetPassword');

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: process.env.HOST_NAME,
  dialect: process.env.SEQUALIZE_DIALECT,
  pool: {
    max: parseInt(process.env.POOL_MAX),
    min: parseInt(process.env.POOL_MIN),
    acquire: parseInt(process.env.ACQUIRE),
    idle: parseInt(process.env.IDLE)
  }
})

const User = UserModel(sequelize, Sequelize);
const ResetPassword = ResetPasswordModel(sequelize, Sequelize);

module.exports = {
  User,
  ResetPassword,
  sequelize
}