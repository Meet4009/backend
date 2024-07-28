const express = require("express");


const { setlotteryPrice } = require("../controller/setLotteryprice");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


const router = express.Router();

router.route("/lotteryprice").post(isAuthenticatedUser, authorizeRoles("admin"), setlotteryPrice);


module.exports = router;