const mongoose = require("mongoose");
const lottery_price = new mongoose.Schema({

    priceNumber: {
        type: Number,
        unique: true,
    },
    price: {
        type: Number
    },
    totalPerson: {
        type: Number
    }
});

module.exports = mongoose.model("lotteryPrice", lottery_price);