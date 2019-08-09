const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ManifestLocation = sequelize.define('manifest location', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
});

module.exports = ManifestLocation;