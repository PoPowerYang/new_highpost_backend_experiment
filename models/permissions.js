const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Permissions = sequelize.define('permissions', {
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

module.exports = Permissions;