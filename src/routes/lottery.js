const express = require("express");
const Service = require("../services/render");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { setlottery,
    buylottery,
    genarateTicketNumber,
    pendingTickets,
    ticketHistory,
    getAllPendingTickets,
    lossbuyer,
    winbuyer,
    getLotterys,
    getWinnerSpace,
    allWinners,
    getallLotterys,
    getLotteryDetails } = require("../controller/lottery");
const router = express.Router();

// fortend Routes
router.get('/all-lotteries', Service.allLottries)
// router.get('/allwinner', Service.totalWinning)
router.get('/chooseWinner', Service.chooseWinner)


// -----------------------------------------------//
// ------------------ Admin side ---------------- // 
// -----------------------------------------------//

// --> http://localhost:8002/thailottery/api/admin/lottery

router.route("/newlottery").post(isAuthenticatedUser, authorizeRoles("admin"), setlottery);                      // OK
// router.route("/all-lottery").get(getLotterys);                     // OK
router.route("/all-lottery").get(isAuthenticatedUser, authorizeRoles("admin"), getLotterys);                     // OK

// router.route("/choose-winner").get(getAllPendingTickets);          // OK
router.route("/choose-winner").get(isAuthenticatedUser, authorizeRoles("admin"), getAllPendingTickets);          // OK

router.route("/loss-buyer/:id").get(isAuthenticatedUser, authorizeRoles("admin"), lossbuyer);                    // OK
router.route("/win-buyer/:id").post(isAuthenticatedUser, authorizeRoles("admin"), winbuyer);  // admin
router.route("/winner-space/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getWinnerSpace);  // admin

// router.route("/allwinner/:id").get(allWinners);  // admin
router.route("/allwinner/:id").get(isAuthenticatedUser, authorizeRoles("admin"), allWinners);  // admin


// -----------------------------------------------//
// ------------------ User side ----------------- // 
// -----------------------------------------------//

// --> http://localhost:8002/thailottery/api/user/lottery

router.route("/alllottery").get(isAuthenticatedUser, getallLotterys);                          // OK
router.route("/details/:id").get(isAuthenticatedUser, getLotteryDetails);                          // OK
router.route("/ticket-number").get(isAuthenticatedUser, genarateTicketNumber);              // Ok
router.route("/buylottery").post(isAuthenticatedUser, buylottery);                          // OK 
router.route("/pending-ticket").get(isAuthenticatedUser, pendingTickets);                   // OK
router.route("/all-ticket").get(isAuthenticatedUser, ticketHistory);                        // OK





module.exports = router;