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
app.use('/api/enquiry', require('./Routes/enquiryRoutes'))
app.use('/api/login', require('./Routes/loginRoutes'))
app.use('/api/roles', require('./Routes/rolesRoutes'))
app.use('/api/agency', require('./Routes/agencyRoutes'))


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
