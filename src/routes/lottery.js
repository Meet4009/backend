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

// --> https://thailottery.onrender.com/api/admin/lottery

router.route("/newlottery").post(isAuthenticatedUser, authorizeRoles("admin"), setlottery);
router.route("/all-lottery").get(isAuthenticatedUser, authorizeRoles("admin"), getLotterys);
router.route("/choose-winner").get(isAuthenticatedUser, authorizeRoles("admin"), getAllPendingTickets);
router.route("/loss-buyer/:id").get(isAuthenticatedUser, authorizeRoles("admin"), lossbuyer);
router.route("/win-buyer/:id").post(isAuthenticatedUser, authorizeRoles("admin"), winbuyer);  // admin
router.route("/winner-space/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getWinnerSpace);  // admin
router.route("/all-winner").get(isAuthenticatedUser, authorizeRoles("admin"), allWinners);

// router.route("/newlottery").post(setlottery);
// router.route("/all-lottery").get(getLotterys);
// router.route("/choose-winner").get(getAllPendingTickets);
// router.route("/loss-buyer/:id").get(lossbuyer);
// router.route("/win-buyer/:id").post(winbuyer);  // admin
// router.route("/winner-space/:id").get(getWinnerSpace);  // admin
// router.route("/all-winner").get(allWinners);


// -----------------------------------------------//
// ------------------ User side ----------------- // 
// -----------------------------------------------//

// --> https://thailottery.onrender.com/api/user/lottery

router.route("/all-lotteries").get(isAuthenticatedUser, getAllLotterys);
router.route("/details/:id").get(isAuthenticatedUser, getLotteryDetails);
router.route("/ticket-number").get(isAuthenticatedUser, genarateTicketNumber);
router.route("/buy-lottery").post(isAuthenticatedUser, buylottery);
router.route("/pending-ticket").get(isAuthenticatedUser, pendingTickets);
router.route("/all-ticket").get(isAuthenticatedUser, ticketHistory);
router.route("/latest-winners/:id").get(isAuthenticatedUser, allWinners);  // admin


module.exports = router;