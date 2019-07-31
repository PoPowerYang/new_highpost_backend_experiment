const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'mindweaver', //database name
    'root', //user name
    'Mindweaver123!*#', {
        dialect: 'mysql',
        host: 'localhost',
});

module.exports = sequelize;