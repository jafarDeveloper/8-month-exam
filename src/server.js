const { config } = require("dotenv");
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const authController = require("./controller/auth.controller");
const { loginValidator, registerValidator } = require("./lib/joi");
const employeController = require("./controller/employe.controller");
const userController = require("./controller/user.controller");
const techController = require("./controller/tech.controller");
const priceController = require("./controller/price.controller");
const adminController = require("./controller/admin.controller");
const actController = require("./controller/act.controller");

config();
let PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json())
app.use(cors());
app.post( "/api/auth/login", loginValidator, authController.login)
app.post("/api/auth/register/*", registerValidator, authController.register)
app.get("/api/auth/check-token",  authController.checkToken)

app.put('/api/employe', employeController.Update)
app.get('/api/employee/:id', employeController.getAct)
app.get('/api/employee', employeController.getOnly)
app.get("/api/employees", employeController.get)

app.get('/api/techs', techController.get)

app.put('/api/admin', adminController.Update)
app.get('/api/admin', adminController.get)

app.get('/api/acts', actController.get)
app.put('/api/actes/:id', actController.Update)
app.post('/api/actes', actController.create)

app.get('/api/prices', priceController.get)
app.get('/api/prices/:id', priceController.getOnly)

app.put('/api/user', userController.Update)
app.get('/api/users/:id', userController.getAct)
app.get('/api/users', userController.getOnly)

app.use(express.static("views"));
app.get("*", (req, res) => {
    if (!req.url.startsWith("/api")) {
        if (req.url.startsWith("/js")) {
    
            res.sendFile(join(process.cwd(),"/public", req.url));
        } else {
    
            res.sendFile(join(process.cwd(), "src", "views", req.url === "/" ? "index.html" : req.url));
        }
        
    }
});
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}-port`);
});