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
      res.send({isSuccess: false, result: 'error'})
    }
  });
});

module.exports = router;
