/**
 * Author: Yanwei Yang
 * 
 * Last Update: 8/12/2019
 */

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

/**
 * all the models that are defined using
 * seqeulize
 */
const User = require('./models/user');
const Addresses = require('./models/addresses');
const Shipment = require('./models/shipment');
const Route = require('./models/route');
const PurchaseOrder = require('./models/purchase-order');
const ServiceType = require('./models/service-type');
const Module = require('./models/module');
const location = require('./models/location');
const Content = require('./models/contents');
const Component = require('./models/components');
const ManifestLocation = require('./models/manifest-location');
const Courier = require('./models/courier');
const ShipmentState = require('./models/shipment-state');
const ShipmentStatus = require('./models/shipment-status');
const ShipmentAccess = require('./models/shipment-access');
const Permission = require('./models/permissions');
const Heartbeat = require('./models/heartbeat');

const app = express();

/**
 * all the routes are imported here
 */
const shipmentRoutes = require('./routes/shipment-route');
const utilRoutes = require('./routes/util-route');
const authRoutes = require('./routes/auth');


app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

/*
  defines route endpoints
  updated at 8/7/2019
  by Yanwei Yang
*/
app.use('/shipment', shipmentRoutes);
app.use('/auth', authRoutes);
app.use('/util', utilRoutes);

/*
  use for any error catch
  updated at 8/7/2019
  by Yanwei Yang
*/
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data});
});

/*
  relations between tables are defined here
  
  'as' keyword adds getter and setter method
  to each model.

  updated at 8/7/2019
  by Yanwei Yang
*/ 

/**
 * the many-to-many relationships between addresses and users
 * 
 * This will add methods getUsers, setUsers, addUser,addUsers to Addresses, 
 * and getAddresses, setAddresses, addAddress, and addAddresses to User.
 */
Addresses.belongsToMany(User, { through: 'UserAddress'})
User.belongsToMany(Addresses, { through: 'UserAddress'});

/**
 * the many-to-many relationships between shipments and users
 * 
 * This will add methods getUsers, setUsers, addUser,addUsers to shipment, 
 * and getShipments, setShipments, addShipments, and addShipments to User.
 * 
 * through keyword is required for belongsToMany, and adds a table
 * named, 'UserShipment' references to both User and Shipment model
 */
User.belongsToMany(Shipment, { through: 'UserShipment'});
Shipment.belongsToMany(User, { through: 'UserShipment'});

/**
 * the following code adds the one-to-one relationships
 * between two models
 * 
 * Sample:
 * Source.hasOne(Target, {as: 'SourceTaget});
 * Target.belongsTo(Source);
 * 
 * The code above will add a foreign key, which 
 * is named after the 'as' keyword, SourceTargetId
 * to Target. It also adds accessors such as 
 *      existingSource.getSourceTarget(); 
 *    & existingSource.setSourceTarget(target);
 * 
 * note: Source must be found using
 *      const sourceId = id of the source, id of the source could be passed in using body or params
 *      const existingSource = Source.findByPk(sourceId);
 * before using the accessors.
 */
Shipment.belongsTo(Route);
Route.hasOne(Shipment, {as: 'ShipmentRoute'});

Shipment.belongsTo(PurchaseOrder);
PurchaseOrder.hasOne(Shipment, {as: 'ShipmentPurchaseOrder'});

Shipment.belongsTo(ServiceType);
ServiceType.hasOne(Shipment, {as: 'ShipmentServiceType'});

Shipment.belongsTo(Module);
Module.hasOne(Shipment, {as: 'ShipmentModule'});

location.hasOne(Addresses, {as: 'addressLocation'});
Addresses.belongsTo(location);

Route.belongsTo(Addresses);
Addresses.hasOne(Route, {as: 'RouteStartAddress'});

Route.belongsTo(Addresses);
Addresses.hasOne(Route, {as: 'RouteEndAddress'});

Content.belongsTo(Shipment);
Shipment.hasOne(Content, {as: 'ShipmentContent'});

Component.belongsTo(Module);
Module.hasMany(Component, {as: 'ModuleComponents'});

ManifestLocation.belongsTo(location);
location.hasOne(ManifestLocation, {as: 'ManifestLocation'});

ManifestLocation.belongsTo(Courier);
Courier.hasOne(ManifestLocation, {as: 'Manifestcourier'});

ShipmentStatus.belongsTo(ShipmentState);
ShipmentState.hasOne(ShipmentStatus, {as: 'statusstate'});

ShipmentStatus.belongsTo(Shipment);
Shipment.hasOne(ShipmentStatus, {as: 'statusshipment'});

ShipmentStatus.belongsTo(Courier);
Courier.hasOne(ShipmentStatus, {as: 'statuscourier'});

Shipment.hasOne(ShipmentAccess, {as: 'ShipmentAccess'});
ShipmentAccess.belongsTo(Shipment);

Permission.hasOne(ShipmentAccess, {as: 'PermissionShipmentAccess'});
ShipmentAccess.belongsTo(Permission);

Module.hasMany(Heartbeat, {as: "ModuleHeartBeat"});
Heartbeat.belongsTo(Module);

sequelize
  /**
   * .sync({ force: true}) will drop 
   * and recreate all the tables in the
   * database. 
   */
  // .sync({ force: true })
  .sync() 
  .then(result => {
    const server = app.listen(3000);
    const io = require('socket.io')(server);
    io.on('connection', socket => {
      console.log('Client connected')
    })
  })
  .catch(err => {
    console.log(err);
  });

  