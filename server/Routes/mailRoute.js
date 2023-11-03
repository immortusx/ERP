const express = require("express");
const fs = require("fs");
const fastcsv = require("fast-csv");
const { db } = require("../Database/dbConfig");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "albynova67@gmail.com",
    pass: "goju bzmt djxy gvir",
  },
});
// Define a cron job to run daily at 5:23 PM (adjust the schedule as needed)
cron.schedule("33 17 * * *", async () => {
  try {
    const url = `CALL sp_get_work_report_for_currentdate()`;

    db.query(url, async (err, result) => {
      if (err) {
        console.error(err);
      } else {
        const data = result[0];

        const filename = "work_report.csv";
        const fileStream = fs.createWriteStream(filename);

        fastcsv
          .write(data, { headers: true })
          .on("finish", () => {
            console.log("CSV file created successfully.");
         transporter.sendMail({
           from: "albynova67@gmail.com", // Your email address
           to: "laxmichaudhari203@gmail.com", // Recipient's email address
           subject: "Work Report", // Email subject
           text: "Please find the attached work report.", // Email text
           attachments: [
             {
               filename: "work_report.csv",
               content: fs.createReadStream(filename), // Attach the CSV file
             },
           ],
         });
          })
          .pipe(fileStream);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
});


module.exports = router;
