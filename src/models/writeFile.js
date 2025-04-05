const fs = require("fs").promises;
const path = require("path");

const dbFilePath = (fileName) => path.resolve("db", fileName);

const writeFile = async (fileName, data) => {
    await fs.writeFile(dbFilePath(fileName), JSON.stringify(data, null, 4));
    return true;
};

module.exports = { writeFile };
