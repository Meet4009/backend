const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");
const { log } = require("console");



// --------------------------------------------------------------------------- //
// ----------------------------  Register a User ----------------------------- //
// --------------------------------------------------------------------------- //

exports.registerUser = catchAsyncErrors(async (req, res) => {
    const { name, email, password, mobile_No, country } = req.body;
    
    const user = await User.create({
        name,
        email,
        mobile_No,
        country,
        password,
    });
    
    const token = user.getJWTToken();
    
    sendToken(user, 200, res);
});



// --------------------------------------------------------------------------- //
// -------------------------------  Login User  ------------------------------ //
// --------------------------------------------------------------------------- //

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body

    // cheaking if user has given password  and email both 

    if (!email || !password) {
        return next(new ErrorHander("please Enter Email and password ", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHander("Invalid Email and password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid Email and password", 401));

    }

    user.loggedIn = true;           // Set loggedIn to true
    user.save();

    sendToken(user, 200, res);

});



// --------------------------------------------------------------------------- //
// ------------------------------  Logout User  ------------------------------ //
// --------------------------------------------------------------------------- //

exports.logout = catchAsyncErrors(async (req, res, next) => {
    /////////////////////////////////////////
    const { token } = req.cookies;
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodeData.id);

    user.loggedIn = false;                              // Set loggedIn to false
    user.save();
    ////////////////////////////////////////////

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        status: true,
        message: "logged out"
    });
});



// --------------------------------------------------------------------------- //
// --------------------------  Update User Password  ------------------------- //
// --------------------------------------------------------------------------- //

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    // const isPasswordMatched = await user.comparePassword(req.body.oldpassword);

    // if (!isPasswordMatched) {
    //     return next(new ErrorHander("old password is incorrect", 400));
    // }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);

});



// --------------------------------------------------------------------------- //
// ----------------------------  Get User Details  --------------------------- //
// --------------------------------------------------------------------------- //

exports.getUserDatails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        status: true,
        data: user,
    })

});



// --------------------------------------------------------------------------- //
// -------------------------  Update Profile -- user  ------------------------ //
// --------------------------------------------------------------------------- //

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        mobile_No: req.body.mobile_No,
        country: req.body.country,
        language: req.body.language
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        data: user,
        messaage: "update sucessfully"
    })
});



// --------------------------------------------------------------------------- //
// ------------------------  Get all Users --  Admin  ------------------------ //
// --------------------------------------------------------------------------- //

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        status: true,
        users,
    });
});



// --------------------------------------------------------------------------- //
// ------------------------  Get single user --  Admin  ---------------------- //
// --------------------------------------------------------------------------- //

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHander(`User doen not exist Id: ${req.params.id}`, 400));
    }

    res.status(200).json({
        success: true,
        messaage: "update sucessfully",
        user,
    });
});



// --------------------------------------------------------------------------- //
// ----------------------  Update User Profile -- Admin  --------------------- //
// --------------------------------------------------------------------------- //

exports.updateUserData = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        mobile_No: req.body.mobile_No,
        country: req.body.country,
        language: req.body.language
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });


    res.status(200).json({
        success: true
    })
});



// --------------------------------------------------------------------------- //
// --------------------------- Delet User -- Admin  -------------------------- //
// --------------------------------------------------------------------------- //


exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    // we will  remove cloudnary later

    if (!user) {
        return next(
            new ErrorHander(`User does not exist  with Id ${req.params.id}`, 400)
        );
    }
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Delete sucessfully"
    });
});



// -------------------------------------------  Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    //Get ResetPassword Token 
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    console.log(resetPasswordUrl);

    const message = `Your password reset token is : - \n\n ${resetPasswordUrl}\n\nIf you have not requested this email then, please ignore it  `

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });
        res.status(200).json({
            status: true,
            message: `Email sent to ${user.email} sucesssfully`,
        })

    } catch (error) {
        user.resetpasswordToken = undefined;
        user.resetpasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHander(error.message, 500))

    }
});


// reset password

exports.resetpassword = catchAsyncErrors(async (req, res, next) => {

    // -----------------------------------  Creating Token Hash
    const resetpasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetpasswordToken,
        resetpasswordExpire: { $gt: Date.now() },
    });

    console.log(user);

    if (!user) {
        return next(new ErrorHander("Reset password Token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("password does not match", 400));
    }
    user.password = req.body.password;
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);

});




