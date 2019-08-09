const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ShipmentAccess = sequelize.define('shipment access', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
});

module.exports = ShipmentAccess;