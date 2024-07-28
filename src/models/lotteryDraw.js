const mongoose = require("mongoose");
const validator = require("validator");
const lotteryDraw = new mongoose.Schema({
    lottery_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'lottery'
    },
    startDate: {
        type: String
    },
    drawDate: {
        type: String,
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'done'],
    },
});

module.exports = mongoose.model("lottery_draw", lotteryDraw);