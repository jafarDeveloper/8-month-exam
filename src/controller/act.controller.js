const { ClientError, globalError } = require("../error/error.js");
const { jwtUtils } = require("../lib/jwt");
const { sign, verify } = jwtUtils;
const { readFile } = require("../models/readFile.js");
const { writeFile } = require("../models/writeFile.js");

class ActController {
  async create(req, res) {
    try {

      const actions = await readFile("actions.json");
      const users = await readFile("users.json");
      const employes = await readFile("employee.json");
      const technologies = await readFile("technologies.json");
      const prices = await readFile("prices.json");

      const { username, phone, email, password, tech_id, emp_id } = req.body;

      let existingClient = users.find(
        (client) => client.phone === phone && client.email === email
      );

      let user_id;

      if (!existingClient) {
        const lastClient = users[users.length - 1];
        const newuser_id = lastClient ? lastClient.id + 1 : 1;

        const newUser = {
          id: newuser_id,
          username,
          email,
          password,
          phone,
          createdAt: new Date(),
        };

        users.push(newUser);
        writeFile("users.json", users);
        user_id = newuser_id;
      } else {
        user_id = existingClient.id;
      }

      const alreadyActioned = actions.some((action) => action.user_id === user_id);
      if (alreadyActioned) {
        return res
          .status(409)
          .json({ message: "Client already submitted an action", status: 409 });
      }


      const employeIndex = employes.findIndex((emp) => emp.id == emp_id);
      if (employeIndex === -1) {
        return res.status(404).json({ message: "Employe not found", status: 404 });
      }

      if ((employes[employeIndex].act_count != 0) >= 3) {
        return res
          .status(403)
          .json({ message: "Employe has reached maximum workload", status: 403 });
      }
      const lastAction = actions[actions.length - 1];
      const newActionId = lastAction ? lastAction.id + 1 : 1;

      const findPrice = prices.find((p) => p.tech_id == tech_id);
      const totalPrice = findPrice ? findPrice.price : 0;

      const newAction = {
        id: newActionId,
        user_id: user_id,
        emp_id: emp_id,
        tech_id: tech_id,
        date: new Date(),
        totalPrice: totalPrice,
        status: 0,
        createdAt: new Date(),
      };

      employes[employeIndex].act_count = (employes[employeIndex].act_count || 0) + 1;


      actions.push(newAction);
      writeFile("actions.json", actions);
      writeFile("employee.json", employes);

      res.status(201).json({
        message: "action added successfully",
        status: 201,
        data: newAction,
      });


    } catch (e) {
      return globalError(res, e);
    }
  }

  async get(req, res) {
    try {
      let users = await readFile("users.json");
      let techs = await readFile("technologies.json");
      let employees = await readFile("employee.json");
      let token = req.headers.token;
      token = verify(token)
      if (!token.id) new ClientError("Invalid token", 400)
      if (token.role == "admin") {
        let acts = await readFile("actions.json");

        res.status(200).json(acts)
      }
      if (token.role == "user") {
        let acts = await readFile("actions.json");
        acts = acts.filter((act) => act.user_id == token.id)
        res.status(200).json(acts)
      }
      if (token.role == "employee") {
        let acts = await readFile("actions.json");
        acts = acts.filter((act) => act.emp_id == token.id && act.status !== 1)
        res.status(200).json(acts)
      }
    } catch (e) {
      return globalError(res, e);
    }
  }
  async Update(req, res) {
    try {
      let acts = await readFile("actions.json");
      let token = req.headers.token;
      let id = req.params.id
      token = verify(token)
      if (!token.id || token.role !== "employee") new ClientError("Invalid token", 400)
      let candidate = acts.findIndex((emp) => emp.id == id)
      acts[candidate].status = acts[candidate].status + 1
      acts[candidate].updatedAt = new Date()
      await writeFile("actions.json", acts);
      res.status(200).json(["Action sucsesfully updated"])

    } catch (e) {
      return globalError(res, e);
    }
  }


}

module.exports = new ActController();