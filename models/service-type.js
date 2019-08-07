const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ServiceType = sequelize.define('service-type', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = ServiceType;