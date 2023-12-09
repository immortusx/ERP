const async = require("async");
const express = require("express");
const { tokenCheck } = require("../Auth/TokenCheck");
const { getDateInFormate } = require("../Utils/timeFunctions");
const moment = require("moment");
const { db } = require("../Database/dbConfig");
const { InstantMessagingUtils } = require("./MessagingHelpers");
const fileUtils = require("./fileServices");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");
const fileHandler = require("../Utils/fileHandler");
const { getAddEnquiryMessage } = require("./messageParser");

const instantEnquiryMessage = async (messagePayloads) => {
  const { enquiryId } = messagePayloads;
  console.log(enquiryId, "enquiruoisi");
  try {
    sendMessageToCustomer(enquiryId);
    sendMessageToSSP(enquiryId);
  } catch (error) {
    console.log({ isSuccess: false, result: error });
  }
};
//For Customers Acknowledgement
const sendMessageToCustomer = async (enquiryId) => {
  const sql = `CALL sp_get_customer_message_data(${enquiryId})`;
  await db.query(sql, async (error, dataResults) => {
    if (error) {
      console.log({ isSuccess: false, result: error });
    } else {
      console.log(dataResults, "customer dataResults");
      if (dataResults && dataResults.length > 0) {
        const rowDataPacket = dataResults[0][0];

        const customerName =
          rowDataPacket.customerName !== undefined
            ? rowDataPacket.customerName
            : "";
        const customerPhoneNumber = rowDataPacket.phone_number;
        const customerWhatsAppNumber = Number(rowDataPacket.whatsapp_number);
        const customerProduct = rowDataPacket.product;
        const adminPhoneNumber = await getAdminPhoneNumber();
        const SSPNumber = rowDataPacket.SSPNumber
          ? Number(rowDataPacket.SSPNumber)
          : adminPhoneNumber;
        const salesPersonName = rowDataPacket.salesPersonName;
        const mappingId = rowDataPacket.manufacturerId;
        const modalId = rowDataPacket.modalId;
        const modal = rowDataPacket.product;
        const manufacturer = rowDataPacket.manufactureName;

        const addEnquiryMessage = await getAddEnquiryMessage(
          salesPersonName,
          SSPNumber
        );
        const makerFile = await attachProductFile(mappingId, 1);
        const modalFile = await attachProductFile(modalId, 2);
        const regardsMessage =
          (await getRegardsMessages().catch(() => null)) || "From Our Teams";

        if (makerFile || modalFile !== null) {
          const makerProduct = await fileUtils.generateTempURL(makerFile);
          const modalProduct = await fileUtils.generateTempURL(modalFile);
          console.log(makerProduct, modalProduct, "fileLink");

          const acknowledgmentMessage = `*Dear ${customerName},*
  ${addEnquiryMessage}
  
  Product File :
  - [Link to Product File (Manufacturer)]
  - ${makerProduct}
  - [Link to Product File (Modal)]
  - ${modalProduct}
  
  *Best regards,*
  ${regardsMessage}`;

          const chatPayloads = {
            phoneNumbers: [customerWhatsAppNumber],
            message: acknowledgmentMessage,
            // files: file,
          };

          //Comment this while on Development
          InstantMessagingUtils(chatPayloads);
        } else {
          const acknowledgmentMessage = `*Dear ${customerName},*
          
${addEnquiryMessage}

*Best regards,*
${regardsMessage}`;

          const chatPayloads = {
            phoneNumbers: [customerWhatsAppNumber],
            message: acknowledgmentMessage,
            // files: file,
          };

          //Comment this while on Development
          InstantMessagingUtils(chatPayloads);
        }
      } else {
        console.log({ isSuccess: false, result: "No data found." });
      }
    }
  });
};

