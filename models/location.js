const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Coordinates = sequelize.define('location', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
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