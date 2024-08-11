const User = require("../models/userModel");

const {currencyConveraterFormUSD} = require("../utils/currencyConverater");



exports.currency = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        user.currency_code = req.body.currency_code

        await user.save();

        let data = { ...user.toObject(), balance: await currencyConveraterFormUSD(user.currency_code, user.balance) }

        res.status(201).json({
            status: true,
            data: data,
            message: "currency change successfully"
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
}


