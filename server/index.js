const express = require("express");
const dotenv = require("dotenv");
const moment = require("moment");
const async = require("async");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");

dotenv.config();

const app = express();
const cors = require("cors");

const { tokenCheck } = require("./Auth/TokenCheck");
const { checkUserPermission } = require("./Auth/userPermission");
const { db } = require("./Database/dbConfig");

app.use(express.json());
app.use(cors());

app.use("/api/upload", express.static("upload"));
app.use("/api/public", express.static("public"));

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
app.use("/api/areaAssign", require("./Routes/areaAssignRoutes"));
app.use("/api/leave", require('./Routes/Leave/LeaveRoutes'));
app.use("/api/sendmail", require("./Routes/mailRoute"));
app.use("/api/whatsapp-messages", require("./Routes/whatsappRoutes"));

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

app.get("/api/download", (req, res) => {
  const fileName = `ERP-${moment().format("YYYYMMDD")}-${process.env.BUILD_TAG
    }-${process.env.BUILD_ID}.apk`;
  const filePath = path.join(__dirname, ".", "app-release.apk"); // Assuming your server folder is in the same directory as your script

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist, send JSON response with error status
      console.error("Application not found");
      res.status(404).json({ error: "Application not found" });
      return;
    }

    // File exists, set headers and send the file
    res.setHeader("Content-Type", "application/vnd.android.package-archive");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.sendFile(filePath, (err) => {
      if (err) {
        // Handle any errors here, like 500 Internal Server Error.
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    });
  });
});

//csv file download
app.get("/api/csv", (req, res) => {
  try {
    const fileName = `task_list-${moment().format("YYYYMMDDHHmmss")}.csv`;
    const filePath = path.join(__dirname, ".", "task_list.csv");
    console.log(path.join(__dirname), 'pathalel')
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File does not exist, send JSON response with error status
        console.error("CSV file not found");
        res.status(404).json({ error: "CSV file not found", path: filePath});
        return;
      }

      // File exists, set headers and send the file
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(process.env.ENV_PORT, (req, res) => {
  console.log({
    status: "success",
    PORT: process.env.ENV_PORT,
    DATABASE: process.env.ENV_DATABASE,
    HOST: process.env.ENV_HOST,
  });
});
