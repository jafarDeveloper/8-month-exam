const { ClientError, globalError } = require("../error/error.js");
const { jwtUtils } = require("../lib/jwt");
const { sign ,verify } = jwtUtils;
const { readFile } = require("../models/readFile.js");
const { writeFile } = require("../models/writeFile.js");

class UserController {
    async getAct(req, res) {
        try {
          let users= await readFile("users.json")
          let par=req.params.id ;
          let candidate=users.find((emp)=>emp.id==par)
          res.status(200).json(candidate)
        } catch (e) {
            return globalError(res, e);
        }
    }
    async getOnly(req, res) {
        try {
          let users= await readFile("users.json")
          let par= verify(req.headers?.token).id;
          let candidate=users.find((emp)=>emp.id==par)
          res.status(200).json(candidate)
        } catch (e) {
            return globalError(res, e);
        }
    }
    async Update(req, res) {
        try {
          let users= await readFile("users.json")
            let token=req.headers.token;
            token= verify(token)
            if (!token.id||token.role!=="user") new ClientError("Invalid token", 400)
            let candidate =users.findIndex((emp)=>emp.id==token.id)
            const { username, phone, email, password } = req.body;
            users[candidate].username=username
            users[candidate].phone_num=phone
            users[candidate].email=email
            users[candidate].password=password
            users[candidate].updatedAt=new Date()
            await writeFile("users.json", users);
            res.status(200).json(["User sucsesfully updated"])

        } catch (e) {
            return globalError(res, e);
        }
    }

    
}

module.exports = new UserController();