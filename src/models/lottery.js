const mongoose = require("mongoose");
const validator = require("validator");
const lottery = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    name: {
        type: String
    },
    price: {
        type: Number,
    
    },
    drawDate: {
        type: Date,
        
    },
    totalDraw: {
        type: number,
        
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'done'],
    },
});