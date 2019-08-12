const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

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
  user for any error catch
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

User.belongsTo(Addresses);

User.belongsToMany(Shipment, { through: 'UserShipment'});//This will add methods getUsers, setUsers, addUser,addUsers to Shipment
Shipment.belongsToMany(User, { through: 'UserShipment'}); //This will add methods getShipments, setShipments, addShipment,adShipments to User


Shipment.belongsTo(Route); //belongs to add getShipment, setShipment to Route model
Route.hasOne(Shipment);

Shipment.belongsTo(PurchaseOrder);
PurchaseOrder.hasOne(Shipment);

Shipment.belongsTo(ServiceType);
ServiceType.hasOne(Shipment);

Shipment.belongsTo(Module);
Module.hasOne(Shipment);

location.hasOne(Addresses);
Addresses.belongsTo(location);


Route.belongsTo(Addresses, {as: 'startAddress'});
Addresses.hasOne(Route, {as: 'startAddress'});

Route.belongsTo(Addresses, {as: 'endAddress'});
Addresses.hasOne(Route, {as: 'endAddress'});

Content.belongsTo(Shipment);
Shipment.hasOne(Content);

Component.belongsTo(Module);
Module.hasMany(Component, {as: 'Components'});

ManifestLocation.belongsTo(location);
location.hasOne(ManifestLocation);

ManifestLocation.belongsTo(Courier);
Courier.hasOne(ManifestLocation);

ShipmentStatus.belongsTo(ShipmentState);
ShipmentState.hasOne(ShipmentStatus);

ShipmentStatus.belongsTo(Shipment);
Shipment.hasOne(ShipmentStatus);

ShipmentStatus.belongsTo(Courier);
Courier.hasOne(ShipmentStatus);

Shipment.hasOne(ShipmentAccess);
ShipmentAccess.belongsTo(Shipment);

Permission.hasOne(ShipmentAccess);
ShipmentAccess.belongsTo(Permission);

Module.hasMany(Heartbeat, {as: "heartBeat"});
Heartbeat.belongsTo(Module);
// Shipment.hasOne(Node, {as: 'Node'}) 

sequelize
  // .sync({ force: true }) //for developing purposes, will drop all the exiting table and recreate all the tables
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

  