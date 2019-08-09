const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Contents = sequelize.define('contents', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    content: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    weight: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    }
});

module.exports = Contents;