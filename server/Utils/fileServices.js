// fileUtils.js
const path = require('path');
const fs = require('fs');

function createTempURL(filename) {

  return `${"https://crm.balkrushna.com/api/temp-file/upload/"}${filename}`;
}

function getFileStream(filename) {
  const filePath = path.join(__dirname, filename);
  return fs.createReadStream(filePath);
}

module.exports = {
  createTempURL,
  getFileStream,
};
