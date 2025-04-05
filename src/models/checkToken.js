const { ClientError, globalError } = require("../error/error");
const { tokenService } = require("../lib/jwt/jwt");
const { readFile } = require("./readFile");

const checkToken = async (req, res, next) => {
    try {
        let token = req.headers.token;
        if (!token) throw new ClientError("Unauthorized", 401);

        let verifyToken = tokenService.verifyToken(token);
        let users = await readFile("users.json");
        let admins = await readFile("admin.json");
        let employees = await readFile("employee.json");

        let isValidUser =
            users.some((user) => user.id == verifyToken.user_id) ||
            admins.some((user) => user.id == verifyToken.admin_id) ||
            employees.some((user) => user.id == verifyToken.employee_id);

        if (!isValidUser) throw new ClientError("Token is invalid!", 401);
        if (verifyToken.userAgent !== req.headers["user-agent"]) throw new ClientError("Token is invalid!", 401);

        next(); 
    } catch (error) {
        globalError(res, { message: error.message, status: error.status });
    }
};

module.exports = { checkToken };
