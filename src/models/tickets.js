const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const validator = require("validator");
const ticket = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    name: {
        type: String
    },
    buyDate: {
        type: Date,

    },
    drawDate: {
        type: Date,

    },
    price: {
        type: Number,
    },
    lotteryNo: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'success'],
    },
    actionStatus: {
        type: String,
        enum: ['win', 'loss', 'pending'],
    },
    ticketNo: {
        type: Number,
    },

});