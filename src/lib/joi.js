const Joi = require("joi");
const { ClientError } = require("../error/error");

// Email faqat Gmail va Googlemail uchun tekshiriladi
const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|googlemail\.com)$/i;
const phoneRegex = /^998(90|91|93|94|95|97|98|99|33|88|77)[0-9]{7}$/i;

// JOI sxemasi
const registerSchema = Joi.object({
    username: Joi.string().required().messages({
        "any.required": "Username is required !",
    }),
    phone: Joi.string().pattern(phoneRegex).required().messages({
        "any.required": "Phone number is required !",
    }),
    email: Joi.string().pattern(emailRegex).required().messages({
        "any.required": "Email is required !",
        "string.pattern.base": "Email is invalid !",
    }),
    password: Joi.string().min(6).max(12).required().messages({
        "any.required": "Password is required !",
        "string.min": "Password is too short! Min 6 characters.",
        "string.max": "Password is too long! Max 12 characters.",
    }),
});

// **Register Validator Middleware**
const registerValidator = (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return  res.status(400).json({Error: error.details.map(err => err.message).join(", ")});
    
    }
    next();
};

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required().messages({
        "any.required": "Email is required !",
        "string.pattern.base": "Email is invalid !",
    }),
    password: Joi.string().min(6).max(12).required().messages({
        "any.required": "Password is required !",
        "string.min": "Password is too short! Min 6 characters.",
        "string.max": "Password is too long! Max 12 characters.",
    }),
});

const loginValidator = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({Error: error.details.map(err => err.message).join(", ")});
    }
    next();
};

module.exports = { registerValidator, loginValidator };