const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Coordinates = sequelize.define('coordinates', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    latitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
    }
});

module.exports = Coordinates;