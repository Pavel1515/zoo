const { DataTypes} = require('sequelize');
const sequelize = require('../db');
const Ads = sequelize.define("Ads", {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,
    }, userId: {
        type: DataTypes.INTEGER, allowNull: false,
    }, title: {
        type: DataTypes.STRING, allowNull: false,
    }, text: {
        type: DataTypes.STRING, allowNull: false,
    }, price: {
        type: DataTypes.INTEGER, allowNull: false,
    }, phone: {
        type: DataTypes.STRING, allowNull: false,
    }, category: {
        type: DataTypes.STRING, allowNull: false,
    }, status: {
        type: DataTypes.BOOLEAN, defaultValue: false,
    },

}, {});
module.exports = Ads;