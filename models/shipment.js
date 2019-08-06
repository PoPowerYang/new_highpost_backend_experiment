const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Shipment = sequelize.define('shipment', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    title: Sequelize.STRING,
    sender: {
        type: Sequelize.STRING,
        allowNull: false
    },
    recipient: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = Shipment;