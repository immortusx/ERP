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
    let whatsappMessage = `${newMessage}`;

    console.log("/send-message", req.body);
    const url = `CALL sp_get_whatsapp_number(${chatID})`;
    await db.query(url, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result, result: "error" });
      } else {
        console.log({ isSuccess: true, result: result });
        if (result && result.length > 0) {
          console.log(result, "otroti");
          const phoneNumbers = [];
          for (const number of result[0]) {
            let phoneNumber = Number(number.whatsAppNumber);
            phoneNumbers.push(phoneNumber);
          }
          console.log(phoneNumbers, "phoneNumbers"); // This will log an array of phone numbers
          const chatPayloads = {
            phoneNumbers: phoneNumbers,
            message: whatsappMessage,
            // files: "https://www.africau.edu/images/default/sample.pdf",
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

router.post('/send-message-customer', tokenCheck, async (req, res) => {
  try {
    console.log('/send-message-customer', req.body);
    const {whatsapp_message, customerPhoneNumber} = req.body;

    const phoneNumbers = [customerPhoneNumber];
    InstantMessagingUtils({ phoneNumbers, message: whatsapp_message });

    console.log(`Sending message to customer ${customerPhoneNumber}: ${whatsapp_message}`);

    res.json({ isSuccess: true, result: 'Message sent to customer successfully.' });
  } catch (error) {
    console.log('Error sending message to customer:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
