const path = require("path");
const fs = require("fs");

function generateTempURL(filename) {
  return `${process.env.REACT_APP_NODE_URL}/api/public/${encodeURIComponent(filename)}`;
}

// Function to handle requests for temporary files
function handleTempFileRequest(req, res) {
  const { filePath } = req.query;

  if (!filePath || !tempUrls[filePath]) {
    return res.status(404).json({ error: "Invalid file path" });
  }

  const expirationTime = tempUrls[filePath];

  // Check if the temp URL has expired
  if (Date.now() > expirationTime) {
    delete tempUrls[filePath];
    return res.status(404).json({ error: "Temp URL has expired" });
  }

  // Set headers and send the file
  const fileName = path.basename(filePath);
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  // Replace the path with the correct path on your server
  const fullPath = path.join(__dirname, filePath);
  const fileStream = fs.createReadStream(fullPath);
  fileStream.pipe(res);
}

// In-memory storage for temporary URLs (replace with a database in production)
const tempUrls = {};

module.exports = { generateTempURL, handleTempFileRequest };
