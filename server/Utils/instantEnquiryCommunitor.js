const async = require("async");
const express = require("express");
const { tokenCheck } = require("../Auth/TokenCheck");
const { getDateInFormate } = require("../Utils/timeFunctions");
const moment = require("moment");
const { db } = require("../Database/dbConfig");
const { InstantMessagingUtils } = require("./MessagingHelpers");
const fileUtils = require('./fileServices');
const path = require("path");
const instantEnquiryMessage = async (messagePayloads) => {
  const { enquiryId } = messagePayloads;
  console.log(enquiryId, 'enquiruoisi')
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

        const file = await attachProductFile(mappingId);
        console.log(file, "hdshsdhhdhfdfhdhjdhhfhsdhfhdhdffd")
        const acknowledgmentMessage = `*Dear ${customerName},*

Thank you for your enquiry regarding *${customerProduct}*. 
We have received your request and one of our sales representatives, *${salesPersonName}*, will contact you shortly to assist you further. 
If you have any immediate questions, please feel free to contact us at *${SSPNumber}*.

Product File :
- [Link to Product File 1](${file})
- [Link to Product File 2](${file})
- [Link to Product File 3](${file})

*Best regards,*
Team New Keshav Tractors`;

        const chatPayloads = {
          phoneNumbers: [customerWhatsAppNumber],
          message: acknowledgmentMessage,
          files: file,
        };

        //Comment this while on Development
        InstantMessagingUtils(chatPayloads);
      } else {
        console.log({ isSuccess: false, result: "No data found." });
      }
    }
  });
};

//For Sales Person Acknowledgement
const sendMessageToSSP = async (enquiryId) => {
  const sql = `CALL sp_get_ssp_message_data(${enquiryId})`;
  await db.query(sql, (error, dataResults) => {
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
        console.log(SSPNumber, customerName, customerPhoneNumber, "mesashsd");
        const acknowledgmentMessage = `*Hello, ${salesPersonName}.*

You have a new enquiry from *${customerName}* *(${customerPhoneNumber})* regarding *${customerProduct}*. 
Please contact the customer at your earliest convenience. 
For any immediate assistance, the customer's contact number is *${customerPhoneNumber}*.

*Best regards,*
Team New Keshav Tractors`;
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
const attachProductFile = (mappingId) => {
  console.log(mappingId, "asadkjasjd")
  return new Promise((resolve, reject) => {

    const url = `CALL sp_get_product_documents_details(${mappingId}, ${1})`;

    db.query(url, (err, dataResults) => {
      if (err) {
        console.log({ isSuccess: false, result: "error" });
        reject(err);
      } else {
        // console.log({ isSuccess: true, result: result });
        console.log(dataResults, "reiskekrerll");

        if (dataResults && dataResults.length > 0) {
          const rowDataPacket = dataResults[0][0];
          const documentPath = rowDataPacket.document_path
          const tempURL = fileUtils.generateTempURL(documentPath);
    
          console.log(tempURL, 'filepath')
          resolve(tempURL); // Resolve the promise with the file path
        } else {
          console.log({ isSuccess: false, result: "No data found" });
          resolve(null); // Resolve with null if no data is found
        }
      }
    });
  });
};

module.exports = { instantEnquiryMessage, sendTaskAssignmentNotification };
