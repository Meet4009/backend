const express = require("express");


const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { setlottery, getLottery, buylottery, genarateTicketNumber } = require("../controller/lottery");


const router = express.Router();

router.route("/lottery").post(isAuthenticatedUser, authorizeRoles("admin"), setlottery);
router.route("/lottery/:id").get(isAuthenticatedUser, getLottery);
router.route("/buylottery").post(isAuthenticatedUser, buylottery);
router.route("/ticket-number").get(isAuthenticatedUser, genarateTicketNumber);


module.exports = router;