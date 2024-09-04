const crypto = require("node:crypto");

const hashObject = function (content) {
    // SHA-1 produce 160-bit hash value - typically rendered as 40 hexadecimal digits.
    return crypto.createHash("sha1").update(content, "utf-8").digest("hex");
};

module.exports = hashObject;
