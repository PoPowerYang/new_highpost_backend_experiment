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

    the request body must contain the start address id 
    and the end address id
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

        await end.setRouteStartAddress(newRoute);
        await start.setRouteEndAddress(newRoute);

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

        console.log(route.id);

        res.status(200).json({ 
            message: 'Route found!', 
            route: route, 
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

    the request body must contain city name,
    state, zip as string. THe point is used for creating
    the unique key such as 'start-' will generate a
    unique key as start-fdsafja23k12fsq
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

        const id = req.body.locationId;
        const existingLocation = await location.findByPk(id);

        await existingLocation.setAddressLocation(newAddress);

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

/*
    this will return any route that has this address as 
    start address. the address id needs to be included in 
    the url, such as https://localhost:300/util/get-start-address/start-dsfaskfha12jks
*/
exports.getAddressStart = async (req, res, next) => {
    try {
        const addressId = req.params.addressId;

        const address = await Addresses.findByPk(addressId);

        if(!address) {
            const error = new Error('Could not find address');
            error.statusCode = 404;
            throw error;
        }

        const result = await address.getRouteStartAddress();

        res.status(200).json({ message: 'Start address found!', route: result });
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

/*
    same as start address
*/
exports.getAddressEnd = async (req, res, next) => {
    try {
        const addressId = req.params.addressId;

        const address = await Addresses.findByPk(addressId);

        if(!address) {
            const error = new Error('Could not find address');
            error.statusCode = 404;
            throw error;
        }

        const result = await address.getRouteEndAddress();

        res.status(200).json({ message: 'End address found!', route: result });
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

/*
    create a location model, the request
    body must include the latitude and 
    longitude as float
*/
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

/** 
 * courier name must be included in the request body
*/
exports.postAddCourier = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        const id = unique('courier-')
        const name = req.body.name;

        const newCourier = await Courier.create({
            id: id,
            name: name,
        });

        res.status(201).json({
            message: 'Courier created successfully!',
            courier: newCourier
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
 /**
  * the location and courier ids must be included in
  * the request body.
  * 
  * the purpose of courier is to set them as
 * the foreign key for this shipment status
  */
exports.postAddManifestLocation = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const id = unique('manifest-location-');
        const newManifestLocation = await ManifestLocation.create({
            id: id,
        });

        const locationId = req.body.locationId;
        const existingLocation = await location.findByPk(locationId);
        if(!existingLocation) {
            const error = new Error('Location not found.');
            error.statusCode = 404;
            throw error;
        }
        existingLocation.setManifestLocation(newManifestLocation);

        const courierId = req.body.courierId;
        const existingCourier = await Courier.findByPk(courierId);
        if(!existingCourier) {
            const error = new Error('Courier not found.');
            error.statusCode = 404;
            throw error;
        }
        existingCourier.setManifestcourier(newManifestLocation);

        res.status(201).json({
            message: 'Manifest location created successfully!',
            Manifest_Location: newManifestLocation
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

/**
 * name needs to be included in the request body
 */
exports.postShipmentState = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const id = unique('shipment-state-');
        const name = req.body.name;
        const newShipmentState = await ShipmentState.create({
            id: id,
            name: name
        });

        res.status(201).json({
            message: 'Shipment state created successfully!',
            Shipment_state: newShipmentState
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

/**
 * the shipment state id, the courier id and the
 * shipment id must be included in the request
 * body.
 * 
 * the purpose of having these ids is to set them as
 * the foreign key for this shipment status
 */
exports.postShipmentStatus = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const id = unique('shipment-status-');
        const newShipmentStatus = await ShipmentStatus.create({
            id: id,
        });

        const stateId = req.body.stateId;
        const state = await ShipmentState.findByPk(stateId);
        if(!state) {
            const error = new Error('Shipment state not found');
            error.statusCode = 404;
            throw error;
        }
        await state.setStatusstate(newShipmentStatus);

        const courierId = req.body.courierId;
        const courier = await Courier.findByPk(courierId);
        if(!courier) {
            const error = new Error('Courier not found');
            error.statusCode - 404;
            throw error;
        }
        await courier.setStatuscourier(newShipmentStatus);

        const shipmentId =req.body.shipmentId;
        const shipment = await Shipment.findByPk(shipmentId);
        if(!shipment) {
            const error = new Error('Shipment not found');
            error.statusCode - 404;
            throw error;
        }
        await shipment.setStatusshipment(newShipmentStatus);

        res.status(201).json({
            message: 'Shipment state created successfully!',
            newShipmentStatus: newShipmentStatus
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

/**
 * request body needs to include a name
 */
exports.postPermission = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const id = unique('permission-');
        const name = req.body.name;
        const newPermission = await Permission.create({
            id: id,
            name: name
        });

        res.status(201).json({
            message: 'Permission created successfully!',
            Permission: newPermission
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

/***
 * permission needs to be created prior to creating
 * a shipment access
 * 
 * id of the corresponding permission needs to be 
 * included in the request body
 */
exports.postShipmentAccess = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const id = unique('shipment-access-');
        const newShipmentAccess = await ShipmentAccess.create({
            id: id,
        });

        const permissionId = req.body.permissionId;
        const permission = await Permission.findByPk(permissionId);
        if(!permission) {
            const error = new Error('permission state not found');
            error.statusCode = 404;
            throw error;
        }
        await permission.setPermissionShipmentAccess(newShipmentAccess);

        const shipmentId = req.body.shipmentId;
        const shipment = await Shipment.findByPk(shipmentId);
        if(!shipment) {
            const error = new Error('shipment not found');
            error.statusCode - 404;
            throw error;
        }
        await shipment.setShipmentAccess(newShipmentAccess);

        res.status(201).json({
            message: 'Shipment access created successfully!',
            newShipmentAccess: newShipmentAccess
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.postModule = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const id = unique('module-');
        const newModule = await Module.create({
            id: id,
        });

        res.status(201).json({
            message: 'Permission created successfully!',
            Permission: newModule
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

/**
 * module must be created and the id must be included in
 * the request body
 */
exports.postComponent = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const id = unique('component-');
        const name = req.body.name;
        // const heartbeatDelay = req.body.heartbeatDelay;

        const newComponent = await Component.create({
            id: id,
            name: name,
        });

        const moduleId = req.body.moduleId;
        const existingModule = await Module.findByPk(moduleId);
        await existingModule.addModuleComponents(newComponent);

        res.status(201).json({
            message: 'newComponent created successfully!',
            newComponent: newComponent
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

/**
 * Shipment must be created,
 * id must be included in the body
 */
exports.postContent = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const id = unique('content-');
        const description = req.body.description;
        const weight = req.body.weight;
        // const heartbeatDelay = req.body.heartbeatDelay;

        const newContent = await Content.create({
            id: id,
            description: description,
            weight: weight
        });

        const shipmentId = req.body.shipmentId;
        const existingShipment = await Shipment.findByPk(shipmentId);
        await existingShipment.setShipmentContent(newContent);

        res.status(201).json({
            message: 'content created successfully!',
            content: newContent
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

/**
 * module must be created and the id must be included in
 * the request body
 */
exports.postHeartBeat = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const id = unique('heartbeat-');
        const name = req.body.name;
        const status = req.body.status;
        const data = req.body.data;
        // const heartbeatDelay = req.body.heartbeatDelay;

        const newheartbeat = await Heartbeat.create({
            id: id,
            name: name,
            componentStatue: status,
            componentData: data
        });

        const moduleId = req.body.moduleId;
        const existingModule = await Module.findByPk(moduleId);
        await existingModule.addModuleHeartBeat(newheartbeat);

        res.status(201).json({
            message: 'heartbeat created successfully!',
            Heartbeat: newheartbeat
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

/**
 * prior to creating a shipment, user, route, purchase order, service type module 
 * must be created.
 * 
 * The ids of the models above need to be included in the request body
 */
exports.postShipment = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const id = unique('shipment-');
        const newShipment = await Shipment.create({
            id: id,
        });

        const userId = req.body.userId;
        const existingUser = await User.findByPk(userId);
        await existingUser.addUserShipment(newShipment);

        const routeId = req.body.routeId;
        const existingRoute = await Route.findByPk(routeId);
        await existingRoute.setShipmentRoute(newShipment);

        const purchaseOrderId = req.body.purchaseOrderId;
        const existingPurchaseOrder = await PurchaseOrder.findByPk(purchaseOrderId);
        await existingPurchaseOrder.setShipmentPurchaseOrder(newShipment);

        const serviceTypeId = req.body.serviceTypeId;
        const existingServiceType = await ServiceType.findByPk(serviceTypeId);
        await existingServiceType.setShipmentServiceType(newShipment);

        const moduleId = req.body.moduleId;
        const existingModule = await Module.findByPk(moduleId);
        await existingModule.setShipmentModule(newShipment);

        res.status(201).json({
            message: 'heartbeat created successfully!',
            shipment: newShipment
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};


