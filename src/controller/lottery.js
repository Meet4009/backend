const Lottery = require("../models/lottery");
const LotteryDraw = require("../models/lotteryDraw");
const {renewLottertyDraw} = require("./lotteryAgenda");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


exports.setlottery = catchAsyncErrors(async (req, res) => {

    const { name, price, totalDraw } = req.body;

    const lottery = new Lottery({
        user_id: req.user.id,
        name, price, totalDraw
    });
    await lottery.save();

    let startDate = new Date();

    let drawDate = new Date(startDate);
    drawDate.setMinutes(drawDate.getMinutes() + lottery.repeatDraw)
    const lottery_draw = new LotteryDraw({
        lottery_id: lottery.id,
        startDate: startDate.toDateString(),
        drawDate: drawDate.toDateString(),

    });



    await lottery_draw.save();

    // let setRenewlottreyDate = drawDate
    // setRenewlottreyDate.setHours(0)
    // setRenewlottreyDate.setMinutes(0)
    // setRenewlottreyDate.setSeconds(1);

    renewLottertyDraw(drawDate)

    res.status(200).json({
        success: true,
        "lottery": lottery,
    });

});

