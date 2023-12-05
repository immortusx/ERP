const request = require("request");

const appkey = process.env.appkey;
const authkey = process.env.authkey;

const InstantMessagingUtils = async (chatPayloads) => {
  const { phoneNumbers, message, files } = chatPayloads;
  const formattedPhoneNumbers = phoneNumbers.map((phoneNumber) => {
    // Check if the phone number starts with "91", if not, add it
    return String(phoneNumber).startsWith("91") ? phoneNumber : `91${phoneNumber}`;
  });
  if(files === undefined){
    formattedPhoneNumbers.forEach(function (phoneNumber) {
      var options = {
        method: "POST",
        url: "https://whats-api.rcsoft.in/api/create-message",
        headers: {},
        formData: {
          appkey: appkey,
          authkey: authkey,
          to: phoneNumber,
          message: message,
          // file: "https://crm.balkrushna.com/api/upload/1701076738457__upload_1696416072385_download%20(3).jpg",
        },
      };
  
      request(options, function (error, response, body) {
        if (error) {
          console.error("Error sending message to", phoneNumber, error);
        } else {
          if (response.statusCode === 200) {
            console.log("Message sent to", phoneNumber, body);
          } else {
            console.error(
              "Failed to send message to",
              phoneNumber,
              "Status Code:",
              response.statusCode,
              "Response:",
              body
            );
          }
        }
      });
    });
  }else{
    formattedPhoneNumbers.forEach(function (phoneNumber) {
      var options = {
        method: "POST",
        url: "https://whats-api.rcsoft.in/api/create-message",
        headers: {},
        formData: {
          appkey: appkey,
          authkey: authkey,
          to: phoneNumber,
          message: message,
          file: files,
        },
      };
  
      request(options, function (error, response, body) {
        if (error) {
          console.error("Error sending message to", phoneNumber, error);
        } else {
          if (response.statusCode === 200) {
            console.log("Message sent to", phoneNumber, body);
          } else {
            console.error(
              "Failed to send message to",
              phoneNumber,
              "Status Code:",
              response.statusCode,
              "Response:",
              body
            );
          }
        }
      });
    });
  }
};

module.exports = { InstantMessagingUtils };
