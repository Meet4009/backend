const User = require("../models/userModel");
const Lottery = require("../models/lottery");
const LotteryDraw = require("../models/lotteryDraw");
const LotteryBuyer = require("../models/lotteryBuyer");

const { scheduleLotteryDraw } = require("../utils/lotteryCron");
const { helperWinnerSpace } = require("../utils/helpWinnerSpace");
const { generateRandom12DigitNumber } = require("../utils/genarateTicketNumber");
const { currencyConveraterToTHB, currencyConveraterToUSD, currencyConveraterFormTHB } = require("../utils/currencyConverater");



// ----------------------------------------------------------//
// ---- 31 ---------- Create new lottery by admin ---------- // 
// ----------------------------------------------------------//

exports.setlottery = async (req, res) => {
    try {
        const { name, price, totalDraw } = req.body;

        const lottery = new Lottery({
            user_id: req.user.id,
            name, price, totalDraw
        });

        await lottery.save();

        let startDate = new Date();
        let drawDate = new Date();
        drawDate.setDate(drawDate.getDate() + lottery.repeatDraw);
        // drawDate.setMinutes(drawDate.getMinutes() + lottery.repeatDraw);

        const lottery_draw = new LotteryDraw({
            lottery_id: lottery.id,
            startDate: startDate.toISOString().split('T')[0],
            drawDate: drawDate.toISOString().split('T')[0],
        });

        await lottery_draw.save();

        drawDate.setHours(0)
        drawDate.setMinutes(0)
        scheduleLotteryDraw(drawDate);

        res.status(200).json({
            status: true,
            data: lottery,
            message: 'Lottery create Successfully'
        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};


// ----------------------------------------------------------//
// ------ 32 -------- Get All lottery -- admin ------------- // 
// ----------------------------------------------------------//

exports.getLotterys = async (req, res) => {
    try {

        const lottery = await Lottery.find();

        if (!lottery) {
            return res.status(404).json({
                status: false,
                data: {},
                message: "Lottery not found"
            });
        }

        let lotteryData = await Promise.all(
            lottery.map(async (currentLottery) => {
                let activeLotteryDraw = await LotteryDraw.findOne({ lottery_id: currentLottery.id, status: 'active' });
                console.log(activeLotteryDraw);
                return { ...currentLottery.toObject(), activeLotteryDraw };
            })
        )

        res.status(200).json({
            status: true,
            data: lotteryData,
            message: 'All Lottery get Successfully'
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};

// ----------------------------------------------------------//
// ------ 33 -------- Get All lottery -- user -------------- // 
// ----------------------------------------------------------//

exports.getAllLotterys = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const lottery = await Lottery.find();

        if (!lottery) {
            return res.status(404).json({
                status: false,
                data: {},
                message: "Lottery not found"
            });
        }


        let lotteryData = await Promise.all(
            lottery.map(async (currentLottery) => {
                let price = await currencyConveraterFormTHB(user.currency_code, currentLottery.price);

                let prevLotteryDraw = await LotteryDraw.find({
                    lottery_id: currentLottery.id, 
                    status: 'done'
                }).sort({ createdAt: -1 });
                

                // let activeLotteryDraw = await LotteryDraw.findOne({ lottery_id: currentLottery.id, status: 'active' });

                // let activeLottryStartDate = new Date(activeLotteryDraw.startDate)

                // let prevLottryDrawDate = new Date(activeLottryStartDate.setDate(activeLottryStartDate.getDate() - 1))

                // let prevLotteryDraw = await LotteryDraw.findOne({ drawDate: prevLottryDrawDate.toISOString().split('T')[0] });

                // let prevLotteryDraw = await LotteryDraw.findOne({ lottery_id: currentLottery.id, status: 'active' });

                let winnerperson = {}
                if (prevLotteryDraw[0]) {
                    winnerperson = await LotteryBuyer.find({ lottery_draw_id: prevLotteryDraw[0].id, status: 'win' }).populate('user_id').populate('lottery_price_id')
                }


                return { ...currentLottery.toObject(), lottery_draw: prevLotteryDraw[0] || {}, winner: winnerperson, price };
            })
        );


        // let date = activeLotteryDraw.startDate
        // let lotteryDraw = await LotteryDraw.find();

        res.status(200).json({
            status: true,
            data: lotteryData,
            message: 'All Lottery get Successfully'
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};



// ----------------------------------------------------------------------//
// -------- 34 --------- Get Lottery details ---  User ----------------- // 
// ----------------------------------------------------------------------//

exports.getLotteryDetails = async (req, res, next) => {

    try {
        const lottery = await Lottery.findById(req.params.id);

        if (!lottery) {
            return res.status(404).json({
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
            return res.status(404).json({
                status: false,
                data: {},
                message: "Lottery not found"
            });
        }

        let lotteryObj = {
            winning_price: 0,                   // Assuming you will calculate this value elsewhere
            total_draw: lottery.totalDraw,
            price: lottery.price,
            draw_date: lotteryDrawObj[0].drawDate
        };

        res.status(200).json({
            status: true,
            data: lotteryObj,
            message: "Lottery found successfully"
        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};


// --------------------------------------------------------------//
// ----- 35 ------- Genarate Lottery Ticket -- User ------------ // 
// --------------------------------------------------------------//

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

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};

// ---------------------------------------------------------------//
// -------- 36 ---------- Buy Lottery ---  User ----------------- // 
// ---------------------------------------------------------------//

// exports.buylottery = async (req, res, next) => {
//     try {

//         const { ticket_number, lottery_id } = req.body;

//         if (!Array.isArray(ticket_number) || ticket_number == null) {
//             return res.status(400).json({
//                 status: false,
//                 data: {},
//                 message: "pleace provide ticket number in array format"
//             });
//         }

//         const lottery = await Lottery.findById(lottery_id);

//         if (!lottery) {

//             return res.status(404).json({
//                 status: false,
//                 data: {},
//                 message: "Lottery not found"
//             });
//         }

//         let getUser = await User.findById(req.user.id)

//         let userBlance = await currencyConveraterToTHB(1, getUser.balance);

//         if (!(userBlance >= (lottery.price * ticket_number.length))) {
//             return res.status(400).json({
//                 status: false,
//                 data: {},
//                 message: "Insufficient Balance"
//             });
//         }

//         let lotteryDrawArr = await LotteryDraw.find({ lottery_id: lottery.id, status: "active" });

//         // let lotteryDrawObj = lotteryDrawArr.filter(curr => {


//         //     let currentDate = new Date();

//         //     let startDate = new Date(curr.startDate);
//         //     let drawDate = new Date(new Date(curr.drawDate).setMinutes(startDate.getMinutes() + 1))
//         //     console.log("startDate", startDate.toLocaleString());
//         //     console.log("drawDate", drawDate.toLocaleString());

//         //     console.log("currentDate", currentDate.toLocaleString());

//         //     return startDate <= currentDate && drawDate >= currentDate;
//         // });

//         if (lotteryDrawArr.length === 0) {
//             return res.status(404).json({
//                 status: false,
//                 data: {},
//                 message: "Lottery not found."
//             });
//         }

//         ticket_number.map(async (curr) => {
//             const ticket = new LotteryBuyer({

//                 user_id: getUser.id,
//                 lottery_id: lottery.id,
//                 lottery_draw_id: lotteryDrawArr[0].id,
//                 ticketNumber: curr,
//             });

//             await ticket.save();

//         })
//         getUser.balance -= await currencyConveraterToUSD(764, lottery.price * ticket_number.length)

//         await getUser.save();

//         res.status(200).json({
//             status: true,
//             data: {},
//             message: `You have successfully purchased ${ticket_number.length} Tickets`
//         });
//     } catch (error) {

//         res.status(500).json({
//             status: false,
//             message: `Internal Server Error -- ${error}`
//         });
//     }
// };


// ---------------------------------------------------------------//
// -------- 36 ---------- Buy Lottery ---  User ----------------- // 
// ---------------------------------------------------------------//
exports.buylottery = async (req, res, next) => {
    try {
        const { ticket_number, lottery_id } = req.body;

        // Validate ticket_number is an array
        if (!Array.isArray(ticket_number) || ticket_number.length === 0) {
            return res.status(400).json({
                status: false,
                data: {},
                message: "Please provide ticket number(s) in array format"
            });
        }

        // Fetch the lottery information
        const lottery = await Lottery.findById(lottery_id);
        if (!lottery) {
            return res.status(404).json({
                status: false,
                data: {},
                message: "Lottery not found"
            });
        }

        // Fetch user information and balance
        const user = await User.findById(req.user.id);
        const userBalanceTHB = await currencyConveraterToTHB(1, user.balance);

        // Check if the user has enough balance for all tickets
        const totalCost = lottery.price * ticket_number.length;
        if (userBalanceTHB < totalCost) {
            return res.status(400).json({
                status: false,
                data: {},
                message: "Insufficient balance"
            });
        }

        // Find active lottery draw
        const activeLotteryDraw = await LotteryDraw.findOne({ lottery_id: lottery.id, status: "active" });
        if (!activeLotteryDraw) {
            return res.status(404).json({
                status: false,
                data: {},
                message: "Active lottery draw not found"
            });
        }

        // Save each ticket purchase
        const tickets = ticket_number.map(curr => ({
            user_id: user.id,
            lottery_id: lottery.id,
            lottery_draw_id: activeLotteryDraw.id,
            ticketNumber: curr
        }));
        await LotteryBuyer.insertMany(tickets);

        // Deduct balance and save user
        user.balance -= await currencyConveraterToUSD(764, totalCost);
        await user.save();

        // Return success response
        res.status(200).json({
            status: true,
            data: {},
            message: `You have successfully purchased ${ticket_number.length} ticket(s)`
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
};


// ---------------------------------------------------------------//
// -------- 37 ----- pending Lottery Ticket -- User ------------- // 
// ---------------------------------------------------------------//

exports.pendingTickets = async (req, res, next) => {
    try {
        const pendingTicket = await LotteryBuyer.find({ user_id: req.user.id, status: 'pending' }).populate('lottery_id').sort('createdAt');

        res.status(200).json({
            status: true,
            data: pendingTicket,
            message: "Ticket number fetch successfully"
        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
}


// --------------------------------------------------------------//
// ----- -38 ------  Lottery Ticket History -- User ------------ // 
// --------------------------------------------------------------//

exports.ticketHistory = async (req, res, next) => {
    try {
        const allTicket = await LotteryBuyer.find({ user_id: req.user.id, status: { $ne: 'pending' } }).populate('lottery_id').populate({
            path: 'lottery_draw_id',
            match: { status: { $ne: 'active' } }
        }).sort('createdAt');

        res.status(200).json({
            status: true,
            data: allTicket,
            message: "Ticket fetch successfully"
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
}


// -------------------------------------------------------------//
// --------39 --------  choose Winner -- Admin ---------------- // 
// -------------------------------------------------------------//

exports.getAllPendingTickets = async (req, res, next) => {
    try {
        const allTicket = await LotteryBuyer.find({ adminStatus: 'pending' }).populate('user_id').populate('lottery_id').sort('createdAt');

        res.status(200).json({
            status: true,
            data: allTicket,
            message: "Pending tickets fetched successfully"
        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};



// ------------------------------------------------------------//
// -------40----------  loss buyer --- Admin ----------------- // 
// ------------------------------------------------------------//

exports.lossbuyer = async (req, res, next) => {
    try {
        const ticket = await LotteryBuyer.findById(req.params.id);

        // ticket.status = 'loss'
        ticket.adminStatus = 'loss'

        await ticket.save();
        res.status(200).json({
            status: true,
            data: {},
            message: "Ticket status change successfully"
        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};


// --------------------------------------------------------------//
// ------- 41 -----------  win buyer -- Admin ------------------ // 
// --------------------------------------------------------------//

exports.winbuyer = async (req, res, next) => {
    try {
        const ticket = await LotteryBuyer.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                status: false,
                message: "Ticket not found"
            });
        }

        const spaces = await helperWinnerSpace(ticket.lottery_draw_id);

        const priceObj = spaces.find(currentObj => currentObj._id == req.body.lottery_price_id);

        if (!priceObj) {
            return res.status(400).json({
                status: false,
                message: "Invalid lottery price ID"
            });
        }

        if (priceObj.fill_space < priceObj.totalPerson) {
            // ticket.status = 'win';
            ticket.adminStatus = 'win';
            ticket.lottery_price_id = req.body.lottery_price_id;
            await ticket.save();

            return res.status(200).json({
                status: true,
                data: {},
                message: "Ticket status changed successfully"
            });
        } else {
            return res.status(400).json({
                status: false,
                data: {},
                message: "Prize slot not available"
            });
        }
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};



// --------------------------------------------------------------//
// ------- 42 ----------- get winner -- Admin ------------------ // 
// --------------------------------------------------------------//

exports.getWinnerSpace = async (req, res, next) => {
    try {
        const spaces = await helperWinnerSpace(req.params.id);

        res.status(200).json({
            status: true,
            data: spaces,
            message: "Ticket status fetched successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
};

// ---------------------------------------------------------------------------//
// ------- 43 -----------  single user all tickets -- Admin ----------------- // 
// ---------------------------------------------------------------------------//

exports.useralltickets = async (req, res, next) => {
    try {


        let allTicket = await LotteryBuyer.find({ user_id: req.params.id }).populate('lottery_id').populate('lottery_price_id');

        res.status(200).json({
            status: true,
            data: allTicket,
            message: "Ticket fetched successfully"
        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
}

// --------------------------------------------------------------//
// ------- 46 -----------  all winners -- Admin ------------------ //
// --------------------------------------------------------------//

exports.allWinners = async (req, res, next) => {
    try {
        let winner = await LotteryBuyer.find({ adminStatus: "win" }).populate('lottery_price_id').populate('user_id').populate('lottery_id').populate('lottery_draw_id');

        let winners = winner.sort((a, b) => a.lottery_price_id.priceNumber - b.lottery_price_id.priceNumber);

        res.status(200).json({
            status: true,
            data: winner,
            message: "Ticket fetched successfully"
        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
}








