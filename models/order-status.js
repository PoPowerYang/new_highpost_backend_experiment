const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const OrderStatus = sequelize.define('order status', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
});

module.exports = OrderStatus;