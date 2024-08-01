const Agenda = require('agenda');
const { drawLottery } = require("../controller/lotteryschedule");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


const nextLotteryDraw = async (drawDate) => {
    try {
        const mongoConnectionString = process.env.DB_URL;

        const agenda = new Agenda({ db: { address: mongoConnectionString } });
        await agenda.start();
        agenda.define('renew lottery draw', async () => drawLottery());

        const specificDate = new Date(drawDate);
        console.log("specificDat", specificDate);
        await agenda.schedule(specificDate, 'renew lottery draw');
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    nextLotteryDraw
}
