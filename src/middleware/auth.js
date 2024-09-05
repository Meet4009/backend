const ErrorHander = require("../utils/errorhander");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


exports.isAuthenticatedUser = async (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(404).json({
            status: false,
            data: {},
            message: "pleses login to access this resource"
        });
    }
    try {



        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

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