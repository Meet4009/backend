const express = require("express");


const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { setlottery, getLottery, buylottery, genarateTicketNumber, pendingTickets, ticketHistory, getAllPendingTickets } = require("../controller/lottery");


const router = express.Router();

router.route("/lottery").post(isAuthenticatedUser, authorizeRoles("admin"), setlottery);    // admin
router.route("/lottery/:id").get(isAuthenticatedUser, getLottery);                          // user
router.route("/buylottery").post(isAuthenticatedUser, buylottery);                          // user 
router.route("/ticket-number").get(isAuthenticatedUser, genarateTicketNumber);              //user 
router.route("/pending-ticket").get(isAuthenticatedUser, pendingTickets);                   // user 
router.route("/all-ticket").get(isAuthenticatedUser, ticketHistory);                        // user
router.route("/choose-winner").get(isAuthenticatedUser, authorizeRoles("admin"), getAllPendingTickets);  // admin


module.exports = router;