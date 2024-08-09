const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { dashboard } = require("../controller/dashbord");


const router = express.Router();

// --> http://localhost:8002/thailottery/api/admin

router.route("/dashboard").get(isAuthenticatedUser, authorizeRoles("admin"), dashboard);                // 


module.exports = router;