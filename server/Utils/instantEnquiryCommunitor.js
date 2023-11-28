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
      console.log(dataResults, "dataResults");
      if (dataResults && dataResults.length > 0) {
        const rowDataPacket = dataResults[0][0];

        const customerName = rowDataPacket.customerName;
        const customerPhoneNumber = rowDataPacket.phone_number;
        const customerWhatsAppNumber = Number(rowDataPacket.whatsapp_number);
        const customerProduct = rowDataPacket.product;
        const SSPNumber = Number(rowDataPacket.SSPNumber);
        const salesPersonName = rowDataPacket.salesPersonName;
        const mappingId = rowDataPacket.manufacturerId;
        const modalId = rowDataPacket.modalId;
        const modal = rowDataPacket.product;
        const manufacturer = rowDataPacket.manufactureName;

        const makerFile = await attachProductFile(mappingId, 1);
        const modalFile = await attachProductFile(modalId, 2);
        const regardsMessage = await getRegardsMessages().catch(() => null) || 'From Our Teams';

        if (makerFile && makerProduct !== null) {
          const makerProduct = await fileUtils.generateTempURL(makerFile);
          const modalProduct = await fileUtils.generateTempURL(modalFile);
          console.log(makerProduct, modalFile, "fileLink");

          const acknowledgmentMessage = `*Dear ${customerName},*
  
  Thank you for your enquiry regarding *${customerProduct}*. 
  We have received your request and one of our sales representatives, *${salesPersonName}*, will contact you shortly to assist you further. 
  If you have any immediate questions, please feel free to contact us at *${SSPNumber}*.
  
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
          
Thank you for your enquiry regarding *${customerProduct}*. 
We have received your request and one of our sales representatives, *${salesPersonName}*, will contact you shortly to assist you further. 
If you have any immediate questions, please feel free to contact us at *${SSPNumber}*.

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
      console.log(dataResults, "dataResults");
      if (dataResults && dataResults.length > 0) {
        const rowDataPacket = dataResults[0][0];

        const customerName = rowDataPacket.customerName;
        const customerPhoneNumber = rowDataPacket.phone_number;
        const customerProduct = rowDataPacket.product;
        const SSPNumber = Number(rowDataPacket.SSPNumber);
        const salesPersonName = rowDataPacket.salesPersonName;
        const regardsMessage = await getRegardsMessages().catch(() => null) || 'From Our Teams';

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
  await db.query(sql, (error, dataResults) => {
    if (error) {
      console.log({ isSuccess: false, result: error });
    } else {
      console.log(dataResults, "dataResults");
      if (dataResults && dataResults.length > 0) {
        const rowDataPacket = dataResults[0][0];
        const sales_person = rowDataPacket.sales_person;
        const ssp_number = Number(rowDataPacket.ssp_number);
        const message = `*Hello ${sales_person},*\n\nYou have a new task assigned. Please check your dashboard for details.\n\nBest regards,\nTeam New Keshav Tractors`;
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

      if (dataResults && dataResults.length > 0) {
        const rowDataPacket = dataResults[0][0];
        const fileName = rowDataPacket.document_path;
        console.log(fileName, "filepath");
        const sourcePath = path.join(__dirname, "..", "upload", fileName);
        const destinationPath = path.join(__dirname, "..", "public", fileName);

        try {
          if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destinationPath);
            console.log("File copied successfully");
            resolve(fileName);
          } else {
            console.error("Source file does not exist:", sourcePath);
            resolve(null); // Resolve with null if the source file does not exist
          }
        } catch (copyError) {
          console.error("Error copying file:", copyError);
          resolve(null); // Resolve with null to handle the error gracefully
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
              console.log(regardsMessage, 'read');
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
