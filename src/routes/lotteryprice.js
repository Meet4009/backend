const express = require("express");

const { addLotteryPrice, lotteryPrice } = require("../controller/lotteryPrice");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();


//------------------------------------------------------//
//--------------------- Admin side ---------------------//
//------------------------------------------------------//

// --> http://localhost:8002/thailottery/api/admin

router.route("/set/lottery-prices").post(isAuthenticatedUser, authorizeRoles("admin"), addLotteryPrice);    
router.route("/lottery-price").get(isAuthenticatedUser, authorizeRoles("admin"), lotteryPrice);             


module.exports = router;