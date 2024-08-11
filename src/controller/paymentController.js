const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");

const User = require("../models/userModel");
const userPayment = require("../models/userPayment");

const jwt = require("jsonwebtoken");
const { paymentApprove, paymentReject } = require("../utils/paymentDecision");
const { currencyConveraterToTHB } = require("../utils/currencyConverater");



// ----------------------------------------------------------//
// ---------------- deposit request -- User ---------------- // 
// ----------------------------------------------------------//

exports.deposit = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHander("pleses login to access this resource", 401))
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodeData.id);

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
// ---------------- Withdraw request -- User --------------- // 
// ----------------------------------------------------------//

exports.withdraw = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHander("pleses login to access this resource", 401));
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodeData.id);

    const userBalance = user.balance;

    const { amount, upi_id } = req.body;

    if (amount > userBalance) {
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
// --------------- Deposits History -- User ---------------- // 
// ----------------------------------------------------------//

exports.depositsHistory = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHander("pleses login to access this resource", 401));
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodeData.id);

    const History = await userPayment.find({ payment_type: "diposit", user_id: { _id: user.id } });

    res.status(200).json({
        status: true,
        Data: History,
        message: 'The deposit history has been loaded'
    });

});



// ----------------------------------------------------------//
// ---------------- Withdraw History -- User --------------- // 
// ----------------------------------------------------------//

exports.withdrawHistory = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHander("pleses login to access this resource", 401));
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodeData.id);

    const History = await userPayment.find({ payment_type: "withdraw", user_id: { _id: user.id } });

    res.status(200).json({
        status: true,
        Data: History,
        message: 'The deposit withdraw has been loaded'
    });

});



// ----------------------------------------------------------//
// ---------------- Deposit History -- admin --------------- // 
// ----------------------------------------------------------//

exports.getDeposits = catchAsyncErrors(async (req, res) => {

    const payment = await userPayment.find({ payment_type: "diposit" })
        .populate('user_id');

    let data = [];
    for (let currentPayment of payment) {
        const convertedAmount = await currencyConveraterToTHB(currentPayment.currency_code, currentPayment.amount);
        data.push({ ...currentPayment.toObject(), amount: convertedAmount });
    }

    res.status(200).json({
        status: true,
        data: data,
        message: 'diposit data '
    });

});



// ----------------------------------------------------------//
// --- Pending, Approve, Reject Deposit History -- admin --- // 
// ----------------------------------------------------------//

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
// ---------------- Withdraw History -- admin -------------- // 
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
        message: 'Withdraw data '
    });

});



// -----------------------------------------------------------//
// --- Pending, Approve, Reject withdraw History -- admin --- // 
// -----------------------------------------------------------//

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
// --------------- Approve Deposit -- admin ---------------- // 
// ----------------------------------------------------------//

exports.setApproveDeposit = catchAsyncErrors(async (req, res, next) => {

    const payment = await userPayment.findOne({ payment_type: "diposit", status: "pending", action_status: "pending", _id: req.params.id });

    if (!payment) {
        return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
    }

    paymentApprove(payment, 200, res);

});



// ----------------------------------------------------------//
// ---------------- Reject Deposit -- admin ---------------- // 
// ----------------------------------------------------------//

exports.setRejectDeposit = catchAsyncErrors(async (req, res, next) => {
    const payment = await userPayment.findOne({ payment_type: "diposit", status: "pending", action_status: "pending", _id: req.params.id });

    if (!payment) {
        return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
    }

    paymentReject(payment, 200, res);

});



// ----------------------------------------------------------//
// --------------- Approve Withdraw -- admin --------------- // 
// ----------------------------------------------------------//

exports.setApprovewithdraw = catchAsyncErrors(async (req, res, next) => {
    const payment = await userPayment.findOne({ payment_type: "withdraw", status: "pending", action_status: "pending", _id: req.params.id });

    if (!payment) {
        return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
    }

    paymentApprove(payment, 200, res);

});



// ----------------------------------------------------------//
// --------------- Reject Withdraw -- admin ---------------- // 
// ----------------------------------------------------------//

exports.setRejectwithdraw = catchAsyncErrors(async (req, res, next) => {
    const payment = await userPayment.findOne({ payment_type: "withdraw", status: "pending", action_status: "pending", _id: req.params.id });

    if (!payment) {
        return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
    }

    paymentReject(payment, 200, res);

});

