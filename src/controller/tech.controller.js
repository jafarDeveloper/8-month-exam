const { ClientError, globalError } = require("../error/error.js");
const { jwtUtils } = require("../lib/jwt");
const { sign, verify } = jwtUtils;
const { readFile } = require("../models/readFile.js");
const { writeFile } = require("../models/writeFile.js");
class TechController {
    async get(req, res) {
        try {
            let techs = await readFile("technologies.json")
            res.status(200).json(techs)
        } catch (e) {
            return globalError(res, e);
        }
    }
}
module.exports = new TechController();