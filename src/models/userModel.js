const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 charecters"],
        minLength: [4, "name should ave more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "please Enter a valid Email"],
    },
    balance: {
        type: Number,
        default: 0,
    },

    role: {
        type: String,
        default: "user",
    },

    loggedIn: {
        type: Boolean,
        default: false,
    },

    mobile_No: {
        type: Number,
        unique: true,
        required: [true, "please Enter Your mobile number"],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'],
    },

    country: {
        type: String,
        required: [true, "please select Your country"],
        enum: ['Cambodia', 'Japan', 'Malaysia', 'Vietnam', 'Singapore', 'Indonesia', 'Hong Kong', 'Thailand', 'India'],
    },

    password: {
        type: String,
        required: [true, "please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 character"],
        select: false,
    },

    language: {
        type: String,
        required: [true, "please Enter Your language"],
        enum: ['english', 'thai', 'russian', 'chinese', ],
        default: 'english',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },


    resetpasswordToken: String,
    resetpasswordExpire: Date,

});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);

});
1

// Jwt Token

userSchema.methods.getJWTToken = function () {
    return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
}

//compare password 

userSchema.methods.comparePassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password);
}

// GEnerationg Password Reset Token

userSchema.methods.getResetPasswordToken = function () {

    // Generating Token 

    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetpasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetpasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;

};


module.exports = mongoose.model("User", userSchema);

