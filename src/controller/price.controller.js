const { ClientError, globalError } = require("../error/error.js");
const { jwtUtils } = require("../lib/jwt");
const { sign ,verify } = jwtUtils;
const { readFile } = require("../models/readFile.js");
const { writeFile } = require("../models/writeFile.js");

class PriceController {
    async get(req, res) {
        try {
          let prices= await readFile("prices.json")
          
          res.status(200).json(prices)
        } catch (e) {
            return globalError(res, e);
        }
    }
    async getOnly(req, res) {
        try {
          let prices= await readFile("prices.json")
          let par=req.params.id;
          let candidate=prices.find((emp)=>emp.tech_id==par)
          res.status(200).json(candidate)
        } catch (e) {
            return globalError(res, e);
        }
    }
}

module.exports = new PriceController();