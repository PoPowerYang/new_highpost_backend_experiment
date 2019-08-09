const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Addresses = sequelize.define('addresses', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    zip: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Addresses;