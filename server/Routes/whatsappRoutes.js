const express = require('express');
const request = require('request');
const { tokenCheck } = require("../Auth/TokenCheck");
const fs = require("fs");
const fastcsv = require("fast-csv");
const { db } = require("../Database/dbConfig");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const router = express.Router();


router.post('/send-whatsapp', tokenCheck, (req, res) => {
    const whatsappMessage = req.body.whatsapp_message;
    let customerNumber = req.body.c_phone_number;

    const userId = req.myData.userId;

    const salesPersonId = userId;
    
    const salesPersonQuery = 'SELECT phone_number FROM users WHERE id = 75';
    db.query(salesPersonQuery, async (err, result) => {
        if (err) {
            console.log({ isSuccess: false, result: 'error' })
            // res.send({ isSuccess: false, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: result })
            console.log(result, 'sale phone nmube')
            const phoneNumbers = [];
            let salesPersonWhatsAppNumber = result[0].phone_number;
            console.log(phoneNumbers, 'ponenr')
            phoneNumbers.push(customerNumber, salesPersonWhatsAppNumber)
            phoneNumbers.forEach(function (phoneNumber) {
                var options = {
                    method: 'POST',
                    url: 'https://whats-api.rcsoft.in/api/create-message',
                    headers: {},
                    formData: {
                        appkey: '86906369-e91b-4772-8776-b49ce3778fd5',
                        authkey: 'qZNwxpV01C58oQa1FluB24YUv3p61zuZf0Re0L795Z5UWrW3ao',
                        to: phoneNumber,
                        message: whatsappMessage,
                        file: 'https://www.africau.edu/images/default/sample.pdf'
                    }
                };

                request(options, function (error, response, body) {
                    if (error) {
                        console.error('Error sending message to', phoneNumber, error);
                    } else {
                        if (response.statusCode === 200) {
                            console.log('Message sent to', phoneNumber, body);
                        } else {
                            console.error('Failed to send message to', phoneNumber, 'Status Code:', response.statusCode, 'Response:', body);
                        }
                    }
                });
            });
            // phoneNumbers.push(cust)
            // res.send({isSuccess: false, result: 'error'})

        }
    })
    res.send({ isSuccess: true, result: 'Sent' })

});

module.exports = router;
