const mongoose = require("mongoose");
// const validator = require("validator");
const faq = new mongoose.Schema({

    topicName: {
        type: String,
        required: [true, "please Enter topic name"],

    },
    question: {
        type: String
    },
    Answer: {
        type: String
    }
});

module.exports = mongoose.model("faq", faq);