const { ClientError, globalError } = require("../error/error.js");
const { jwtUtils } = require("../lib/jwt");
const { sign,verify } = jwtUtils;
const { readFile } = require("../models/readFile.js");
const { writeFile } = require("../models/writeFile.js");

class UserController {
    async checkToken(req,res){
        try {
            let token=req.headers.token;
            token= verify(token)
            return res.status(200).json({ role: token.role});

        } catch (e) {
            return globalError(res, e);
        }
    }
    async register(req, res) {
        try {
            const { username, phone, email, password } = req.body;
            let users = await readFile("users.json");
            let employees = await readFile("employee.json");
            let admin = await readFile("admin.json");

            // Emailni ikkala rolda tekshirish
            const candidate = employees.find(user => user.email == email) || users.find(user => user.email == email)|| admin.find(adm => adm.email == email);

            if (candidate) {
                new ClientError('This email already exists', 400)
                return res.status(400).json({Error:'This email already exists'});
            }

            let newUser = {
                id: 1, // Default ID
                username,
                phone,
                email,
                password,
                "createdAt": new Date()
            };

            if (req.url === "/api/auth/register/employee") {
                
                newUser.id = employees.length > 0 ? employees.at(-1).id + 1 : 1;
                newUser.act_count=0
                delete newUser.phone
                newUser.phone_num=phone
                employees.push(newUser);
                await writeFile("employee.json", employees);
                const token = sign({ id: newUser.id, role: "employee" });
                return res.status(201).json({ token });
            } 
            else if (req.url === "/api/auth/register/user") {
                cli
                let id= users.length > 0 ? users.at(-1).id + 1 : 1;
                newUser.id =id
                users.push(newUser);
                await writeFile("users.json", users);
                const token = sign({ id: newUser.id, role: "user" });
                 return res.status(201).json(id);
            }

            return res.status(400).json({ error: "Invalid registration path" });
        } catch (e) {
            return globalError(res, e);
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            let users = await readFile("users.json");
            let admins = await readFile("admin.json");
            let employees = await readFile("employee.json");

            let candidate = admins.find(adm => adm.email === email && adm.password === password);
            if (candidate) {
                const token = sign({ id: candidate.id, role: "admin" });
                return res.status(200).json({role:"admin", token });
            }

            candidate = employees.find(emp => emp.email === email && emp.password === password);
            if (candidate) {
                const token = sign({ id: candidate.id, role: "employee" });
                return res.status(200).json({role: "employee", token });
            }

            candidate = users.find(user => user.email == email && user.password == password);
            if (candidate) {
                const token = sign({ id: candidate.id, role: "user" });
                return res.status(200).json({ role: "user", token });
            }

            return res.status(401).json({ error: "Invalid email or password" });
        } catch (e) {
            return globalError(res, e);
        }
    }
}

module.exports = new UserController();