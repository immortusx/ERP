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
cron.schedule("0 20 * * *", async () => {
  try {
    const workReportQuery = "CALL sp_get_work_report_for_currentdate()";

    db.query(workReportQuery, async (workReportErr, workReportResult) => {
      if (workReportErr) {
        console.error(workReportErr);
      } else {
        const workReportData = workReportResult[0];

        if (workReportData.length > 0) {
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
        } else {
          const superAdminEmailQuery = "SELECT email FROM users WHERE id = 1";
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
                  subject: "No Work Report Data",
                  text: "There is no work report data available for today.",
                });
              }
            }
          );
        }
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

////////////////////////////////////////////////////

cron.schedule("0 10 * * *", async () => {
  try {
    const tasklist = "CALL sp_get_task_for_currentdate()";

    db.query(tasklist, async (taskerror, tskResult) => {
      if (taskerror) {
        console.error(taskerror);
      } else {
        const taskdata = tskResult[0];

        if (taskdata.length > 0) {
          const taskFilename = "task_list.csv";
          const taskStream = fs.createWriteStream(taskFilename);

          fastcsv
            .write(taskdata, { headers: true })
            .on("finish", () => {
              console.log("Task list CSV file created successfully.");
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
                      subject: "Task Work",
                      text: "Please find the attached Task Work.",
                      attachments: [
                        {
                          filename: "task_list.csv",
                          content: fs.createReadStream(taskFilename),
                        },
                      ],
                    });
                  }
                }
              );
            })
            .pipe(taskStream);
        } else {
          const superAdminEmailQuery = "SELECT email FROM users WHERE id = 1";
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
                  subject: "No Task Work",
                  text: "There is no task work available for today.",
                });
              }
            }
          );
        }
      }
    });
  } catch (error) {
    console.error("Error", error);
  }
});

module.exports = router;