// file to base64 converter
function toBase64(filePath) {
    const fs = require('fs'),
    file = filePath,
    data = fs.readFileSync(file);
    const attachment_content = data.toString('base64');
    return attachment_content;
}

module.exports = {
    toBase64,
}