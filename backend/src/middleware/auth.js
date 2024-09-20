const ErrorHander = require("../utils/errorhander");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


exports.isAuthenticatedUser = async (req, res, next) => {

    try {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            req.token = authHeader.substring(7);
        }
        // const { token } = req.cookies;
        if (!req.token) {
            return res.status(401).json({
                status: false,
                data: {},
                message: "pleses login to access this resource",
            });
        }
        const decodedData = jwt.verify(req.token, process.env.JWT_SECRET);

        req.user = await User.findById(decodedData.id);
        next();

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }

};


exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHander(`Role (${req.user.role}) is not allowed to acccess this resource`, 403))
        }
        next()
    }
}