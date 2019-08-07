const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Addresses = sequelize.define('addresses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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