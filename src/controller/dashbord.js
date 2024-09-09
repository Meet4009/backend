const User = require("../models/userModel");
const userPayment = require("../models/userPayment");
const LotteryBuyer = require("../models/lotteryBuyer");
const { calculateAmount } = require("../utils/paymentDecision");


// ------------------------------------------------------------- //
// ----------- 30 ----------- Deshbord ------------------------- //
// ------------------------------------------------------------- //

exports.dashboard = async (req, res, next) => {

    try {
        // User Details
        const totalUsers = await User.countDocuments({ role: "user" });
        const activeUsers = await User.countDocuments({ role: "user", loggedIn: true });
        const emailUnverified = null;
        const mobileUnverified = null;

        //  Deposits 

        const depositData = await userPayment.find({ payment_type: "diposit", status: "success", action_status: "approved" });
        const totalDeposits = Math.round(await calculateAmount(depositData));

        const pendingDeposit = await userPayment.countDocuments({ payment_type: "diposit", status: "pending", action_status: "pending" });
        const approvedDeposit = await userPayment.countDocuments({ payment_type: "diposit", status: "success", action_status: "approved" });
        const rejectedDeposit = await userPayment.countDocuments({ payment_type: "diposit", status: "rejected", action_status: "rejected" });


        //  Withdraw 
        const withdrawData = await userPayment.find({ payment_type: "withdraw", status: "success", action_status: "approved" });
        const totalWithdrawals = Math.round(await calculateAmount(withdrawData));

        const pendingWithdraw = await userPayment.countDocuments({ payment_type: "withdraw", status: "pending", action_status: "pending" });
        const approvedWithdrawal = await userPayment.countDocuments({ payment_type: "withdraw", status: "success", action_status: "approved" });
        const rejectedWithdrawal = await userPayment.countDocuments({ payment_type: "withdraw", status: "rejected", action_status: "rejected" });
        const soldTicket = await LotteryBuyer.countDocuments();

        const lotteryBuyers = await LotteryBuyer.find()
        .populate('lottery_id')
        .populate('lottery_price_id');

        let soldAmount = 0;
        let winAmount = 0;

        lotteryBuyers.forEach(currentBuyer => {
     
        if (currentBuyer.lottery_id && currentBuyer.lottery_id.price) {
        soldAmount += currentBuyer.lottery_id.price;
        }

     
        if (currentBuyer.status === 'win' && currentBuyer.lottery_price_id && currentBuyer.lottery_price_id.price) {
        winAmount += currentBuyer.lottery_price_id.price;
        }
        });


        const winner = await LotteryBuyer.countDocuments({ status: 'win' });

        res.status(200).json({
            success: true,

            data: {
                totalUsers,
                activeUsers,
                emailUnverified,
                mobileUnverified,
                soldTicket,
                totalDeposits,
                approvedDeposit,
                rejectedDeposit,
                pendingDeposit,
                totalWithdrawals,
                approvedWithdrawal,
                rejectedWithdrawal,
                pendingWithdraw,
                winner,
                winAmount,
                soldAmount
            },


        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }


};
