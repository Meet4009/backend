const LotteryBuyer = require("../models/lotteryBuyer");
const lotteryPrice = require("../models/lotteryPrice");

const helperWinnerSpace = async (id) => {

    try {

        // Find winning tickets for the given lottery draw ID
        const winningTickets = await LotteryBuyer.find({
            lottery_draw_id: id,
            status: 'win'
        }).lean();

        // Get all lottery prices
        const prices = await lotteryPrice.find().sort({priceNumber : 1}).lean();

        // Count occurrences of each lottery_price_id in winning tickets
        const ticketCounts = winningTickets.reduce((acc, ticket) => {
            const priceId = ticket.lottery_price_id;
            acc[priceId] = (acc[priceId] || 0) + 1;
            return acc;
        }, {});

        // Map over the prices and attach the count of winning tickets for each price
        const spaces = prices.map(price => ({
            ...price,
            fill_space: ticketCounts[price._id.toString()] || 0
        }));


        return spaces

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
}

module.exports = { helperWinnerSpace }
