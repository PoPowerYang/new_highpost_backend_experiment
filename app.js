const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const app = express();

const adminRoutes = require('./routes/admin');

// app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);

app.use(errorController.get404);

sequelize
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

  