const fs = require("fs").promises;
const path = require("path");

const dbFilePath = (fileName) => path.resolve("db", fileName);

const readFile = async (fileName) => {
    let read = await fs.readFile(dbFilePath(fileName), "utf-8");
    return read ? JSON.parse(read) : [];
};

module.exports = { readFile };