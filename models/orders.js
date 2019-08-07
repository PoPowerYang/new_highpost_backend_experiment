const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Orders = sequelize.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    package_weight: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

module.exports = Orders;