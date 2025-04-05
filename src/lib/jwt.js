
const jwt = require("jsonwebtoken");

const secretKey = process.env.TOKEN_KEY||"myAppSecretTokenKey";
if (!secretKey) {
    throw new Error("TOKEN_KEY is not defined in .env file");
}
const jwtUtils = {
    sign: payload => jwt.sign(payload, secretKey),
    verify: token => jwt.verify(token, secretKey)
};
module.exports ={ jwtUtils}