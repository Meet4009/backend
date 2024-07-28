const mongoose = require("mongoose");
const validator = require("validator");
const lottery = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    name: {
        type: String
    },
    price: {
        type: Number,

    },
    totalDraw: {
        type: Number,
    },
    repeatDraw: {
        type: Number,
        default: 1             //per 8 day lootery shulde be repeat draw
    }
});

module.exports = mongoose.model("lottery", lottery);

