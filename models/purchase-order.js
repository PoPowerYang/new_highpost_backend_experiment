const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const PurchaseOrder = sequelize.define('purchase order', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
});

module.exports = PurchaseOrder;