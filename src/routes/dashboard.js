const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { dashboard } = require("../controller/dashbord");

const router = express.Router();

// router.route("/dashboard").get(isAuthenticatedUser, authorizeRoles("admin"), dashboard);                 
router.route("/dashboard").get(dashboard);                 


module.exports = router;
// --> http://localhost:8002/thailottery/api/admin                            // try in postman