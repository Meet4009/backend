const fetch = require('node-fetch');
const User = require("../models/userModel");


const currrencyConverater = async(currency_code, currrency) => {
    try {
        let currrencyApiKey = process.env.CURRENCY_API_KEY
        let endPoint = `https://api.freecurrencyapi.com/v1/latest?apikey=${currrencyApiKey}&currencies=INR&base_currency=THB`
        let returnablecurrrency = 0

        let res = await fetch(endPoint)
        let data = await res.json()
        

        // if(currency_code == 764){
        //     return currrency
        // }
        return data
    } catch (error) {
        return error

    }



}

exports.currency = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.currrency_code = req.body.currrency_code

        await user.save();

        res.status(201).json({
            status: true,
            data: await currrencyConverater(356, 1000),
            message: "currency change successfully"
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error.message}`
        });
    }
}


