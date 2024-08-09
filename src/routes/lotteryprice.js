const express = require("express");


const { setlotteryPrice } = require("../controller/setLotteryprice");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// --> http://localhost:8002/thailottery/api
router.route("/lottery-price").post(isAuthenticatedUser, authorizeRoles("admin"), setlotteryPrice);    // OK


module.exports = router;