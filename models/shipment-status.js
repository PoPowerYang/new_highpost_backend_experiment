const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const OrderStatus = sequelize.define('shipment-status', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
});

module.exports = OrderStatus;