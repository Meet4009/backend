const cron = require('node-cron');
const LotteryDraw = require('../models/lotteryDraw');
const LotteryBuyer = require('../models/lotteryBuyer')
const ErrorHander = require('../utils/errorhander');
const lotteryBuyer = require('../models/lotteryBuyer');
const User = require('../models/userModel');
const { currencyConveraterToUSD } = require('./currencyConverater');

// const scheduleLotteryDraw = async (drawDate) => {
//     try {
//         const date = new Date(drawDate);

//         // Format cron string for the specific date and time
//         // const cronString = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
//         const cronString = `0 0 ${date.getDate()} ${date.getMonth() + 1} *`;

//         cron.schedule(cronString, async () => {
//             try {
//                 console.log(`Scheduled draw for: ${drawDate}`);
//                 const lottery = await LotteryDraw.find({ drawDate: new Date().toISOString().split('T')[0] }).populate('lottery_id');
//                 if (!lottery || lottery.length == 0) {
//                     throw new ErrorHander("The lottery is not drawing at this time.", 400);
//                 }

//                 let startDate = new Date();
//                 let nextDrawDate = new Date(startDate);
//                 const repeatInterval = lottery[0].lottery_id.repeatDraw;
//                 nextDrawDate.setDate(nextDrawDate.getDate() + repeatInterval);

//                 // change status
//                 const AllActiveLottery = await LotteryDraw.find({ status: 'active' })

//                 AllActiveLottery.map(async (curr) => {
//                     let drawDate = new Date(curr.drawDate);

//                     let currentDate = new Date();

//                     if (drawDate <= currentDate) {
//                         let currentloteryDraw = await LotteryDraw.findById(curr.id)
//                         currentloteryDraw.status = 'done';
//                         await currentloteryDraw.save();

//                         const buyers = await lotteryBuyer.find({
//                             lottery_draw_id: curr.id,
//                             status: 'win'
//                         }).populate('lottery_price_id');

//                         await Promise.all(buyers.map(async (currentBuyer) => {
//                             const currentUser = await User.findById(currentBuyer.user_id);
//                             const convertedPrice = await currencyConveraterToUSD(764, currentBuyer.lottery_price_id.price);

//                             currentUser.balance += convertedPrice;

//                             await currentUser.save();
//                         }));

//                         let allPendingLotteryBuyers = await LotteryBuyer.find({ status: 'pending', lottery_draw_id: curr.id })

//                         allPendingLotteryBuyers.map(async (currentData) => {
//                             let currentloteryBuyer = await LotteryBuyer.findById(currentData.id)
//                             currentloteryBuyer.status = 'loss';
//                             await currentloteryBuyer.save();
//                         })
//                     }
//                 })

//                 const newLotteryDraw = new LotteryDraw({
//                     lottery_id: lottery[0].lottery_id._id,
//                     startDate: startDate.toISOString().split('T')[0],
//                     drawDate: nextDrawDate.toISOString().split('T')[0],
//                 });

//                 await newLotteryDraw.save();

//                 // Schedule the next draw recursively
//                 scheduleLotteryDraw(nextDrawDate);

//             } catch (error) {
//                 console.error("Error during lottery draw:", error);
//             }
//         }, {
//             scheduled: true,
//             timezone: "Asia/Kolkata"
//         });

//         console.log(`Next draw scheduled at ${cronString}`);
//     } catch (error) {
//         console.error("Error scheduling lottery draw:", error);
//     }
// };


const scheduleLotteryDraw = async (drawDate) => {
    try {
        const date = new Date(drawDate);
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log("timeZone", timeZone);


        // Format cron string for the specific date and time
        const cronString = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
        // const cronString = `0 0 ${date.getDate()} ${date.getMonth() + 1} *`;

        cron.schedule(cronString, async () => {
            try {
                console.log(`Scheduled draw for: ${drawDate}`);
                const lottery = await LotteryDraw.find({ drawDate: new Date().toISOString().split('T')[0] }).populate('lottery_id');
                if (!lottery || lottery.length == 0) {
                    throw new ErrorHander("The lottery is not drawing at this time.", 400);
                }

                let startDate = new Date();
                let nextDrawDate = new Date();
                const repeatInterval = lottery[0].lottery_id.repeatDraw;
                nextDrawDate.setMinutes(nextDrawDate.getMinutes() + repeatInterval);

                // change status
                const AllActiveLottery = await LotteryDraw.find({ status: 'active' })

                AllActiveLottery.map(async (curr) => {
                    let drawDate = new Date(curr.drawDate);

                    let currentDate = new Date();

                    if (drawDate <= currentDate) {
                        let currentloteryDraw = await LotteryDraw.findById(curr.id)
                        currentloteryDraw.status = 'done';
                        await currentloteryDraw.save();

                        // const buyers = await lotteryBuyer.find({
                        //     lottery_draw_id: curr.id,
                        //     status: 'win'
                        // }).populate('lottery_price_id');

                        // await Promise.all(buyers.map(async (currentBuyer) => {

                            
                        //     const convertedPrice = await currencyConveraterToUSD(764, currentBuyer.lottery_price_id.price);
                        //     const currentUser = await User.findById(currentBuyer.user_id);
                            
                        //     currentUser.balance = currentUser.balance + convertedPrice;
                        //     console.log("currentbuyer",  currentUser.balance);

                        //     await currentUser.save();
                        // }));

                        const buyers = await lotteryBuyer.find({
                            lottery_draw_id: curr.id,
                            status: 'win'
                          }).populate('lottery_price_id');
                          
                          const userUpdates = buyers.reduce(async (prevPromise, currentBuyer) => {
                            await prevPromise; // Ensure previous updates are completed before proceeding to the next one
                            try {
                              // Convert the price to USD
                              const convertedPrice = await currencyConveraterToUSD(764, currentBuyer.lottery_price_id.price);
                          
                              // Find the user by ID
                              const currentUser = await User.findById(currentBuyer.user_id);
                          
                              if (currentUser) {
                                // Add the converted price to the user's balance
                                currentUser.balance += convertedPrice;
                          
                                // Save the user with the updated balance
                                await currentUser.save();
                          
                                console.log(`Updated balance for user ${currentUser._id}:`, currentUser.balance);
                              } else {
                                console.error(`User with ID ${currentBuyer.user_id} not found`);
                              }
                            } catch (error) {
                              console.error(`Error updating balance for buyer ${currentBuyer.user_id}:`, error);
                            }
                          }, Promise.resolve()); // Initialize with a resolved promise to kick off the reduce chain
                          
                          await userUpdates; // Wait for all updates to complete
                          
                          

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
            timezone: process.env.TIME_ZONE || 'UTC'
        });


        console.log(`Next draw scheduled at ${cronString}`);
    } catch (error) {
        console.error("Error scheduling lottery draw:", error);
    }
};


module.exports = {
    scheduleLotteryDraw
};
