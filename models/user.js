const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    password: {
        type: Sequelize.STRING,
        require: true
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    middleName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: Sequelize.STRING,
    // posts: Sequelize.ARRAY
});

module.exports = User;