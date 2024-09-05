const express = require("express");

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
    getLotteryDetails,
    getAllLotterys } = require("../controller/lottery");
const router = express.Router();


// -----------------------------------------------//
// ------------------ Admin side ---------------- // 
// -----------------------------------------------//

// --> http://localhost:8002/thailottery/api/admin/lottery

router.route("/newlottery").post(isAuthenticatedUser, authorizeRoles("admin"), setlottery);
router.route("/all-lottery").get(isAuthenticatedUser, authorizeRoles("admin"), getLotterys);
router.route("/choose-winner").get(isAuthenticatedUser, authorizeRoles("admin"), getAllPendingTickets);
router.route("/loss-buyer/:id").get(isAuthenticatedUser, authorizeRoles("admin"), lossbuyer);
router.route("/win-buyer/:id").post(isAuthenticatedUser, authorizeRoles("admin"), winbuyer);  // admin
router.route("/winner-space/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getWinnerSpace);  // admin
router.route("/allwinner/:id").get(isAuthenticatedUser, authorizeRoles("admin"), allWinners);  // admin


// -----------------------------------------------//
// ------------------ User side ----------------- // 
// -----------------------------------------------//

// --> http://localhost:8002/thailottery/api/user/lottery

router.route("/all-lotteries").get(getAllLotterys);
router.route("/details/:id").get(getLotteryDetails);
router.route("/ticket-number").get(genarateTicketNumber);
router.route("/buy-lottery").post(buylottery);
router.route("/pending-ticket").get(pendingTickets);
router.route("/all-ticket").get(ticketHistory);





module.exports = router;