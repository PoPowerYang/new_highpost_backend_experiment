const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Components = sequelize.define('components', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Components;