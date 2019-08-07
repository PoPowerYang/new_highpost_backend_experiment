const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Nodes = sequelize.define('nodes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    package_weight: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

module.exports = Nodes;