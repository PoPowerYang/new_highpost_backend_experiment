const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Shipment = require('./models/shipment');
const User = require('./models/user');

const app = express();

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

// app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data});
});

Shipment.belongsTo(User, {constraints: true, onDelete: 'CASCADE' });
User.hasMany(Shipment);

sequelize
  // .sync({ force: true }) //for developing purposes, will drop all the exiting table and recreate all the tables
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

  