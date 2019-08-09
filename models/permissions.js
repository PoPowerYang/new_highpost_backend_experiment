const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Permissions = sequelize.define('permissions', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Permissions;