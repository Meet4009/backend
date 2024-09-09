const cron = require('node-cron');
const LotteryDraw = require('../models/lotteryDraw');
const LotteryBuyer = require('../models/lotteryBuyer')
const ErrorHander = require('../utils/errorhander');
const lotteryBuyer = require('../models/lotteryBuyer');
const userModel = require('../models/userModel');
const { currencyConveraterToUSD } = require('./currencyConverater');

const scheduleLotteryDraw = async (drawDate) => {
    try {
        const date = new Date(drawDate);

        // Format cron string for the specific date and time
        const cronString = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;

        cron.schedule(cronString, async () => {
            try {
                console.log(`Scheduled draw for: ${drawDate}`);
                const lottery = await LotteryDraw.find({ drawDate: new Date().toISOString().split('T')[0] }).populate('lottery_id');
                if (!lottery || lottery.length == 0) {
                    throw new ErrorHander("The lottery is not drawing at this time.", 400);
                }

                let startDate = new Date();
                let nextDrawDate = new Date(startDate);
                const repeatInterval = lottery[0].lottery_id.repeatDraw;
                nextDrawDate.setDate(nextDrawDate.setDate() + repeatInterval);

                // change status
                const AllActiveLottery = await LotteryDraw.find({ status: 'active' })

                AllActiveLottery.map(async (curr) => {
                    let drawDate = new Date(curr.drawDate);

                    let currentDate = new Date();

                    if (drawDate <= currentDate) {
                        let currentloteryDraw = await LotteryDraw.findById(curr.id)
                        currentloteryDraw.status = 'done';
                        await currentloteryDraw.save();

                        const buyers = await lotteryBuyer.find({
                            lottery_draw_id: curr.id,
                            status: 'win'
                        }).populate('lottery_price_id');
                        
                        await Promise.all(buyers.map(async (currentBuyer) => {
                            const currentUser = await userModel.findById(currentBuyer.user_id);
                            const convertedPrice = await currencyConveraterToUSD(764, currentBuyer.lottery_price_id.price);
                            
                            currentUser.balance += convertedPrice;
                            
                            await currentUser.save();
                        }));
  
                        let allPendingLotteryBuyers = await LotteryBuyer.find({ status: 'pending', lottery_draw_id: curr.id })

                        allPendingLotteryBuyers.map(async (currentData) => {
                            let currentloteryBuyer = await LotteryBuyer.findById(currentData.id)
                            currentloteryBuyer.status = 'loss';
                            await currentloteryBuyer.save();
                        })
                    }
                })

                const newLotteryDraw = new LotteryDraw({
                    lottery_id: lottery[0].lottery_id._id,
                    startDate: startDate.toISOString().split('T')[0],
                    drawDate: nextDrawDate.toISOString().split('T')[0],
                });

                await newLotteryDraw.save();

                // Schedule the next draw recursively
                scheduleLotteryDraw(nextDrawDate);

            } catch (error) {
                console.error("Error during lottery draw:", error);
            }
        }, {
            scheduled: true,
            timezone: "Asia/Kolkata"
        });

        console.log(`Next draw scheduled at ${drawDate}`);
    } catch (error) {
        console.error("Error scheduling lottery draw:", error);
    }
};

module.exports = {
    scheduleLotteryDraw
};
