const express = require("express");
const request = require("request");
const { tokenCheck } = require("../Auth/TokenCheck");
const fs = require("fs");
const fastcsv = require("fast-csv");
const { db } = require("../Database/dbConfig");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { InstantMessagingUtils } = require("../Utils/MessagingHelpers");
const router = express.Router();

router.post("/send-whatsapp", tokenCheck, (req, res) => {
  console.log(req.body, "send whatsapp");
  const customerNumber = req.body.customerNumber;
  res.send({ isSuccess: true, result: "Sent" });
  const salesPersonQuery = "SELECT phone_number FROM users WHERE id = 75";
  db.query(salesPersonQuery, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: "error" });
      // res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log({ isSuccess: true, result: result });
      console.log(result, "sale phone nmube");
      const phoneNumbers = [];
      let salesPersonWhatsAppNumber = result[0].phone_number;
      console.log(phoneNumbers, "ponenr");
      phoneNumbers.push(customerNumber, salesPersonWhatsAppNumber);
      const chatPayloads = {
        phoneNumbers: phoneNumbers,
        message: "Hello, Testing Hii",
        files: "https://www.africau.edu/images/default/sample.pdf",
      };
      InstantMessagingUtils(chatPayloads);
      res.send({ isSuccess: false, result: "error" });
    }
  });
});

//=========================Send Message=======================//
router.post("/send-message", tokenCheck, async (req, res) => {
  try {
    const { newMessage, chatID } = req.body;
    console.log("/send-message", req.body);
    const url = `SELECT 
    CASE 
      WHEN c.whatsapp_number LIKE '91%' THEN c.whatsapp_number
      ELSE CONCAT('91', c.whatsapp_number)
    END AS customerNumber
  FROM customers AS c
  WHERE c.whatsapp_number IS NOT NULL AND c.whatsapp_number <> 'null' LIMIT 30
  `;
    await db.query(url, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result, result: "error" });
      } else {
        console.log({ isSuccess: true, result: result });
        if (result && result.length > 0) {
          console.log(result[0].customerNumber, "otroti");
          const phoneNumbers = [];
          for (const customer of result) {
            let phoneNumber = Number(customer.customerNumber);
            phoneNumbers.push(phoneNumber);
          }
          console.log(phoneNumbers, "phoneNumbers"); // This will log an array of phone numbers
          const chatPayloads = {
            phoneNumbers: phoneNumbers,
            message: newMessage,
            files: "https://www.africau.edu/images/default/sample.pdf",
          };
          InstantMessagingUtils(chatPayloads);
        }
        res.send({ isSuccess: true, result: "success" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
