const LotteryPrice = require("../models/lotteryPrice");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.setlotteryPrice = catchAsyncErrors(async (req, res) => {

    const { priceNumber, price, totalPerson } = req.body;

    const lottery_price = new LotteryPrice({
        priceNumber, price, totalPerson
    });

    await lottery_price.save();

    res.status(200).json({
        success: true,
        "price": lottery_price,
    });

});


