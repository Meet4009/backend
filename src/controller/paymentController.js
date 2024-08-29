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

exports.deposit = async (req, res, next) => {
    try {
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
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};



// ----------------------------------------------------------//
// ------ 12 ------ Withdraw request -- User --------------- // 
// ----------------------------------------------------------//

exports.withdraw = async (req, res, next) => {
    try {
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
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};



// ----------------------------------------------------------//
// ------  13 ----- Deposits History -- User ---------------- // 
// ----------------------------------------------------------//

exports.depositsHistory = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        const History = await userPayment.find({ payment_type: "diposit", user_id: { _id: user.id } });

        res.status(200).json({
            status: true,
            Data: History,
            message: 'The deposit history has been loaded'
        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }

};



// ----------------------------------------------------------//
// ------ 14 ------ Withdraw History -- User --------------- // 
// ----------------------------------------------------------//

exports.withdrawHistory = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        const History = await userPayment.find({ payment_type: "withdraw", user_id: { _id: user.id } });

        res.status(200).json({
            status: true,
            Data: History,
            message: 'The withdraw history has been loaded'
        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }

};


// ----------------------------------------------------------//
// ----- 15 ------- Deposit History -- admin --------------- // 
// ----------------------------------------------------------//

exports.getDeposits = async (req, res) => {
    try {
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
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }

};



// ------------------------------------------------------------------------------------//
// ---- 16 - Pending, ---- 17 - Approve, ---- 18 - Reject Deposit History -- admin --- // 
// ------------------------------------------------------------------------------------//

exports.getRequestDeposits = async (req, res) => {
    try {
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
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }

};

// ----------------------------------------------------------//
// ----- 19 ------ Approve Deposit -- admin ---------------- // 
// ----------------------------------------------------------//

exports.setApproveDeposit = async (req, res, next) => {
    try {
        const payment = await userPayment.findOne({ payment_type: "diposit", status: "pending", action_status: "pending", _id: req.params.id });

        if (!payment) {
            return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
        }

        paymentApprove(payment, 200, res);
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }

};



// ----------------------------------------------------------//
// ------ 20 ------ Reject Deposit -- admin ---------------- // 
// ----------------------------------------------------------//

exports.setRejectDeposit = async (req, res, next) => {
    try {
        const payment = await userPayment.findOne({ payment_type: "diposit", status: "pending", action_status: "pending", _id: req.params.id });

        if (!payment) {
            return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
        }

        paymentReject(payment, 200, res);
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }

};


// ----------------------------------------------------------//
// ------- 21 ----- Withdraw History -- admin -------------- // 
// ----------------------------------------------------------//

exports.getWithdraws = async (req, res) => {
    try {
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
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};



// ------------------------------------------------------------------------------------//
// ---- 22 - Pending, ---- 23 - Approve, ---- 24 - Reject withdraw History -- admin --- // 
// ------------------------------------------------------------------------------------//

exports.getRequestWithdraws = async (req, res) => {
    try {
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
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};


// ----------------------------------------------------------//
// ----- 25 ------ Approve Withdraw -- admin --------------- // 
// ----------------------------------------------------------//

exports.setApprovewithdraw = async (req, res, next) => {
    try {
        const payment = await userPayment.findOne({ payment_type: "withdraw", status: "pending", action_status: "pending", _id: req.params.id });

        if (!payment) {
            return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
        }

        paymentApprove(payment, 200, res);
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};



// ----------------------------------------------------------//
// ------- 26 ---- Reject Withdraw -- admin ---------------- // 
// ----------------------------------------------------------//

exports.setRejectwithdraw = async (req, res, next) => {
    try {
        const payment = await userPayment.findOne({ payment_type: "withdraw", status: "pending", action_status: "pending", _id: req.params.id });

        if (!payment) {
            return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
        }

        paymentReject(payment, 200, res);
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }

};





// ----------------------------------------------------------//
// ------  44 -----User Deposits History -- Admin ---------------- // 
// ----------------------------------------------------------//

exports.userDepositsHistory = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        const History = await userPayment.find({ payment_type: "diposit", user_id: { _id: user.id } });

        res.status(200).json({
            status: true,
            Data: History,
            message: 'The deposit history has been loaded'
        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }

};



// ----------------------------------------------------------//
// ------ 45 ------User Withdraw History -- User --------------- // 
// ----------------------------------------------------------//

exports.userWithdrawHistory = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        const History = await userPayment.find({ payment_type: "withdraw", user_id: { _id: user.id } });

        res.status(200).json({
            status: true,
            Data: History,
            message: 'The withdraw history has been loaded'
        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }

};



