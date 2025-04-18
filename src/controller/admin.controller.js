const { ClientError, globalError } = require("../error/error.js");
const { jwtUtils } = require("../lib/jwt");
const { sign ,verify } = jwtUtils;
const { readFile } = require("../models/readFile.js");
const { writeFile } = require("../models/writeFile.js");

class AdminController {

    async get(req, res) {
        try {
            let admin= await readFile("admin.json")
            let token=req.headers.token;
            token= verify(token)
            if (!token.id||token.role!=="admin") new ClientError("Invalid token", 400)
            let candidate =admin.find((adm)=>adm.id==token.id)
            res.status(200).json(candidate)
        } catch (e) {
            return globalError(res, e);
        }
    }
    async Update(req, res) {
        try {
          let admin= await readFile("admin.json")
            let token=req.headers.token;
            token= verify(token)
            if (!token.id||token.role!=="admin") new ClientError("Invalid token", 400)
            let candidate =admin.findIndex((emp)=>emp.id==token.id)
            const { username, email, password } = req.body;
            admin[candidate].username=username
            admin[candidate].email=email
            admin[candidate].password=password
            admin[candidate].updatedAt=new Date()
            await writeFile("admin.json", admin);
            res.status(200).json(["Admin sucsesfully updated"])

        } catch (e) {
            return globalError(res, e);
        }
    }

    
}

module.exports = new AdminController();