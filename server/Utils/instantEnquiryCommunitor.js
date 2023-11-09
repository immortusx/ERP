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
    let message = `Subject: Inquiry for New Sonalika DI-27 - Customer: Vijay Sharma - Assigned Sales Representative: Bharat Vakani

    Dear Vijay Sharma,
    Greetings from Team New Keshav Tractors!

    We have recently received an inquiry from Mr. Vijay Sharma regarding the acquisition of a new Sonalika DI-27. 
    Mr. Sharma has been assigned to your capable hands, and we believe your expertise will greatly contribute to ensuring a seamless and satisfactory experience for him.
    Your swift attention to this matter is highly appreciated, and we are confident that, under Mr. Vakani's guidance, Mr. Sharma will experience a seamless and satisfactory journey with our
    products.

    Should you have any further inquiries or require additional information, please do not hesitate to reach out.

    Best regards,   
    Team New Keshav Tractors`;

    const chatPayloads = {
      phoneNumbers: phoneNumbers,
      message: message,
      files: "https://www.africau.edu/images/default/sample.pdf",
    };
    InstantMessagingUtils(chatPayloads);
  } catch (error) {
    console.log({ isSuccess: false, result: error });
  }
};

module.exports = { instantEnquiryMessage };
