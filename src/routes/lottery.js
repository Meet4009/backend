const express = require("express");


const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { setlottery } = require("../controller/lottery");


const router = express.Router();

router.route("/lottery").post(isAuthenticatedUser, authorizeRoles("admin"), setlottery);


module.exports = router;