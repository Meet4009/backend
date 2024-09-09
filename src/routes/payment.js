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
    withdrawHistory,
    userDepositsHistory,
    userWithdrawHistory
} = require("../controller/paymentController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { paymentvalidStatus } = require("../middleware/paymentStatus");
const { currency } = require("../controller/updateCurrency");
const router = express.Router();


// -----------------------------------------------//
// ------------------ User side ----------------- // 
// -----------------------------------------------//

// -->  http://localhost:8002/api/user/payment

router.route("/deposit").post(isAuthenticatedUser, deposit);
router.route("/withdraw").post(isAuthenticatedUser, withdraw);

router.route("/deposit-history").get(isAuthenticatedUser, depositsHistory);
router.route("/withdraw-history").get(isAuthenticatedUser, withdrawHistory);



// -----------------------------------------------//
// ------------------ Admin side ---------------- // 
// -----------------------------------------------//

// -->  http://localhost:8002/api/admin/payment

router.route("/deposits").get(isAuthenticatedUser, authorizeRoles("admin"), getDeposits);
router.route("/:status/deposits").get(isAuthenticatedUser, authorizeRoles("admin"), paymentvalidStatus, getRequestDeposits);

router.route("/withdrawals").get(isAuthenticatedUser, authorizeRoles("admin"), getWithdraws);
router.route("/:status/withdrawals").get(isAuthenticatedUser, authorizeRoles("admin"), paymentvalidStatus, getRequestWithdraws);


router.route("/deposit/approve/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setApproveDeposit);
router.route("/deposit/reject/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setRejectDeposit);

router.route("/withdraw/approve/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setApprovewithdraw);
router.route("/withdraw/reject/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setRejectwithdraw);

router.route("/deposit-history/:id").get(isAuthenticatedUser, authorizeRoles("admin"), userDepositsHistory);
router.route("/withdraw-history/:id").get(isAuthenticatedUser, authorizeRoles("admin"), userWithdrawHistory);


module.exports = router;