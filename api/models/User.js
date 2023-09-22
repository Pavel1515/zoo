const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mail: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
    codeVerification: {
      type: DataTypes.STRING,
    },
    statusVerification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {}
);

module.exports = Users;
