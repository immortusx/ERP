const request = require("request");

const appkey = "86906369-e91b-4772-8776-b49ce3778fd5";
const authkey = "qZNwxpV01C58oQa1FluB24YUv3p61zuZf0Re0L795Z5UWrW3ao";

const InstantMessagingUtils = async (chatPayloads) => {
  const { phoneNumbers, message, files } = chatPayloads;
  if(files === undefined){
    phoneNumbers.forEach(function (phoneNumber) {
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
    phoneNumbers.forEach(function (phoneNumber) {
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
