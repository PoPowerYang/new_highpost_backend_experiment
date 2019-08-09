const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Module = sequelize.define('module', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
});

module.exports = Module;