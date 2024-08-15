const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");

const User = require("../models/userModel");
const userPayment = require("../models/userPayment");

const jwt = require("jsonwebtoken");
const { paymentApprove, paymentReject } = require("../utils/paymentDecision");
const { currencyConveraterToTHB, currencyConveraterToUSD } = require("../utils/currencyConverater");



// ----------------------------------------------------------//
// ------- 11 --------- deposit request -- User ------------ // 
// ----------------------------------------------------------//

exports.deposit = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    const { amount, UTR } = req.body;

    const payment = await userPayment.create({
        user_id: user.id,
        amount,
        UTR,
        currency_code: user.currency_code,
        payment_type: "diposit"
    })

    await payment.save();

    res.status(200).json({
        status: true,
        data: payment,
        message: 'Deposit request has been sent'
    });
});



// ----------------------------------------------------------//
// ------ 12 ------ Withdraw request -- User --------------- // 
// ----------------------------------------------------------//

exports.withdraw = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    const userBalance = user.balance;

    const { amount, upi_id } = req.body;

    let usdamount = await currencyConveraterToUSD(user.currency_code, amount)

    if (usdamount > userBalance) {
        return next(new ErrorHander(`You don't have ${amount} in your account`, 401));
    }

    const payment = await userPayment.create({
        user_id: user.id,
        amount,
        upi_id,
        payment_type: "withdraw",
        currency_code: user.currency_code,
    })

    await payment.save();

    res.status(200).json({
        status: true,
        data: payment,
        message: 'withdraw request has been sent'
    });

});



// ----------------------------------------------------------//
// ------  13 ----- Deposits History -- User ---------------- // 
// ----------------------------------------------------------//

exports.depositsHistory = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    const History = await userPayment.find({ payment_type: "diposit", user_id: { _id: user.id } });

    res.status(200).json({
        status: true,
        Data: History,
        message: 'The deposit history has been loaded'
    });

});



// ----------------------------------------------------------//
// ------ 14 ------ Withdraw History -- User --------------- // 
// ----------------------------------------------------------//

exports.withdrawHistory = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    const History = await userPayment.find({ payment_type: "withdraw", user_id: { _id: user.id } });

    res.status(200).json({
        status: true,
        Data: History,
        message: 'The withdraw history has been loaded'
    });

});


// ----------------------------------------------------------//
// ----- 15 ------- Deposit History -- admin --------------- // 
// ----------------------------------------------------------//

exports.getDeposits = catchAsyncErrors(async (req, res) => {

    const payment = await userPayment.find({ payment_type: "diposit" }).populate('user_id');

    let data = [];
    for (let currentPayment of payment) {
        const convertedAmount = await currencyConveraterToTHB(currentPayment.currency_code, currentPayment.amount);
        data.push({ ...currentPayment.toObject(), amount: convertedAmount });
    }

    res.status(200).json({
        status: true,
        data: data,
        message: 'All diposite data'
    });

});



// ------------------------------------------------------------------------------------//
// ---- 16 - Pending, ---- 17 - Approve, ---- 18 - Reject Deposit History -- admin --- // 
// ------------------------------------------------------------------------------------//

exports.getRequestDeposits = catchAsyncErrors(async (req, res) => {

    const payment = await userPayment.find({ payment_type: "diposit", action_status: req.params.status }).populate('user_id');
    const request = req.params.status;

    let data = [];
    for (let currentPayment of payment) {
        const convertedAmount = await currencyConveraterToTHB(currentPayment.currency_code, currentPayment.amount);
        data.push({ ...currentPayment.toObject(), amount: convertedAmount });
    }

    res.status(200).json({
        status: true,
        data: data,
        message: `${request} deposite has been loaded`,
    });

});

// ----------------------------------------------------------//
// ----- 19 ------ Approve Deposit -- admin ---------------- // 
// ----------------------------------------------------------//

exports.setApproveDeposit = catchAsyncErrors(async (req, res, next) => {

    const payment = await userPayment.findOne({ payment_type: "diposit", status: "pending", action_status: "pending", _id: req.params.id });

    if (!payment) {
        return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
    }

    paymentApprove(payment, 200, res);

});



// ----------------------------------------------------------//
// ------ 20 ------ Reject Deposit -- admin ---------------- // 
// ----------------------------------------------------------//

exports.setRejectDeposit = catchAsyncErrors(async (req, res, next) => {
    const payment = await userPayment.findOne({ payment_type: "diposit", status: "pending", action_status: "pending", _id: req.params.id });

    if (!payment) {
        return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
    }

    paymentReject(payment, 200, res);

});


// ----------------------------------------------------------//
// ------- 21 ----- Withdraw History -- admin -------------- // 
// ----------------------------------------------------------//

exports.getWithdraws = catchAsyncErrors(async (req, res) => {

    const payment = await userPayment.find({ payment_type: "withdraw" })
        .populate('user_id');

    let data = [];
    for (let currentPayment of payment) {
        const convertedAmount = await currencyConveraterToTHB(currentPayment.currency_code, currentPayment.amount);
        data.push({ ...currentPayment.toObject(), amount: convertedAmount });
    }

    res.status(200).json({
        status: true,
        data: data,
        message: 'All withdraw data'
    });

});



// ------------------------------------------------------------------------------------//
// ---- 22 - Pending, ---- 23 - Approve, ---- 24 - Reject withdraw History -- admin --- // 
// ------------------------------------------------------------------------------------//

exports.getRequestWithdraws = catchAsyncErrors(async (req, res) => {

    const payment = await userPayment.find({ payment_type: "withdraw", action_status: req.params.status })
        .populate('user_id');
    const request = req.params.status;

    let data = [];
    for (let currentPayment of payment) {
        const convertedAmount = await currencyConveraterToTHB(currentPayment.currency_code, currentPayment.amount);
        data.push({ ...currentPayment.toObject(), amount: convertedAmount });
    }

    res.status(200).json({
        status: true,
        data: data,
        message: `${request} withdraw has been loaded`,
    });

});


// ----------------------------------------------------------//
// ----- 25 ------ Approve Withdraw -- admin --------------- // 
// ----------------------------------------------------------//

exports.setApprovewithdraw = catchAsyncErrors(async (req, res, next) => {
    const payment = await userPayment.findOne({ payment_type: "withdraw", status: "pending", action_status: "pending", _id: req.params.id });

    if (!payment) {
        return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
    }

    paymentApprove(payment, 200, res);

});



// ----------------------------------------------------------//
// ------- 26 ---- Reject Withdraw -- admin ---------------- // 
// ----------------------------------------------------------//

exports.setRejectwithdraw = catchAsyncErrors(async (req, res, next) => {
    const payment = await userPayment.findOne({ payment_type: "withdraw", status: "pending", action_status: "pending", _id: req.params.id });

    if (!payment) {
        return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
    }

    paymentReject(payment, 200, res);

});

