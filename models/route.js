const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Route = sequelize.define('route', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    }
});

module.exports = Route;