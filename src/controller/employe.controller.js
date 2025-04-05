const { ClientError, globalError } = require("../error/error.js");
const { jwtUtils } = require("../lib/jwt");
const { sign ,verify } = jwtUtils;
const { readFile } = require("../models/readFile.js");
const { writeFile } = require("../models/writeFile.js");

class EmployeController {
    async get(req, res) {
        try {
          let employees= await readFile("employee.json")
          res.status(200).json(employees)
        } catch (e) {
            return globalError(res, e);
        }
    }
    async getAct(req, res) {
        try {
          let employees= await readFile("employee.json")
          let par=req.params.id;
          let candidate=employees.find((emp)=>emp.id==par)
          res.status(200).json(candidate)
        } catch (e) {
            return globalError(res, e);
        }
    }
    async getOnly(req, res) {
        try {
          let employees= await readFile("employee.json")
          let par=verify(req.headers?.token).id;
          let candidate=employees.find((emp)=>emp.id==par)
          res.status(200).json(candidate)
        } catch (e) {
            return globalError(res, e);
        }
    }
    async Update(req, res) {
        try {
          let employees= await readFile("employee.json")
            let token=req.headers.token;
            token= verify(token)
            if (!token.id||token.role!=="employee") new ClientError("Invalid token", 400)
            let candidate =employees.findIndex((emp)=>emp.id==token.id)
            const { username, phone, email, password } = req.body;
            employees[candidate].username=username
            employees[candidate].phone_num=phone
            employees[candidate].email=email
            employees[candidate].password=password
            employees[candidate].updatedAt=new Date()
            await writeFile("employee.json", employees);
            res.status(200).json(["Employee sucsesfully updated"])

        } catch (e) {
            return globalError(res, e);
        }
    }

    
}

module.exports = new EmployeController();