const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ManifestLocation = sequelize.define('manifest location', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
});

module.exports = ManifestLocation;