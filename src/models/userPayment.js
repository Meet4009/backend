const mongoose = require("mongoose");
const validator = require("validator");

const userPayment = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    amount: {
        required: [true, "please Enter amount"],
        type: Number
    },
    UTR: {
        type: Number,
        default: null
    },
    upi_id: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: "pending",
        enum: ['pending', 'success', 'rejected'],
    },
    payment_type: {
        type: String,
        enum: ['withdraw', 'diposit', 'ticket'],
    },
    action_status: {
        type: String,
        default: "pending",
        enum: ['approved', 'rejected', 'pending'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});
module.exports = mongoose.model("userpayment", userPayment);