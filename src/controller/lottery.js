// const Lottery = require("../models/lottery");
// const LotteryDraw = require("../models/lotteryDraw");
// const { nextLotteryDraw } = require("../utils/lotteryAgenda");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");


// exports.setlottery = catchAsyncErrors(async (req, res) => {

//     try {
//         const { name, price, totalDraw } = req.body;

//         const lottery = new Lottery({
//             user_id: req.user.id,
//             name, price, totalDraw
//         });
//         await lottery.save();

//         let startDate = new Date();
//         console.log("startDate", startDate);            // -------------

//         let drawDate = new Date(startDate);
//         drawDate.setMinutes(drawDate.getMinutes() + lottery.repeatDraw);
//         console.log("drawDate", drawDate);             // -------------

//         const lottery_draw = new LotteryDraw({
//             lottery_id: lottery.id,
//             startDate: startDate.toISOString(),
//             drawDate: drawDate.toISOString(),

//         });
//         console.log("lottery_draw", lottery_draw);     // -------------

//         await lottery_draw.save();

//         // let setRenewlottreyDate = drawDate
//         // setRenewlottreyDate.setHours(0)
//         // setRenewlottreyDate.setMinutes(0)
//         // setRenewlottreyDate.setSeconds(1);

//         nextLotteryDraw(drawDate);

//         res.status(200).json({
//             success: true,
//             "lottery": lottery,
//         });
//     } catch (error) {
//         console.log(error);
//     }


// });


const Lottery = require("../models/lottery");
const LotteryDraw = require("../models/lotteryDraw");
const { scheduleLotteryDraw } = require("../utils/lotteryCron");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.setlottery = catchAsyncErrors(async (req, res) => {
    try {
        const { name, price, totalDraw } = req.body;

        const lottery = new Lottery({
            user_id: req.user.id,
            name, price, totalDraw
        });
        await lottery.save();

        let startDate = new Date();
        let drawDate = new Date(startDate);
        drawDate.setDate(drawDate.getDate() + lottery.repeatDraw);

        const lottery_draw = new LotteryDraw({
            lottery_id: lottery.id,
            startDate: startDate.toISOString().split('T')[0],
            drawDate: drawDate.toISOString().split('T')[0],
        });

        await lottery_draw.save();

        scheduleLotteryDraw(drawDate);

        res.status(200).json({
            success: true,
            "lottery": lottery,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
