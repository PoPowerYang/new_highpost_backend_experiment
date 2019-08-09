const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Trip = sequelize.define('waypoint', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
});

module.exports = Trip;