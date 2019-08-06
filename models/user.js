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
    age: Sequelize.INTEGER,
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: Sequelize.STRING,
    phone: Sequelize.STRING,
    // posts: Sequelize.ARRAY
});

module.exports = User;