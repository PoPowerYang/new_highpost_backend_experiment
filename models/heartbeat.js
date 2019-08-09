const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Heartbeat = sequelize.define('heartbeat', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    componentStatue: {
        type: Sequelize.STRING,
        allowNull: false
    },
    componentData: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

module.exports = Heartbeat;