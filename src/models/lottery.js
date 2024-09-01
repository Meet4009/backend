const mongoose = require("mongoose");
const validator = require("validator");

const lottery = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    name: {
        type: String,
        required: [true, "please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 charecters"],
        unique: true,
    },

    price: {
        type: Number,     // store as THB
        required: [true, "please Enter lottery price"],
    },

    totalDraw: {
        required: [true, "please Enter totalDraw Number"],
        type: Number,
    },

    repeatDraw: {
        type: Number,
        require: true,
        default: 8             //per 8 day lootery shulde be repeat draw
    }
});

module.exports = mongoose.model("lottery", lottery);

