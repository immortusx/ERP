const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: "./upload",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${Date.now()}_${file.originalname}`
    );
  },
});
const uploadFile = multer({ storage: storage });
module.exports = uploadFile;
