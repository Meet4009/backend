const mongoose = require("mongoose");
const lottery_price = new mongoose.Schema({

    priceNumber: {
        type: Number,
        unique: true,
        require: true
    },
    price: {
        type: Number,
        unique: true,
        require: true
    },
    totalPerson: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model("lotteryPrice", lottery_price);