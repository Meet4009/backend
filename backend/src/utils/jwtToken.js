const { currencyConveraterFormUSD } = require("./currencyConverater");

const sendToken = async (user, statusCode, res) => {


    const token = user.getJWTToken();

    const options = {
     
        httpOnly: true,
    };
    let userDetails = { ...user.toObject(), balance : await currencyConveraterFormUSD(user.currency_code, user.balance) }

    res.status(statusCode).cookie('token', token, options).json({
        status: true,
        data: userDetails,
        "token": token,
    });
};


module.exports = sendToken;                                                                              // controllers/userController.js