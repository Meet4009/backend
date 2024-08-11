const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHander = require("./errorhander");
const { currencyConveraterToUSD } = require("../utils/currencyConverater");


// -----------------------------------------------//
// --------------- payment Approve -------------- // 
// -----------------------------------------------//

const paymentApprove = catchAsyncErrors(async (payment, statusCode, res) => {

    const amount = await currencyConveraterToUSD(payment.currency_code, payment.amount);
    console.log(amount);
    

    const userid = payment.user_id;

    const user = await User.findById(userid);
    if (!user) {
        return new ErrorHander(`user doen not exist Id: ${userid}`, 400);
    }
    const userBalance = user.balance;

    // --------------- diposit Approve --------------- //
    if ('diposit' == payment.payment_type) {
        const newBalance = userBalance + amount

        user.balance = newBalance;

        await user.save();

        payment.status = 'success';
        payment.action_status = 'approved';

        await payment.save();

        return res.status(statusCode).json({
            status: true,
            data: { payment, user },
            messaage: "Diposit sucessfully",
        });
    }

    // --------------- withdraw Approve --------------- //
    if ('withdraw' == payment.payment_type) {

        const newBalance = userBalance - amount;

        user.balance = newBalance;

        await user.save();

        payment.status = 'success';
        payment.action_status = 'approved';

        await payment.save();

        return res.status(statusCode).json({
            status: true,
            data: { payment, user },
            messaage: "Withdraw sucessfully",
        });
    }
})


// -----------------------------------------------//
// --------------- payment Approve -------------- // 
// -----------------------------------------------//

const paymentReject = catchAsyncErrors(async (payment, statusCode, res) => {

    const userid = payment.user_id;

    const user = await User.findById(userid);
    if (!user) {
        return next(new ErrorHander(`user doen not exist Id: ${userid}`, 400));
    }

    // --------------- diposit Approve --------------- //
    if ('diposit' == payment.payment_type) {

        payment.status = 'rejected';
        payment.action_status = 'rejected';

        await payment.save();

        return res.status(statusCode).json({
            status: true,
            data: { payment, user },
            messaage: "diposit rejected sucessfully"
        });
    }

    // --------------- withdraw Approve --------------- //
    if ('withdraw' == payment.payment_type) {

        payment.status = 'rejected';
        payment.action_status = 'rejected';

        await payment.save();

        return res.status(statusCode).json({
            status: true,
            data: {payment,user},
            messaage: "withdraw rejected sucessfully"
        });
    }
});


// -----------------------------------------------------//
// --------------- Total Deposite Amount -------------- // 
// -----------------------------------------------------//
function calculateAmount(dipositeData) {
    return dipositeData.reduce((total, dipositeData) => total + (dipositeData.amount || 0), 0);

};

module.exports = { calculateAmount, paymentReject, paymentApprove };
