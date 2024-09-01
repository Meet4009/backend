const express = require("express");


const { addLotteryPrice, lotteryPrice } = require("../controller/lotteryPrice");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();


//------------------------------------------------------//
//--------------------- Admin side ---------------------//
//------------------------------------------------------//

// --> http://localhost:8002/thailottery/api/admin

router.route("/set/lottery-prices").post(isAuthenticatedUser, authorizeRoles("admin"), addLotteryPrice);    // OK
router.route("/lottery-price").get(isAuthenticatedUser, authorizeRoles("admin"), lotteryPrice);            // OK 



//------------------------------------------------------//
//---------------------- User side ---------------------//
//------------------------------------------------------//

// --> http://localhost:8002/thailottery/api

// router.route("/user/lottery-price").get(isAuthenticatedUser, lotteryPrice);                                 // OK


module.exports = router;