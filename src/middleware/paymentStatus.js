const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");


exports.paymentvalidStatus = catchAsyncErrors(async (req, res, next) => {
    const validStatuses = ['approved', 'rejected', 'pending']; // Define valid statuses
    const status = req.params.status;

    if (!validStatuses.includes(status)) {
        return res.status(400).send('Invalid status');
    }
    next();
})