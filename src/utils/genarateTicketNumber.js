const LotteryBuyer = require("../models/lotteryBuyer");

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

module.exports = { generateRandom12DigitNumber }