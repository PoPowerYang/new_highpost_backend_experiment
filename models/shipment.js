const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Shipment = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
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