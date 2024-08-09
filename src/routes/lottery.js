const express = require("express");


const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { setlottery, getLottery, buylottery, genarateTicketNumber, pendingTickets, ticketHistory, getAllPendingTickets, lossbuyer, winbuyer, getLotterys } = require("../controller/lottery");

const router = express.Router();


// -----------------------------------------------//
// ------------------ Admin side ---------------- // 
// -----------------------------------------------//

router.route("/newlottery").post(isAuthenticatedUser, authorizeRoles("admin"), setlottery);                      // OK
router.route("/all-lottery").get(isAuthenticatedUser, authorizeRoles("admin"), getLotterys);                     // OK

router.route("/choose-winner").get(isAuthenticatedUser, authorizeRoles("admin"), getAllPendingTickets);          // OK

router.route("/loss-buyer/:id").get(isAuthenticatedUser, authorizeRoles("admin"), lossbuyer);                    // OK
router.route("/win-buyer/:id").post(isAuthenticatedUser, authorizeRoles("admin"), winbuyer);  // admin



// -----------------------------------------------//
// ------------------ User side ----------------- // 
// -----------------------------------------------//

router.route("/details/:id").get(isAuthenticatedUser, getLottery);                          // OK
router.route("/ticket-number").get(isAuthenticatedUser, genarateTicketNumber);              // Ok
router.route("/buylottery").post(isAuthenticatedUser, buylottery);                          // OK 
router.route("/pending-ticket").get(isAuthenticatedUser, pendingTickets);                   // OK
router.route("/all-ticket").get(isAuthenticatedUser, ticketHistory);                        // OK



module.exports = router;