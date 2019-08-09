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

exports.postAddRoute = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const newRoute = await Route.create({id: unique('route-')});

        const start = await Addresses.findByPk(req.body.startId);
        const end = await Addresses.findByPk(req.body.endId);

        await end.setStartAddress(newRoute);
        await start.setEndAddress(newRoute);

        res.status(201).json({
            message: 'Route created successfully!',
            route: newRoute,
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postAddAddresses = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const newAddress = await Addresses.create({
            id: unique(req.body.point),
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
        });

        const existingLocation = await location.findByPk( req.body.locationId);

        await existingLocation.setAddress(newAddress);

        res.status(201).json({
            message: 'address created successfully!',
            address: newAddress,
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postAddLocations = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        const id = unique('location-')
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;

        const newLocation = await location.create({
            id: id,
            latitude: latitude,
            longitude: longitude,
        });

        res.status(201).json({
            message: 'location created successfully!',
            location: newLocation
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};