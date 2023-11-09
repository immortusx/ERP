const async = require("async");
const express = require("express");
const { tokenCheck } = require("../Auth/TokenCheck");
const { getDateInFormate } = require("../Utils/timeFunctions");
const moment = require("moment");
const { db } = require("../Database/dbConfig");
const { InstantMessagingUtils } = require("./MessagingHelpers");

const instantEnquiryMessage = async (messagePayloads) => {
  const { userId, customerNumber } = messagePayloads;

  const getSsp = () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT phone_number FROM users WHERE id = ${userId}`;
      db.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result && result.length > 0) {
            const sspNo = result[0].phone_number;
            resolve(sspNo);
          }
        }
      });
    });
  };

  try {
    const sspNumber = await getSsp();
    console.log(sspNumber, "SSP Number");
    let CustomerNumber = Number(customerNumber);
    let SSNumber = Number(sspNumber);
    const phoneNumbers = [CustomerNumber, SSNumber];
    const chatPayloads = {
      phoneNumbers: phoneNumbers,
      message: "Enquiry created",
      files: "https://www.africau.edu/images/default/sample.pdf",
    };
    InstantMessagingUtils(chatPayloads);
  } catch (error) {
    console.log({ isSuccess: false, result: error });
  }
};

module.exports = { instantEnquiryMessage };
