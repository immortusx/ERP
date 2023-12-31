const express = require("express");
const fs = require("fs");
const fastcsv = require("fast-csv");
const { db } = require("../Database/dbConfig");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const path = require("path");
const { InstantMessagingUtils } = require("../Utils/MessagingHelpers");
const router = express.Router();
const fileHandler = require('../Utils/fileHandler');
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "sales.balkrushna@gmail.com",
    pass: "jnouvesshyjdvaui",
  },
});

const generateWorkReport = async () => {
  try {
    const workReportQuery = "CALL sp_get_work_report_for_currentdate()";
    const workReportDetailQuery =
      "CALL sp_get_work_report_detail_for_currentdate()";
    const noWorkReportQuery = "CALL sp_get_no_work_report_for_currentdate()";
    const superAdminEmailQuery = "SELECT email FROM users WHERE id = 1";

    const fetchWorkReport = (query, filename) => {
      return new Promise((resolve, reject) => {
        db.query(query, async (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            const data = result[0];
            if (Array.isArray(data) && data.length > 0) {
              const stream = fs.createWriteStream(filename);
              fastcsv
                .write(data, { headers: true })
                .on("finish", () => {
                  console.log(`${filename} CSV file created successfully.`);
                  resolve({ data, stream });
                })
                .pipe(stream);
            } else {
              resolve(null);
            }
          }
        });
      });
    };

    const workReport = await fetchWorkReport(
      workReportQuery,
      "work_report.csv"
    );
    const workReportDetail = await fetchWorkReport(
      workReportDetailQuery,
      "work_report_detail.csv"
    );
    const noWorkReport = await fetchWorkReport(
      noWorkReportQuery,
      "no_work_report.csv"
    );

    if (workReport && workReport.data) {
      const superAdminEmailResult = await new Promise((resolve, reject) => {
        db.query(superAdminEmailQuery, (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(result[0]);
          }
        });
      });

      const Email = superAdminEmailResult.email;
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
            content: fs.createReadStream("work_report.csv"),
          },
        ],
      });
      if (workReportDetail && workReportDetail.data) {
        const superAdminEmailResult = await new Promise((resolve, reject) => {
          db.query(superAdminEmailQuery, (err, result) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(result[0]);
            }
          });
        });
        const Email = superAdminEmailResult.email;
        console.log(Email, "superAdminEmail");

        transporter.sendMail({
          from: "sales.balkrushna@gmail.com",
          to: Email,
          cc: "info@balkrushna.com",
          subject: "Work Report Detail",
          text: "Please find the attached work report detail.",
          attachments: [
            {
              filename: "work_report_detail.csv",
              content: fs.createReadStream("work_report_detail.csv"),
            },
          ],
        });
      }
    } else if (noWorkReport && noWorkReport.data) {
      const superAdminEmailResult = await new Promise((resolve, reject) => {
        db.query(superAdminEmailQuery, (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(result[0]);
          }
        });
      });

      const Email = superAdminEmailResult.email;
      console.log(Email, "superAdminEmail");
      transporter.sendMail({
        from: "sales.balkrushna@gmail.com",
        to: Email,
        cc: "info@balkrushna.com",
        subject: "No Work Report",
        text: "There is no work report available for today.",
        attachments: [
          {
            filename: "no_work_report.csv",
            content: fs.createReadStream("no_work_report.csv"),
          },
        ],
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

cron.schedule("0 20 * * *", async () => {
  generateWorkReport();
});

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

              // Move the file to the server/upload folder
              const parentPath = path.join(__dirname, "..");
              const destinationPath = path.join(parentPath, taskFilename);

              fs.rename(taskFilename, destinationPath, (err) => {
                if (err) {
                  console.error("Error moving the file:", err);
                } else {
                  console.log("File moved successfully.");

                  const superAdminEmailQuery =
                    "SELECT * FROM users WHERE id = 1";
                  db.query(
                    superAdminEmailQuery,
                    async (superAdminEmailErr, superAdminEmailResult) => {
                      if (superAdminEmailErr) {
                        console.error(superAdminEmailErr);
                      } else {
                        const Email = superAdminEmailResult[0].email;
                        const adminWhatsAppNumber = Number(
                          superAdminEmailResult[0].phone_number
                        );
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
                              content: fs.createReadStream(destinationPath),
                            },
                          ],
                        });

                        const payloads = {
                          adminWhatsAppNumber: adminWhatsAppNumber,
                          filename: "Task Report",
                          file: "https://c4.wallpaperflare.com/wallpaper/632/563/682/google-wallpaper-preview.jpg",
                        };
                        sendTaskReportNotification(payloads);
                      }
                    }
                  );
                }
              });
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
                console.log(Email, "superAdminEmail, No Task Assigned");

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

const sendTaskReportNotification = async (payloads) => {
  const { adminWhatsAppNumber, filename, file } = payloads;
  let message = `Task Report Here :`;
  let link = "https://crm.balkrushna.com/api/csv";
  const chatPayloads = {
    phoneNumbers: [adminWhatsAppNumber],
    message: `${message}\n${link}`,
    files: file,
  };
  InstantMessagingUtils(chatPayloads);
};

module.exports = router;
