const request = require("request");

const appkey = process.env.appkey;
const authkey = process.env.authkey;
const { db } = require("../Database/dbConfig");

const InstantMessagingUtils = async (chatPayloads) => {
  const { phoneNumbers, message, files } = chatPayloads;

  const regardsMessage = (await getRegardsMessages().catch(() => null)) || "From Our Teams";
  const newMessage = `${message}\n\n*Best regards,*\n${regardsMessage}`;

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
          message: newMessage,
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
          message: newMessage,
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

const getRegardsMessages = async () => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM configuration WHERE setting = 'agency' AND key_name = 'name'`,
        (error, dataResults) => {
          if (error) {
            console.log({ isSuccess: false, result: "error" });
            resolve(null);
          } else {
            console.log(dataResults, "dataResults");
            if (dataResults && dataResults.length > 0) {
              const rowDataPacket = dataResults[0];
              const regardsMessage = rowDataPacket.value;
              resolve(regardsMessage);
              console.log(regardsMessage, "read");
            } else {
              console.log({ isSuccess: false, result: "No data found" });
              resolve(null);
            }
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
module.exports = { InstantMessagingUtils };
