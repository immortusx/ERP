const fs = require('fs');
const path = require('path');

function copyFile(sourceFilename, sourceDirectory, destinationDirectory) {
  try {
    const sourcePath = path.join(__dirname, './upload', sourceFilename);
    const destinationPath = path.join(__dirname, './public', sourceFilename);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destinationPath);
      console.log("File copied successfully");
      return Promise.resolve(sourceFilename);
    } else {
      console.error("Source file does not exist:", sourcePath);
      return Promise.resolve(null); // Resolve with null if the source file does not exist
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

module.exports = {
  copyFile,
};
