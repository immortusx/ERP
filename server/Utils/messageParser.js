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

const getAddEnquiryMessage = async (salesPersonName, SSPNumber) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT message FROM messages WHERE action = 1 AND type = 1`,
        (error, dataResults) => {
          if (error) {
            console.log({ isSuccess: false, result: "error" });
            resolve(null);
          } else {
            console.log(dataResults, "add enquiry result dataResults");
            if (dataResults && dataResults.length > 0) {
              const rowDataPacket = dataResults[0];
              let addEnquiryMessage = rowDataPacket.message;
              addEnquiryMessage = addEnquiryMessage.replace(
                "${SALES_PERSON}",
                salesPersonName
              );
              addEnquiryMessage = addEnquiryMessage.replace(
                "${SSP_NUMBER}",
                SSPNumber
              );
              resolve(addEnquiryMessage);
              console.log(addEnquiryMessage, "add enquiry");
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

module.exports = { getAddEnquiryMessage };
