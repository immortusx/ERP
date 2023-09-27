const express = require("express");
const dotenv = require("dotenv");
const moment = require("moment");
const async = require("async");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require('fs');

dotenv.config();

const app = express();
const cors = require("cors");


const { tokenCheck } = require("./Auth/TokenCheck");
const { checkUserPermission } = require("./Auth/userPermission");
const { db } = require("./Database/dbConfig");

app.use(express.json());
app.use(cors());

app.use("/api/upload", express.static("/usr/src/app/server/upload"));

app.use("/api/users", require("./Routes/usersRoutes"));
app.use("/api/master", require("./Routes/Master/State/stateRouter"));
app.use("/api/master", require("./Routes/Master/District/districtRouter"));
app.use("/api/master", require("./Routes/Master/Taluka/talukaRouter"));
app.use("/api/master", require("./Routes/Master/Parts/partsRouter"));
app.use("/api/master", require("./Routes/Master/Village/villageRouter"));
app.use(
  "/api/master",
  require("./Routes/Master/Manufacturer/ManufacturerRouter")
);
app.use("/api/master", require("./Routes/Master/Department/DepartmentRouter"));
app.use("/api/master", require("./Routes/Master/Category/CategoryRouter"));
app.use("/api/booking", require("./Routes/Booking/bookingRoutes"));
app.use("/api/employees", require("./Routes/employeeRoutes"));
app.use("/api/master", require("./Routes/Master/Tax/taxRoutes"));
app.use("/api/enquiry", require("./Routes/enquiryRoutes"));
app.use("/api/login", require("./Routes/loginRoutes"));
app.use("/api/roles", require("./Routes/rolesRoutes"));
app.use("/api/agency", require("./Routes/agencyRoutes"));
app.use("/api/branch", require("./Routes/branchRoutes"));
app.use("/api/", require("./Routes/commonRoutes"));
app.use('/api/areaAssign', require('./Routes/areaAssignRoutes'))

app.get("/api", (req, res) => {
  console.log({
    status: "success",
    PORT: process.env.ENV_PORT,
    DATABASE: process.env.ENV_DATABASE,
    HOST: process.env.ENV_HOST,
  });
  res.send({
    status: "success",
    PORT: process.env.ENV_PORT,
    DATABASE: process.env.ENV_DATABASE,
    HOST: process.env.ENV_HOST,
  });
});

app.get('/api/download', (req, res) => {
  const filePath = "/usr/src/app/server/app-release.apk";
  const BUILD_ID = process.env.BUILD_ID;
  const fileName = `Vehicle-ERP-${moment().format("YYYYMMDD")}-${process.env.BUILD_TAG}.apk`;
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);


  res.sendFile(filePath, (err) => {
    if (err) {
      // Handle any errors here, like 404 Not Found or 500 Internal Server Error.
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.listen(process.env.ENV_PORT, (req, res) => {
  console.log({
    status: "success",
    PORT: process.env.ENV_PORT,
    DATABASE: process.env.ENV_DATABASE,
    HOST: process.env.ENV_HOST,
  });
});
