const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");

const User = require("../models/userModel");
const userPayment = require("../models/userPayment");
const calculateAmount = require("../utils/paymentDecision");




// ------------------------------------------------ Deshbord

exports.dashboard = catchAsyncErrors(async (req, res, next) => {

    const totalUsers = await User.countDocuments({ role: "user" });

    // const activeUser = await User.countDocuments({ role: "user", loggedIn: true });

    // Diposit
    const depositData = await userPayment.find({ payment_type: "diposit", status: "success", action_status: "approved" });
    const totalDeposit = await calculateAmount(depositData);

    // const pendingDeposit = await userPayment.countDocuments({ payment_type: "diposit", status: "pending", action_status: "pending" });
    const rejectDeposit = await userPayment.countDocuments({ payment_type: "diposit", status: "rejected", action_status: "rejected" });

    const withdrawData = await userPayment.find({ payment_type: "withdraw", status: "success", action_status: "approved" });
    const totalwithdraw = await calculateAmount(withdrawData);
    
    const pendingWithdraw = await userPayment.countDocuments({ payment_type: "withdraw", status: "pending", action_status: "pending" });
    const rejectWithdraw = await userPayment.countDocuments({ payment_type: "withdraw", status: "rejected", action_status: "rejected" });
    const approveWithdraw = await userPayment.countDocuments({ payment_type: "withdraw", status: "rejected", action_status: "rejected" });
    const approveDiposit = await userPayment.countDocuments({ payment_type: "diposit", status: "success", action_status: "approved" });


    res.status(200).json({
        success: true,
        "totalUsers": totalUsers,
        // "activeUser": activeUser,
        "totalDeposit": totalDeposit,

        "totalwithdraw": totalwithdraw,
        // "pendingDeposit":pendingDeposit,
        "pendingWithdraw": pendingWithdraw,
        "rejectWithdraw": rejectWithdraw,
        "rejectDeposit": rejectDeposit,
        "approveWithdraw": approveWithdraw,
        "approveDiposit": approveDiposit

    });
});
