const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { dashboard } = require("../controller/dashbord");

const router = express.Router();
const services = require('../services/render');

router.get('/', services.homeRoutes);


router.route("/dashboard").get(dashboard);                 // OK
// router.route("/dashboard").get(isAuthenticatedUser, authorizeRoles("admin"), dashboard);                 // OK


module.exports = router;
// --> http://localhost:8002/thailottery/api/admin                            // try in postman