//For Sales Person Acknowledgement
const sendMessageToSSP = async (enquiryId) => {
  const sql = `CALL sp_get_ssp_message_data(${enquiryId})`;
  await db.query(sql, async (error, dataResults) => {
    if (error) {
      console.log({ isSuccess: false, result: error });
    } else {
      console.log(dataResults, " ssp dataResults");
      if (dataResults && dataResults.length > 0) {
        const rowDataPacket = dataResults[0][0];

        const customerName =
          rowDataPacket.customerName !== undefined
            ? rowDataPacket.customerName
            : "";
        const customerPhoneNumber = rowDataPacket.phone_number;
        const customerProduct = rowDataPacket.product;
        const adminPhoneNumber = await getAdminPhoneNumber();
        console.log(adminPhoneNumber, "adminPhone Numer");
        const SSPNumber = rowDataPacket.SSPNumber
          ? rowDataPacket.SSPNumber
          : Number(adminPhoneNumber);
        console.log(SSPNumber, "SSPunwnr");
        const salesPersonName =
          rowDataPacket.salesPersonName !== undefined
            ? rowDataPacket.salesPersonName
            : "";
        const regardsMessage =
          (await getRegardsMessages().catch(() => null)) || "From Our Teams";

        console.log(SSPNumber, customerName, customerPhoneNumber, "mesashsd");
        const acknowledgmentMessage = `*Hello, ${salesPersonName}.*

You have a new enquiry from *${customerName}* *(${customerPhoneNumber})* regarding *${customerProduct}*. 
Please contact the customer at your earliest convenience. 
For any immediate assistance, the customer's contact number is *${customerPhoneNumber}*.

*Best regards,*
${regardsMessage}`;

        const chatPayloads = {
          phoneNumbers: [SSPNumber],
          message: acknowledgmentMessage,
          // files: "https://www.africau.edu/images/default/sample.pdf",
        };

        //Comment this while on Development
        InstantMessagingUtils(chatPayloads);
      } else {
        console.log({ isSuccess: false, result: "No data found." });
      }
    }
  });
};

const sendTaskAssignmentNotification = async (employeeId) => {
  const sql = `CALL sp_get_task_assignment_notification_data(${employeeId})`;
  await db.query(sql, async (error, dataResults) => {
    if (error) {
      console.log({ isSuccess: false, result: error });
    } else {
      console.log(dataResults, "dataResults");
      if (dataResults && dataResults.length > 0) {
        const rowDataPacket = dataResults[0][0];
        const sales_person = rowDataPacket.sales_person;
        const ssp_number = Number(rowDataPacket.ssp_number);
        const regardsMessage =
          (await getRegardsMessages().catch(() => null)) || "From Our Teams";
        const message = `*Hello ${sales_person},*\n\nYou have a new task assigned. Please check your dashboard for details.\n\nBest regards,\n${regardsMessage}`;
        const chatPayloads = {
          phoneNumbers: [ssp_number],
          message: message,
          // files: "https://www.example.com/task_details.pdf",
        };
        InstantMessagingUtils(chatPayloads);
      }
    }
  });
};
const sendTaskAssignmentNotificationScheduleMorning = async () => {
  const sql = "CALL sp_get_all_task_assignment_notification_data_schedule()"; // Adjust the SQL query to fetch all employees with tasks
  await db.query(sql, (error, dataResults) => {
    if (error) {
      console.log({ isSuccess: false, result: error });
    } else {
      console.log(dataResults, "dataResults");
      if (dataResults && dataResults.length > 0) {
        for (const row of dataResults[0]) {
          const sales_person = row.sales_person;
          const ssp_number = Number(row.ssp_number);
          const tasktype = row.tasktype_name;
          const tasks = row.task_name;
          const taskcount = row.taskcount;
          const category = row.category_name;
          const startdate = row.startdate;
          const enddate = row.enddate;
          const formattedStartDate = moment(startdate).format('DD-MM-YYYY');
          const formattedEndDate = moment(enddate).format('DD-MM-YYYY');
          const period_name = row.period_name;

          const message = `*Hello ${sales_person},*\n\nYou have a new task assigned. Please check your dashboard for details. OR \n Here is your Task Detail: \n Task Type: ${tasktype} \n Tasks: ${tasks} \n Task Count: ${taskcount} \n Category: ${category} \n Start Date: ${formattedStartDate} \n End Date: ${formattedEndDate} \n Task Time Period: ${period_name} \n\nBest regards,\nTeam New Keshav Tractors`;

          const chatPayloads = {
            phoneNumbers: [ssp_number],
            message: message,
            // files: "https://www.example.com/task_details.pdf",
          };

          // Comment this while on Development
          InstantMessagingUtils(chatPayloads);
        }
      }
    }
  });
};
const sendTaskAssignmentNotificationScheduleEvening = async () => {
  const sql = "CALL sp_get_all_task_assignment_notification_data_schedule()"; // Adjust the SQL query to fetch all employees with tasks
  await db.query(sql, (error, dataResults) => {
    if (error) {
      console.log({ isSuccess: false, result: error });
    } else {
      console.log(dataResults, "dataResults");
      if (dataResults && dataResults.length > 0) {
        for (const row of dataResults[0]) {
          const sales_person = row.sales_person;
          const ssp_number = Number(row.ssp_number);
          const tasktype = row.tasktype_name;
          const tasks = row.task_name;
          const taskcount = row.taskcount;
          const category = row.category_name;
          const startdate = row.startdate;
          const enddate = row.enddate;
          const formattedStartDate = moment(startdate).format('DD-MM-YYYY');
          const formattedEndDate = moment(enddate).format('DD-MM-YYYY');
          const taskcompleted = row.taskCompleted;
          const period_name = row.period_name;
          const message = `*Hello ${sales_person},*\n\nYou have a new task assigned. Please check your dashboard for details. \n Here is your Task Detail: \n Task Type: ${tasktype} \n Tasks: ${tasks} \n Task Performed:  ${taskcompleted} / ${taskcount}  \n Category: ${category} \n Start Date: ${formattedStartDate} \n End Date: ${formattedEndDate} \n Task Time Period: ${period_name} \n\nBest regards,\nTeam New Keshav Tractors`;

          const chatPayloads = {
            phoneNumbers: [ssp_number],
            message: message,
            // files: "https://www.example.com/task_details.pdf",
          };

          // Comment this while on Development
          InstantMessagingUtils(chatPayloads);
        }
      }
    }
  });
};
cron.schedule("0 5 * * *", async () => {
  await sendTaskAssignmentNotificationScheduleMorning();
  console.log("Task assignment notifications sent for all employees with tasks!");
});

