const LotteryPrice = require("../models/lotteryPrice");

exports.setlotteryPrice = async (req, res) => {
    try {
        const { priceNumber, price, totalPerson } = req.body;

        const lottery_price = new LotteryPrice({
            priceNumber, price, totalPerson
        });

        await lottery_price.save();

        res.status(200).json({
            status: true,
            data: lottery_price,
            message: `lottery Price create successfully`
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }

};


