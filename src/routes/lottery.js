const express = require("express");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { setlottery,
    getLottery,
    buylottery,
    genarateTicketNumber,
    pendingTickets,
    ticketHistory,
    getAllPendingTickets,
    lossbuyer,
    winbuyer,
    getLotterys,
    getWinnerSpace, 
    allWinners} = require("../controller/lottery");
const router = express.Router();


// -----------------------------------------------//
// ------------------ Admin side ---------------- // 
// -----------------------------------------------//

// --> http://localhost:8002/thailottery/api/admin/lottery

router.route("/newlottery").post(isAuthenticatedUser, authorizeRoles("admin"), setlottery);                      // OK
router.route("/all-lottery").get(isAuthenticatedUser, authorizeRoles("admin"), getLotterys);                     // OK

router.route("/choose-winner").get(isAuthenticatedUser, authorizeRoles("admin"), getAllPendingTickets);          // OK

router.route("/loss-buyer/:id").get(isAuthenticatedUser, authorizeRoles("admin"), lossbuyer);                    // OK
router.route("/win-buyer/:id").post(isAuthenticatedUser, authorizeRoles("admin"), winbuyer);  // admin
router.route("/winner-space/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getWinnerSpace);  // admin
router.route("/allwinner/:id").get(isAuthenticatedUser, authorizeRoles("admin"), allWinners);  // admin


// -----------------------------------------------//
// ------------------ User side ----------------- // 
// -----------------------------------------------//

// --> http://localhost:8002/thailottery/api/user/lottery

router.route("/details/:id").get(isAuthenticatedUser, getLottery);                          // OK
router.route("/ticket-number").get(isAuthenticatedUser, genarateTicketNumber);              // Ok
router.route("/buylottery").post(isAuthenticatedUser, buylottery);                          // OK 
router.route("/pending-ticket").get(isAuthenticatedUser, pendingTickets);                   // OK
router.route("/all-ticket").get(isAuthenticatedUser, ticketHistory);                        // OK





module.exports = router;