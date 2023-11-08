const express = require('express');
const request = require('request');
const { tokenCheck } = require("../Auth/TokenCheck");
const router = express.Router();

router.post('/send-whatsapp', tokenCheck, (req, res) => {
console.log(req.body, 'erlelr')
    const phoneNumber = '916355193009';

    const options = {
        method: 'POST',
        url: 'https://whats-api.rcsoft.in/api/create-message',
        headers: {},
        formData: {
            appkey: '86906369-e91b-4772-8776-b49ce3778fd5',
            authkey: 'qZNwxpV01C58oQa1FluB24YUv3p61zuZf0Re0L795Z5UWrW3ao',
            to: phoneNumber,
            message: 'Welcome to New Keshav Tractors!',

        }
    };

    request(options, function (error, response, body) {
        if (error) {
            console.error('Error sending message to', phoneNumber, error);
            res.status(500).send('Failed to send WhatsApp message');
        } else {
            if (response.statusCode === 200) {
                console.log('Message sent to', phoneNumber, body);
                res.send('WhatsApp message sent to ' + phoneNumber);
            } else {
                console.error('Failed to send message to', phoneNumber, 'Status Code:', response.statusCode, 'Response:', body);
                res.status(response.statusCode).send('Failed to send WhatsApp message');
            }
        }
    });
});

module.exports = router;
