const Lottery = require("../models/lottery");
const LotteryDraw = require("../models/lotteryDraw");
const User = require("../models/userModel");
const { scheduleLotteryDraw } = require("../utils/lotteryCron");
const ErrorHander = require("../utils/errorhander");
const LotteryBuyer = require("../models/lotteryBuyer");

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const lottery = require("../models/lottery");

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
            data: lottery,
            message: 'Lottery creatw Successfully'
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: `Internal Server Error -- ${error}`
        });
    }
});

exports.getLottery = async (req, res, next) => {
    try {
        const lottery = await Lottery.findById(req.params.id);

        if (!lottery) {
            return res.status(200).json({
                status: false,
                data: {},
                message: "Lottery not found"
            });
        }

        let lotteryDrawArr = await LotteryDraw.find({ lottery_id: lottery.id });

        let lotteryDrawObj = lotteryDrawArr.filter(curr => {
            let startDate = new Date(curr.startDate);
            let drawDate = new Date(curr.drawDate);
            console.log(drawDate);

            let currentDate = new Date();

            return startDate <= currentDate && drawDate >= currentDate;
        });

        if (lotteryDrawObj.length === 0) {
            return res.status(200).json({
                status: false,
                data: {},
                message: "Lottery not found"
            });
        }

        let lotteryObj = {
            winning_price: 0, // Assuming you will calculate this value elsewhere
            total_draw: lottery.totalDraw,
            price: lottery.price,
            draw_date: lotteryDrawObj[0].drawDate
        };

        res.status(200).json({
            status: true,
            data: lotteryObj,
            message: "Lottery found successfully "
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};


exports.buylottery = async (req, res, next) => {
    try {

        const { ticket_number, lottery_id } = req.body;

        if (!Array.isArray(ticket_number)) {
            return res.status(200).json({
                status: false,
                data: {},
                message: "pleace provide ticket number in array format"
            });
        }

        const lottery = await Lottery.findById(lottery_id);

        if (!lottery) {

            return res.status(200).json({
                status: false,
                data: {},
                message: "Lottery not found"
            });
        }

        let getUser = await User.findById(req.user.id)
        if (!(getUser.balance >= (lottery.price * ticket_number.length))) {
            return res.status(200).json({
                status: false,
                data: {},
                message: "Insufficient Balance"
            });
        }

        let lotteryDrawArr = await LotteryDraw.find({ lottery_id: lottery.id });

        let lotteryDrawObj = lotteryDrawArr.filter(curr => {
            let startDate = new Date(curr.startDate);
            let drawDate = new Date(curr.drawDate);
            console.log(drawDate);

            let currentDate = new Date();

            return startDate <= currentDate && drawDate >= currentDate;
        });

        if (lotteryDrawObj.length === 0) {
            return res.status(200).json({
                status: false,
                data: {},
                message: "Lottery not found"
            });
        }

        ticket_number.map(async (curr) => {
            const ticket = new LotteryBuyer({

                user_id: getUser.id,
                lottery_id: lottery.id,
                lottery_draw_id: lotteryDrawObj[0].id,
                ticketNumber: curr,
            });

            await ticket.save();
        })

        res.status(200).json({
            status: true,
            data: {},
            message: `You have successfully purchased ${ticket_number.length} Tickets`
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};

async function generateRandom12DigitNumber() {
    let number = '';
    for (let i = 0; i < 12; i++) {
        number += Math.floor(Math.random() * 10);
    }

    const ticketBuyer = await LotteryBuyer.find({ ticketNumber: number })

    if (ticketBuyer.length != 0) {
        number = generateRandom12DigitNumber()
    }

    return number;
}


exports.genarateTicketNumber = async (req, res, next) => {
    try {

        let ticket_number = await generateRandom12DigitNumber();
        console.log(ticket_number);

        res.status(200).json({
            status: true,
            data: ticket_number,
            message: "Ticket number fetch successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};

