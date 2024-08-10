const express = require("express");


const { setlotteryPrice, lotteryPrice } = require("../controller/lotteryPrice");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();


//------------------------------------------------------//
//--------------------- Admin side ---------------------//
//------------------------------------------------------//

// --> http://localhost:8002/thailottery/api

router.route("/add/lottery-price").post(isAuthenticatedUser, authorizeRoles("admin"), setlotteryPrice);    // OK



//------------------------------------------------------//
//---------------------- User side ---------------------//
//------------------------------------------------------//

// --> http://localhost:8002/thailottery/api

router.route("/user/lottery-price").get(isAuthenticatedUser, lotteryPrice);                                 // OK


module.exports = router;