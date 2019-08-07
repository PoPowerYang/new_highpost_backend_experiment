const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const OrderState = sequelize.define('order-state', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = OrderState;