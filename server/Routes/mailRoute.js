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
    user: "sales.balkrushna@gmail.com",
    pass: "jnouvesshyjdvaui",
  },
});
cron.schedule("0 21 * * *", async () => {
  try {
    const workReportQuery = "CALL sp_get_work_report_for_currentdate()";

    db.query(workReportQuery, async (workReportErr, workReportResult) => {
      if (workReportErr) {
        console.error(workReportErr);
      } else {
        const workReportData = workReportResult[0];

        const workReportFilename = "work_report.csv";
        const workReportStream = fs.createWriteStream(workReportFilename);

        fastcsv
          .write(workReportData, { headers: true })
          .on("finish", () => {
            console.log("Work report CSV file created successfully.");

            const superAdminEmailQuery =
              "SELECT email FROM users WHERE id = 1";
            db.query(
              superAdminEmailQuery,
              async (superAdminEmailErr, superAdminEmailResult) => {
                if (superAdminEmailErr) {
                  console.error(superAdminEmailErr);
                } else {
                  const Email = superAdminEmailResult[0].email;
                  console.log(Email, "superAdminEmail");

                  transporter.sendMail({
                    from: "sales.balkrushna@gmail.com",
                    to: Email,
                    cc: "info@balkrushna.com",
                    subject: "Work Report",
                    text: "Please find the attached work report.",
                    attachments: [
                      {
                        filename: "work_report.csv",
                        content: fs.createReadStream(workReportFilename),
                      },
                    ],
                  });
                }
              }
            );
          })
          .pipe(workReportStream);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
});


module.exports = router;
