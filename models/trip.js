const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Trip = sequelize.define('trip', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
});

module.exports = Trip;