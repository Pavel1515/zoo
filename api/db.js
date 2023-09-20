const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    'zoo', 'admin', 'admin', {
        host: '127.0.0.1:3306',
        dialect: 'mysql',
    }
);

module.exports = sequelize;