const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const OrderState = sequelize.define('shipment-state', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = OrderState;