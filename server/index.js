const express = require('express')
const dotenv = require('dotenv')
const moment = require("moment");
const async = require('async');
const path = require('path');
const jwt = require('jsonwebtoken');

dotenv.config()

const app = express()
const cors = require("cors");

const { tokenCheck } = require("./Auth/TokenCheck");
const { checkUserPermission } = require("./Auth/userPermission");
const { db } = require('./Database/dbConfig');

app.use(express.json());
app.use(cors());


app.use('/api/users', require('./Routes/usersRoutes'))
app.use('/api/master', require('./Routes/Master/State/stateRouter'))
app.use('/api/master', require('./Routes/Master/District/districtRouter'))
app.use('/api/master', require('./Routes/Master/Taluka/talukaRouter'))
app.use('/api/master', require('./Routes/Master/Parts/partsRouter'));
app.use('/api/master', require('./Routes/Master/Village/villageRouter'))
app.use('/api/master', require('./Routes/Master/Manufacturer/ManufacturerRouter'))
app.use('/api/booking', require('./Routes/Booking/bookingRoutes'));
app.use('/api/employees', require('./Routes/employeeRoutes'));
app.use('/api/master', require('./Routes/Master/Tax/taxRoutes'));
app.use('/api/enquiry', require('./Routes/enquiryRoutes'))
app.use('/api/login', require('./Routes/loginRoutes'))
app.use('/api/roles', require('./Routes/rolesRoutes'))
app.use('/api/branch', require('./Routes/branchRoutes'))
app.use('/api/', require('./Routes/commonRoutes'))


app.get('/api', (req, res) => {
  console.log({
    'status': 'success',
    'PORT': process.env.ENV_PORT,
    'DATABASE': process.env.ENV_DATABASE,
    'HOST': process.env.ENV_HOST,
  });
  res.send({
    'status': 'success',
    'PORT': process.env.ENV_PORT,
    'DATABASE': process.env.ENV_DATABASE,
    'HOST': process.env.ENV_HOST,
  });
})

app.listen(process.env.ENV_PORT, (req, res) => {
  console.log({
    'status': 'success',
    'PORT': process.env.ENV_PORT,
    'DATABASE': process.env.ENV_DATABASE,
    'HOST': process.env.ENV_HOST,
  });
})
