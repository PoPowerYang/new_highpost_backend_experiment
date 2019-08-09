const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Courier = sequelize.define('courier', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Courier;