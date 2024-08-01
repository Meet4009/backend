const cron = require('node-cron');
const drawLottery = require("../controller/lotteryschedule");

const scheduleLotteryDraw = (drawDate) => {
    let x = 1;
    console.log(x);
    x++;

    const date = new Date(drawDate);

    // Format cron string for the specific date and time
    const cronString = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;

    cron.schedule(cronString, async () => {
        console.log(`Scheduled draw for: ${drawDate}`);
        await drawLottery();
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });

    console.log(`Next draw scheduled at ${drawDate}`);
};

module.exports = {
    scheduleLotteryDraw
};
