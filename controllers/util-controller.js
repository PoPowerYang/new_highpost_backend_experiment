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


/*
    update at 8/10/2019
    by Yanwei Yang
    before creating a route, the start address and the
    end address must be created.
*/
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

        if(!start) {
            const error = new Error('Start address not found.');
            error.statusCode = 401;
            throw error;
        }

        const end = await Addresses.findByPk(req.body.endId);

        if(!end) {
            const error = new Error('End address not found.');
            error.statusCode = 401;
            throw error;
        }

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

exports.getRoute = async (req, res, next) => {
    try {
        const routeId = req.params.routeId;
        const route = Route.findByPk(routeId);

        if(!route) {
            const error = new Error('Could not find route');
            error.statusCode = 404;
            throw error;
        }

        console.log(route.startAddressId);
        console.log(route.endAddressId);

        res.status(200).json({ 
            message: 'Route found!', 
            route: route, 
            start: route.startAddressId, 
            end: route.endAddressId 
        });
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

/*
    update at 8/10/2019
    by Yanwei Yang
    before creating a address, the location
    must be created.
*/
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

        const id = unique('location-')
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;

        const existingLocation = await location.create({
            id: id,
            latitude: latitude,
            longitude: longitude,
        });

        await existingLocation.setAddress(newAddress);

        res.status(201).json({
            message: 'address created successfully!',
            address: newAddress,
            location: existingLocation
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getAddressStart = async (req, res, next) => {
    try {
        const addressId = req.params.addressId;

        const address = await Addresses.findByPk(addressId);

        if(!address) {
            const error = new Error('Could not find address');
            error.statusCode = 404;
            throw error;
        }

        const result = await address.getStartAddress();

        res.status(200).json({ message: 'Start address found!', route: result });
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getAddressEnd = async (req, res, next) => {
    try {
        const addressId = req.params.addressId;

        const address = await Addresses.findByPk(addressId);

        if(!address) {
            const error = new Error('Could not find address');
            error.statusCode = 404;
            throw error;
        }

        const result = await address.getEndAddress();

        res.status(200).json({ message: 'Start address found!', route: result });
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

// exports.postAddLocations = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if(!errors.isEmpty()) {
//             const error = new Error('Validation failed, entered data is incorrect.');
//             error.statusCode = 422;
//             throw error;
//         }
//         const id = unique('location-')
//         const latitude = req.body.latitude;
//         const longitude = req.body.longitude;

//         const newLocation = await location.create({
//             id: id,
//             latitude: latitude,
//             longitude: longitude,
//         });

//         res.status(201).json({
//             message: 'location created successfully!',
//             location: newLocation
//         });

//     } catch (error) {
//         if(!error.statusCode) {
//             error.statusCode = 500;
//         }
//         next(error);
//     }
// };