const mongoose = require("mongoose");
const validator = require("validator");
const lottery = require("./lottery");
const lotteryBuyer = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    lottery_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lottery'
    },
    lottery_draw_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lottery_draw'
    },

    lottery_price_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lottery_draw'
    },
    ticketNumber: {
        required:true,
        type: Number,
    },
    status: {
        type: String,
        default: "pending",
        enum: ['pending','win', 'loss'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("lottery_buyer", lotteryBuyer);

