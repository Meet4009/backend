const ErrorHander = require("../utils/errorhander");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");
const { currencyConveraterFormUSD, currencyConveraterToTHB } = require("../utils/currencyConverater");
const userPayment = require("../models/userPayment");
const { calculateAmount } = require("../utils/paymentDecision");
const lottery = require("../models/lottery");
const { countDocuments } = require("../models/lotteryBuyer");


// --------------------------------------------------------------------------- //
// ----------- 1 --------------  Register a User ----------------------------- //
// --------------------------------------------------------------------------- //

exports.registerUser = async (req, res) => {

    try {
        const { name, email, password, mobile_No, country } = req.body;

        const user = await User.create({
            name,
            email,
            mobile_No,
            country,
            password,
        });

        sendToken(user, 200, res);

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
};



// --------------------------------------------------------------------------- //
// -------------- 2 --------------  Login User  ------------------------------ //
// --------------------------------------------------------------------------- //

exports.loginUser = async (req, res, next) => {

    try {
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
    } catch (error) {

        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
};



// --------------------------------------------------------------------------- //
// ---------- 3 ----------------  Logout User  ------------------------------ //
// --------------------------------------------------------------------------- //

exports.logout = async (req, res, next) => {

    try {
        const { token } = req.cookies;
        const decodeData = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodeData.id);

        user.loggedIn = false;                              // Set loggedIn to false
        user.save();


        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })

        res.status(200).json({
            status: true,
            message: "Logour successfully"
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
};



// --------------------------------------------------------------------------- //
// ------------ 4 -----------  Update User Password  ------------------------- //
// --------------------------------------------------------------------------- //

exports.updatePassword = async (req, res, next) => {

    try {
        const user = await User.findById(req.user.id).select("+password");

        // const isPasswordMatched = await user.comparePassword(req.body.oldpassword);     // If old password is required while updating password

        // if (!isPasswordMatched) {
        //     return next(new ErrorHander("old password is incorrect", 400));
        // }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return next(new ErrorHander("password does not match", 400));
        }

        user.password = req.body.newPassword;

        await user.save();

        sendToken(user, 200, res);

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
};



// --------------------------------------------------------------------------- //
// ------------- 5 --------------   User profile  ---------------------------- //
// --------------------------------------------------------------------------- //

exports.getUserDatails = async (req, res, next) => {

    try {
        const user = await User.findById(req.user.id);
        user.balance = await currencyConveraterFormUSD(user.currency_code, user.balance)

        res.status(200).json({
            status: true,
            data: user,
            message: "User data fatch successfully"
        })

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
};



// --------------------------------------------------------------------------- //
// ------------ 6 ----------  Update Profile -- user  ------------------------ //
// --------------------------------------------------------------------------- //

exports.updateProfile = async (req, res, next) => {

    try {
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
            useFindAndModify: true
        });

        res.status(200).json({
            success: true,
            data: user,
            messaage: "update sucessfully"
        })
    } catch (error) {

        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }

};


// --------------------------------------------------------------------------- //
// ----------- 7 ----------  Get all Users --  Admin  ------------------------ //
// --------------------------------------------------------------------------- //

exports.getAllUser = async (req, res, next) => {

    try {
        const users = await User.find();

        let usersDetails = await Promise.all(users.map(async (currentuser) => {
            return {
                ...currentuser.toObject(),
                balance: await currencyConveraterToTHB(1, currentuser.balance)
            };
        }));

        res.status(200).json({
            status: true,
            data: usersDetails,
            message: 'All user fatch successfully'
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
};



// --------------------------------------------------------------------------- //
// ----------- 8 ----------  Get single user --  Admin  ---------------------- //
// --------------------------------------------------------------------------- //

exports.getSingleUser = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHander(`User doen not exist Id: ${req.params.id}`, 400));
        }
        const balance = Math.round(await currencyConveraterToTHB(1, user.balance));

        const depositData = await userPayment.find({ user_id: user.id, payment_type: "diposit", status: "success", action_status: "approved" });
        const totalDeposit = Math.round(await calculateAmount(depositData));

        const withdrawData = await userPayment.find({ user_id: user.id, payment_type: "withdraw", status: "success", action_status: "approved" });
        const totalwithdraw = Math.round(await calculateAmount(withdrawData));

        res.status(200).json({
            success: true,
            data: { user, balance, totalDeposit, totalwithdraw },
            messaage: "update sucessfully",
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
};



// --------------------------------------------------------------------------- //
// ------ 9 ----- Additional Information  User Profile -- Admin  ------------- //
// --------------------------------------------------------------------------- //

exports.getUserAddtionalInformation = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id);

        const balance = Math.round(await currencyConveraterToTHB(1, user.balance));

        const depositData = await userPayment.find({ user_id: user.id, payment_type: "diposit", status: "success", action_status: "approved" });
        const totalDeposit = Math.round(await calculateAmount(depositData));

        const withdrawData = await userPayment.find({ user_id: user.id, payment_type: "withdraw", status: "success", action_status: "approved" });
        const totalwithdraw = Math.round(await calculateAmount(withdrawData));

        const ticket = await countDocuments.lotteryBuyer.find({ user_id: user.id, })

        res.status(200).json({
            status: true,
            data: { balance, totalDeposit, totalwithdraw, ticket },
            message: 'All user fatch successfully'
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
}



// --------------------------------------------------------------------------- //
// --------- 10 ----------  Update User Profile -- Admin  --------------------- //
// --------------------------------------------------------------------------- //

exports.updateUserData = async (req, res, next) => {

    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            mobile_No: req.body.mobile_No,
        };

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });


        res.status(200).json({
            success: true,
            data: user,
            message: "user data update successfully"
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
}



// --------------------------------------------------------------------------- //
// --------------------------- Delete User -- Admin  -------------------------- //
// --------------------------------------------------------------------------- //

exports.deleteUser = async (req, res, next) => {

    try {
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

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    };
}



// -------------------------------------------  Forgot Password

// exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
//     const user = await User.findOne({ email: req.body.email });

//     if (!user) {
//         return next(new ErrorHander("User not found", 404));
//     }

//     //Get ResetPassword Token
//     const resetToken = user.getResetPasswordToken();

//     await user.save({ validateBeforeSave: false });

//     const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

//     console.log(resetPasswordUrl);

//     const message = `Your password reset token is : - \n\n ${resetPasswordUrl}\n\nIf you have not requested this email then, please ignore it  `

//     try {
//         await sendEmail({
//             email: user.email,
//             subject: `Ecommerce Password Recovery`,
//             message,
//         });
//         res.status(200).json({
//             status: true,
//             message: `Email sent to ${user.email} sucesssfully`,
//         })

//     } catch (error) {
//         user.resetpasswordToken = undefined;
//         user.resetpasswordExpire = undefined;
//         await user.save({ validateBeforeSave: false });

//         return next(new ErrorHander(error.message, 500))

//     }
// });


// reset password

// exports.resetpassword = catchAsyncErrors(async (req, res, next) => {

//     // -----------------------------------  Creating Token Hash
//     const resetpasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
//     const user = await User.findOne({
//         resetpasswordToken,
//         resetpasswordExpire: { $gt: Date.now() },
//     });

//     console.log(user);

//     if (!user) {
//         return next(new ErrorHander("Reset password Token is invalid or has been expired", 400));
//     }

//     if (req.body.password !== req.body.confirmPassword) {
//         return next(new ErrorHander("password does not match", 400));
//     }
//     user.password = req.body.password;
//     user.resetpasswordToken = undefined;
//     user.resetpasswordExpire = undefined;
//     await user.save();
//     sendToken(user, 200, res);

// });