cron.schedule("0 20 * * *", async () => {
  await sendTaskAssignmentNotificationScheduleEvening();
  console.log("Task assignment notifications sent for all employees with tasks!");
});


const attachProductFile = (mappingId, productType) => {
  console.log(mappingId, "mappingId");
  return new Promise(async (resolve, reject) => {
    const url = `CALL sp_get_product_documents_details(${mappingId}, ${productType})`;

    try {
      const dataResults = await new Promise((queryResolve, queryReject) => {
        db.query(url, (err, dataResults) => {
          if (err) {
            console.log({ isSuccess: false, result: "error" });
            queryReject(err);
          } else {
            console.log(dataResults, "reiskekrerll");
            queryResolve(dataResults);
          }
        });
      });

      if (dataResults && dataResults.length > 0 && dataResults[0][0]) {
        const rowDataPacket = dataResults[0][0];
        const fileName = rowDataPacket.document_path || null;
        // Use the fileHandler utility to copy the file
        const copyResult = await fileHandler.copyFile(
          fileName,
          "upload",
          "public"
        );

        if (copyResult) {
          // File was copied successfully
          resolve(fileName);
        } else {
          // Either file doesn't exist or there was an error copying
          resolve(null);
        }
      } else {
        console.log({ isSuccess: false, result: "No data found" });
        resolve(null); // Resolve with null if no data is found
      }
    } catch (error) {
      console.error("Error during file attachment:", error);
      resolve(null); // Resolve with null to handle the error gracefully
    }
  });
};

const getRegardsMessages = async () => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM configuration WHERE setting = 'agency' AND key_name = 'name'`,
        (error, dataResults) => {
          if (error) {
            console.log({ isSuccess: false, result: "error" });
            resolve(null);
          } else {
            console.log(dataResults, "dataResults");
            if (dataResults && dataResults.length > 0) {
              const rowDataPacket = dataResults[0];
              const regardsMessage = rowDataPacket.value;
              resolve(regardsMessage);
              console.log(regardsMessage, "read");
            } else {
              console.log({ isSuccess: false, result: "No data found" });
              resolve(null);
            }
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAdminPhoneNumber = async () => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT phone_number FROM users WHERE id = 1`,
        (error, dataResults) => {
          if (error) {
            console.log({ isSuccess: false, result: "error" });
            resolve(null);
          } else {
            console.log(dataResults, "admin Number dataResults");
            if (dataResults && dataResults.length > 0) {
              const rowDataPacket = dataResults[0];
              const adminPhoneNumber = rowDataPacket.phone_number;
              resolve(adminPhoneNumber);
              console.log(adminPhoneNumber, "adminNumber");
            } else {
              console.log({ isSuccess: false, result: "No data found" });
              resolve(null);
            }
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { instantEnquiryMessage, sendTaskAssignmentNotification };
