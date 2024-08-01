
// const LotteryDraw = require("../models/lotteryDraw");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const nextLotteryDraw = require("../utils/lotteryAgenda");
// const ErrorHander = require("../utils/errorhander");

// exports.drawLottery = async () => {
//     try {
//         const lottery = await LotteryDraw.find({ drawDate: new Date().toISOString() }).populate('lottery_id');
//         if (!lottery) {
//             return next(new ErrorHander("The lottery is not drawing at this time.", 400));
//         }

//         let startDate = new Date();

//         let drawDate = new Date(startDate);
//         const repeatDraw = lottery[0].lottery_id.repeatDraw
//         console.log("repeatDraw", repeatDraw);
//         drawDate.setMinutes(drawDate.getMinutes() + repeatDraw);

//         // const newLotteryDraw = new LotteryDraw({
//         //     lottery_id: lottery.id,
//         //     startDate: startDate.toISOString(),
//         //     drawDate: drawDate.toISOString(),
//         // });
//         // await newLotteryDraw.save();

//         new LotteryDraw({
//             lottery_id: lottery.id,
//             startDate: startDate.toISOString(),
//             drawDate: drawDate.toISOString(),
//         });


//         // let setRenewlottreyDate = new Date()
//         // setRenewlottreyDate.setHours(0)
//         // setRenewlottreyDate.setMinutes(0)
//         // setRenewlottreyDate.setSeconds(1);

//         nextLotteryDraw(drawDate);

//     } catch (error) {
//         console.log(error);
//     }

// }

const LotteryDraw = require("../models/lotteryDraw");
const scheduleLotteryDraw  = require("../utils/lotteryCron");
const ErrorHander = require("../utils/errorhander");

exports.drawLottery = async () => {
    try {
        const lottery = await LotteryDraw.find({ drawDate: new Date().toISOString().split('T')[0] }).populate('lottery_id');
        if (!lottery || lottery.length === 0) {
            return next(new ErrorHander("The lottery is not drawing at this time.", 400));
        }

        let startDate = new Date();

        let drawDate = new Date(startDate);
        const x = lottery[0].lottery_id.repeatDraw;
        console.log("x", x);
        drawDate.setMinutes(drawDate.getMinutes() + x);

        const newLotteryDraw = new LotteryDraw({
            lottery_id: lottery[0].lottery_id._id,
            startDate: startDate.toISOString(),
            drawDate: drawDate.toISOString(),
        });

        await newLotteryDraw.save();

        scheduleLotteryDraw(drawDate);

    } catch (error) {
        console.log(error);
    }
};
