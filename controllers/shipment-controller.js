const unique = require('uniqid');

const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const Addresses = require('../models/addresses');
const Shipment = require('../models/shipment');
const Route = require('../models/route');
const PurchaseOrder = require('../models/purchase-order');
const ServiceType = require('../models/service-type');
const Module = require('../models/module');
const location = require('../models/location');
const Content = require('../models/contents');
const Component = require('../models/components');
const ManifestLocation = require('../models/manifest-location');
const Courier = require('../models/courier');
const ShipmentState = require('../models/shipment-state');
const ShipmentStatus = require('../models/shipment-status');
const ShipmentAccess = require('../models/shipment-access');
const Permission = require('../models/permissions');
const Heartbeat = require('../models/heartbeat');





exports.postDeletePShipment = async (req, res, next) => {
    const shipId = req.params.shipmentId;

    const user = await User.findByPk(req.userId);
    const shipmentToBeDestroy = await user.getShipments({ where: {id: shipId} });
    const result = shipmentToBeDestroy[0].destroy();
    res.status(200).json({ message: 'Deleted shipment.', result: result});
};