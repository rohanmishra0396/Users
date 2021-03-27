const bcrypt = require("bcrypt");

module.exports = (sequelize, type) => {
  let User = sequelize.define('users', {
    userId: {
      type: type.INTEGER,
      field: 'user_id',
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: type.STRING,
      field: 'first_name'
    },
    lastName: {
      type: type.STRING,
      field: 'last_name'
    },
    email: {
      type: type.STRING,
      field: 'email'
    },
    password: {
      type: type.STRING,
      allowNull: true,
      set(value) {
        const hash = bcrypt.hashSync(value, bcrypt.genSaltSync(8));
        this.setDataValue('password', hash);
      }
    },
    updatedAt: {
      type: 'TIMESTAMP',
      field: 'last_updated',
      defaultValue: type.literal('CURRENT_TIMESTAMP')
    }
  }, {
    timestamps: false
  })

  User.prototype.generateHash = (password) => {
    let result = bcrypt.hash(password, bcrypt.genSaltSync(8));
    console.log(JSON.stringify(result));
    return result;
  }

  User.prototype.validPassword = async (password, hashPassword) => {
    console.log(password, " ", hashPassword);
    console.log(password === hashPassword);
    return bcrypt.compare(password, hashPassword);
  }

  User.prototype.comparePassword = function (password) {
    bcrypt.compare(password, this.password, function (res, err) {
      console.log(password + " " + this.password);
      if (res) {

        console.log(res)
      } else {
        console.log(err)
      }
    })
    return bcrypt.compare(password, this.password)
  }

  return User;
}



