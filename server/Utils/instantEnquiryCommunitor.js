const async = require("async");
const express = require("express");
const { tokenCheck } = require("../Auth/TokenCheck");
const { getDateInFormate } = require("../Utils/timeFunctions");
const moment = require("moment");
const { db } = require("../Database/dbConfig");
const { InstantMessagingUtils } = require("./MessagingHelpers");

const instantEnquiryMessage = async (messagePayloads) => {
  const { userId, enquiryId, customerNumber } = messagePayloads;
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
        const acknowledgmentMessage = `Dear ${customerName}, 
        Thank you for your enquiry regarding ${customerProduct}. 
        We have received your request and one of our sales representatives, ${salesPersonName}, will contact you shortly to assist you further. 
        If you have any immediate questions, please feel free to contact us at ${SSPNumber}.

        Best regards,
        Team New Keshav Tractors`;
        const chatPayloads = {
          phoneNumbers: [customerPhoneNumber],
          message: acknowledgmentMessage,
          files: "https://www.africau.edu/images/default/sample.pdf",
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
        console.log(SSPNumber, customerName, customerPhoneNumber, "mesashsd");
        const acknowledgmentMessage = `Hello,
          You have a new enquiry from ${customerName} (${customerPhoneNumber}) regarding ${customerProduct}. 
          Please contact the customer at your earliest convenience. 
          For any immediate assistance, the customer's contact number is ${customerPhoneNumber}.

          Best regards,
          Team New Keshav Tractors`;
        const chatPayloads = {
          phoneNumbers: [SSPNumber],
          message: acknowledgmentMessage,
          files: "https://www.africau.edu/images/default/sample.pdf",
        };

        //Comment this while on Development
        InstantMessagingUtils(chatPayloads);
      } else {
        console.log({ isSuccess: false, result: "No data found." });
      }
    }
  });
};

module.exports = { instantEnquiryMessage };
