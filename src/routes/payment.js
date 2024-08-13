const express = require("express");

const {
    deposit,
    withdraw,
    getWithdraws,
    getRequestWithdraws,
    getDeposits,
    getRequestDeposits,
    setRejectDeposit,
    setRejectwithdraw,
    setApprovewithdraw,
    setApproveDeposit,
    depositsHistory,
    withdrawHistory
} = require("../controller/paymentController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { paymentvalidStatus } = require("../middleware/paymentStatus");
const { currency } = require("../controller/updateCurrency");
const router = express.Router();


// -----------------------------------------------//
// ------------------ User side ----------------- // 
// -----------------------------------------------//

// -->  http://localhost:8002/thailottery/api/user/payment

router.route("/deposit").post(isAuthenticatedUser, deposit);                                                                    // OK 
router.route("/withdraw").post(isAuthenticatedUser, withdraw);                                                                  // OK

router.route("/deposite/history").get(isAuthenticatedUser, depositsHistory);                                                    // OK 
router.route("/withdraw/history").get(isAuthenticatedUser, withdrawHistory);                                                    // OK



// -----------------------------------------------//
// ------------------ Admin side ---------------- // 
// -----------------------------------------------//

// -->  http://localhost:8002/thailottery/api/admin/payment

router.route("/deposites").get(isAuthenticatedUser, authorizeRoles("admin"), getDeposits);                                      // OK
router.route("/:status/deposites").get(isAuthenticatedUser, authorizeRoles("admin"), paymentvalidStatus, getRequestDeposits);   // OK

router.route("/withdraws").get(isAuthenticatedUser, authorizeRoles("admin"), getWithdraws);                                     // OK
router.route("/:status/withdraws").get(isAuthenticatedUser, authorizeRoles("admin"), paymentvalidStatus, getRequestWithdraws);   // OK


router.route("/deposite/approve/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setApproveDeposit);                     // Ok
router.route("/deposite/reject/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setRejectDeposit);                       // OK  

router.route("/withdraw/approve/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setApprovewithdraw);                    // Ok
router.route("/withdraw/reject/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setRejectwithdraw);                      // OK



module.exports = router;