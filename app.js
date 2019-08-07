const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const Shipment = require('./models/shipment');
const User = require('./models/user');
const Addresses = require('./models/addresses');
const Orders = require('./models/orders');
const Components = require('./models/components');
const Courier = require('./models/courier');
const OrderState = require('./models/order-state');
const ServiceType = require('./models/service-type');
const Route = require('./models/route');
const Nodes = require('./models/nodes');
const Contents = require('./models/contents');
const Trip = require('./models/trip');
const Coordinates = require('./models/coordinates');
const ManifestLocation = require('./models/manifest-location');
const Heartbeat = require('./models/heartbeat');
const orderStatus = require('./models/order-status');
const ShipmentAccess = require('./models/shipment-access');
const Permissions = require('./models/permissions');

const app = express();

const adminRoutes = require('./routes/admin');
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
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

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
User.hasOne(Addresses, {as: 'Addresses'});

Addresses.hasOne(Coordinates, {as: 'Coordinates'});

Shipment.hasMany(Nodes, {as: 'Nodes'});

Nodes.hasOne(ServiceType, {as: 'ServiceType'});
Nodes.hasOne(Trip, {as: 'Trip'});
Nodes.hasMany(Orders, {as: 'Orders'});

Orders.hasOne(orderStatus, {as: 'OrderStatus'});
Orders.hasOne(Contents, {as: 'Contents'});
Orders.hasOne(Heartbeat, {as: 'Heartbeat'})

orderStatus.hasOne(OrderState, {as: 'OrderState'});
orderStatus.hasOne(Courier, {as: 'Courier'});

ManifestLocation.hasOne(Courier, {as: 'Courier'});
ManifestLocation.hasOne(Coordinates, {as: 'Coordinates'});

Trip.hasOne(Addresses, {as: 'startAddress'});
Trip.hasOne(Addresses, {as: 'endAddress'});
Trip.hasOne(Route, {as: 'Route'});

ShipmentAccess.hasOne(Permissions, {as: 'Permission'});
ShipmentAccess.hasOne(Orders, {as: 'Order'});

sequelize
  // .sync({ force: true }) //for developing purposes, will drop all the exiting table and recreate all the tables
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

  