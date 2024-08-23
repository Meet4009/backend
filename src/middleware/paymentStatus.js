const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");


exports.paymentvalidStatus = async (req, res, next) => {
    try {
        const validStatuses = ['approved', 'rejected', 'pending']; // Define valid statuses
        const status = req.params.status;

        if (!validStatuses.includes(status)) {
            return res.status(400).send('Invalid status');
        }
        next();
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
}