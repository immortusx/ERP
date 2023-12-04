const request = require("request");

const appkey = "05626b99-4844-4c7b-a50d-f3d099e083f8";
const authkey = "NC7XbbbVAG9m1pQgPJZRf4UtMHwZRWmKs5moS5O8NAxsa1D3l4";

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
          // file: files,
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
