const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Route = sequelize.define('route', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    }
});

module.exports = Route;