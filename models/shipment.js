const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Shipment = sequelize.define('shipment', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    }
});

module.exports = Shipment;