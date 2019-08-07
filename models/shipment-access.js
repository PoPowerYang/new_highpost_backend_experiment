const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ShipmentAccess = sequelize.define('shipment access', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
});

module.exports = ShipmentAccess;